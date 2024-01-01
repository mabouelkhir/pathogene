import { Component, Vue, Inject } from 'vue-property-decorator';

import { IStade } from '@/shared/model/stade.model';
import StadeService from './stade.service';
import AlertService from '@/shared/alert/alert.service';
import JhiDataUtils from '@/shared/data/data-utils.service';
import { mixins } from 'vue-class-component';
import { IImage } from '@/shared/model/image.model';
import ImageService from '@/entities/image/image.service';

@Component
export default class StadeDetails extends mixins(JhiDataUtils) {
  @Inject('stadeService') private stadeService: () => StadeService;
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('imageService') private imageService: () => ImageService;

  public stade: IStade = {};
  public images: IImage[] = [];
  private removeId: number = null;
  public itemsPerPage = 20;
  public queryCount: number = null;
  public page = 1;
  public previousPage = 1;
  public propOrder = 'id';
  public reverse = false;
  public totalItems = 0;

  public isFetching = false;

  public stadeId: number = null;

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.stadeId) {
        vm.stadeId = to.params.stadeId;
        vm.retrieveStade(to.params.stadeId);
        vm.retrieveAllImagesByStade(to.params.stadeId);
      }
    });
  }

  public retrieveStade(stadeId) {
    this.stadeService()
      .find(stadeId)
      .then(res => {
        this.stade = res;
        this.images = res.images;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public retrieveAllImagesByStade(stadeId): void {
    this.isFetching = true;
    const paginationQuery = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };
    this.imageService()
      .retrieveAllByStade(stadeId, paginationQuery)
      .then(
        res => {
          this.images = res.data;
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

  public previousState() {
    this.$router.go(-1);
  }

  public sort(): Array<any> {
    const result = [this.propOrder + ',' + (this.reverse ? 'desc' : 'asc')];
    if (this.propOrder !== 'id') {
      result.push('id');
    }
    return result;
  }

  public prepareRemove(instance: IImage): void {
    this.removeId = instance.id;
    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }

  public removeImage(): void {
    this.imageService()
      .delete(this.removeId)
      .then(() => {
        const message = 'An Image is deleted';
        this.$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
        this.removeId = null;
        this.closeDialog();
        this.$router.push('/maladie');
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
  }

  public loadPage(page: number): void {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  public transition(): void {
    this.retrieveAllImagesByStade(this.stadeId);
  }
}
