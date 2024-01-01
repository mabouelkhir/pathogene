import { Component, Inject } from 'vue-property-decorator';

import { mixins } from 'vue-class-component';
import JhiDataUtils from '@/shared/data/data-utils.service';

import AlertService from '@/shared/alert/alert.service';

import StadeService from '@/entities/stade/stade.service';
import { IStade } from '@/shared/model/stade.model';

import { IImage, Image } from '@/shared/model/image.model';
import ImageService from './image.service';

const validations: any = {
  image: {
    code: {},
    photo: {},
  },
};

@Component({
  validations,
})
export default class ImageUpdate extends mixins(JhiDataUtils) {
  @Inject('imageService') private imageService: () => ImageService;
  @Inject('alertService') private alertService: () => AlertService;

  public image: IImage = new Image();

  @Inject('stadeService') private stadeService: () => StadeService;

  public stades: IStade[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.imageId) {
        vm.retrieveImage(to.params.imageId);
      }
      vm.initRelationships();
    });
  }

  created(): void {
    this.currentLanguage = this.$store.getters.currentLanguage;
    this.$store.watch(
      () => this.$store.getters.currentLanguage,
      () => {
        this.currentLanguage = this.$store.getters.currentLanguage;
      }
    );
  }

  public save(): void {
    this.isSaving = true;
    if (this.image.id) {
      this.imageService()
        .update(this.image)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('pathogeneApp.image.updated', { param: param.id });
          return (this.$root as any).$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Info',
            variant: 'info',
            solid: true,
            autoHideDelay: 5000,
          });
        })
        .catch(error => {
          this.isSaving = false;
          this.alertService().showHttpError(this, error.response);
        });
    } else {
      this.imageService()
        .create(this.image)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('pathogeneApp.image.created', { param: param.id });
          (this.$root as any).$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Success',
            variant: 'success',
            solid: true,
            autoHideDelay: 5000,
          });
        })
        .catch(error => {
          this.isSaving = false;
          this.alertService().showHttpError(this, error.response);
        });
    }
  }

  public retrieveImage(imageId): void {
    this.imageService()
      .find(imageId)
      .then(res => {
        this.image = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState(): void {
    this.$router.go(-1);
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

  public initRelationships(): void {
    this.stadeService()
      .retrieve()
      .then(res => {
        this.stades = res.data;
      });
  }
}
