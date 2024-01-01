import { Component, Vue, Inject } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import { IStade } from '@/shared/model/stade.model';
import JhiDataUtils from '@/shared/data/data-utils.service';

import StadeService from './stade.service';
import AlertService from '@/shared/alert/alert.service';
import ImageService from '@/entities/image/image.service';
import { IImage, Image } from '@/shared/model/image.model';
import { mixins } from 'vue-class-component';

const validations: any = {
  image: {
    photo: {},
  },
};
@Component({
  mixins: [Vue2Filters.mixin],
  validations,
})
export default class Stade extends mixins(JhiDataUtils) {
  @Inject('stadeService') private stadeService: () => StadeService;
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('imageService') private imageService: () => ImageService;

  private removeId: number = null;
  public itemsPerPage = 20;
  public queryCount: number = null;
  public page = 1;
  public previousPage = 1;
  public propOrder = 'id';
  public reverse = false;
  public totalItems = 0;

  public stades: IStade[] = [];

  public stade: IStade;

  private image: IImage = new Image();

  public isFetching = false;

  public mounted(): void {
    this.retrieveAllStades();
  }

  public clear(): void {
    this.page = 1;
    this.retrieveAllStades();
  }

  public retrieveAllStades(): void {
    this.isFetching = true;
    const paginationQuery = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };
    this.stadeService()
      .retrieve(paginationQuery)
      .then(
        res => {
          this.stades = res.data;
          this.totalItems = Number(res.headers['x-total-count']);
          this.queryCount = this.totalItems;
          this.isFetching = false;
        },
        err => {
          this.isFetching = false;
          this.alertService().showHttpError(this, err.response);
        }
      );
  }

  public handleSyncList(): void {
    this.clear();
  }

  public prepareRemove(instance: IStade): void {
    this.removeId = instance.id;
    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }

  public removeStade(): void {
    this.stadeService()
      .delete(this.removeId)
      .then(() => {
        const message = this.$t('pathogeneApp.stade.deleted', { param: this.removeId });
        (this.$root as any).$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
        this.removeId = null;
        this.retrieveAllStades();
        this.closeDialog();
      })
      .catch(error => {
        const message = "You can't delete this Stade";
        (this.$root as any).$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Error',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
      });
  }

  public sort(): Array<any> {
    const result = [this.propOrder + ',' + (this.reverse ? 'desc' : 'asc')];
    if (this.propOrder !== 'id') {
      result.push('id');
    }
    return result;
  }

  public prepareCeate(instance: IStade) {
    this.stade = instance;
    if (<any>this.$refs.createEntity) {
      (<any>this.$refs.createEntity).show();
    }
  }

  public async saveImage() {
    this.image.stade = this.stade;
    try {
      await this.imageService().create(this.image);
      this.closeDialog();
      return (this.$root as any).$bvToast.toast('An image is created', {
        toaster: 'b-toaster-top-center',
        title: 'Info',
        variant: 'info',
        solid: true,
        autoHideDelay: 5000,
      });
    } catch (e) {
      console.log(e);
    }
  }

  public loadPage(page: number): void {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  public transition(): void {
    this.retrieveAllStades();
  }

  public changeOrder(propOrder): void {
    this.propOrder = propOrder;
    this.reverse = !this.reverse;
    this.transition();
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
  }

  public clearInputImage(field, fieldContentType, idInput): void {
    if (this.image && field && fieldContentType) {
      if (Object.prototype.hasOwnProperty.call(this.image, field)) {
        this.image[field] = null;
      }
      if (Object.prototype.hasOwnProperty.call(this.image, fieldContentType)) {
        this.image[fieldContentType] = null;
      }
      if (idInput) {
        (<any>this).$refs[idInput] = null;
      }
    }
  }
}
