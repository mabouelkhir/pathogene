import { Component, Inject } from 'vue-property-decorator';

import { mixins } from 'vue-class-component';
import JhiDataUtils from '@/shared/data/data-utils.service';

import AlertService from '@/shared/alert/alert.service';

import ClassificationService from '@/entities/classification/classification.service';
import { IClassification } from '@/shared/model/classification.model';

import MaladieService from '@/entities/maladie/maladie.service';
import { IMaladie } from '@/shared/model/maladie.model';

import { IUnclassified, Unclassified } from '@/shared/model/unclassified.model';
import UnclassifiedService from './unclassified.service';

const validations: any = {
  unclassified: {
    code: {},
    photo: {},
  },
};

@Component({
  validations,
})
export default class UnclassifiedUpdate extends mixins(JhiDataUtils) {
  @Inject('unclassifiedService') private unclassifiedService: () => UnclassifiedService;
  @Inject('alertService') private alertService: () => AlertService;

  public unclassified: IUnclassified = new Unclassified();

  @Inject('classificationService') private classificationService: () => ClassificationService;

  public classifications: IClassification[] = [];

  @Inject('maladieService') private maladieService: () => MaladieService;

  public maladies: IMaladie[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.unclassifiedId) {
        vm.retrieveUnclassified(to.params.unclassifiedId);
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
    if (this.unclassified.id) {
      this.unclassifiedService()
        .update(this.unclassified)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('pathogeneApp.unclassified.updated', { param: param.id });
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
      this.unclassifiedService()
        .create(this.unclassified)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('pathogeneApp.unclassified.created', { param: param.id });
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

  public retrieveUnclassified(unclassifiedId): void {
    this.unclassifiedService()
      .find(unclassifiedId)
      .then(res => {
        this.unclassified = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public clearInputImage(field, fieldContentType, idInput): void {
    if (this.unclassified && field && fieldContentType) {
      if (Object.prototype.hasOwnProperty.call(this.unclassified, field)) {
        this.unclassified[field] = null;
      }
      if (Object.prototype.hasOwnProperty.call(this.unclassified, fieldContentType)) {
        this.unclassified[fieldContentType] = null;
      }
      if (idInput) {
        (<any>this).$refs[idInput] = null;
      }
    }
  }

  public initRelationships(): void {
    this.classificationService()
      .retrieve()
      .then(res => {
        this.classifications = res.data;
      });
    this.maladieService()
      .retrieve()
      .then(res => {
        this.maladies = res.data;
      });
  }
}
