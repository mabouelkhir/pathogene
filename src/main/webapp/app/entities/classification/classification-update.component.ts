import { Component, Vue, Inject } from 'vue-property-decorator';

import AlertService from '@/shared/alert/alert.service';

import MedecinService from '@/entities/medecin/medecin.service';
import { IMedecin } from '@/shared/model/medecin.model';

import StadeService from '@/entities/stade/stade.service';
import { IStade } from '@/shared/model/stade.model';

import UnclassifiedService from '@/entities/unclassified/unclassified.service';
import { IUnclassified } from '@/shared/model/unclassified.model';

import { IClassification, Classification } from '@/shared/model/classification.model';
import ClassificationService from './classification.service';

const validations: any = {
  classification: {
    code: {},
    score: {},
  },
};

@Component({
  validations,
})
export default class ClassificationUpdate extends Vue {
  @Inject('classificationService') private classificationService: () => ClassificationService;
  @Inject('alertService') private alertService: () => AlertService;

  public classification: IClassification = new Classification();

  @Inject('medecinService') private medecinService: () => MedecinService;

  public medecins: IMedecin[] = [];

  @Inject('stadeService') private stadeService: () => StadeService;

  public stades: IStade[] = [];

  @Inject('unclassifiedService') private unclassifiedService: () => UnclassifiedService;

  public unclassifieds: IUnclassified[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.classificationId) {
        vm.retrieveClassification(to.params.classificationId);
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
    if (this.classification.id) {
      this.classificationService()
        .update(this.classification)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('pathogeneApp.classification.updated', { param: param.id });
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
      this.classificationService()
        .create(this.classification)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('pathogeneApp.classification.created', { param: param.id });
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

  public retrieveClassification(classificationId): void {
    this.classificationService()
      .find(classificationId)
      .then(res => {
        this.classification = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.medecinService()
      .retrieve()
      .then(res => {
        this.medecins = res.data;
      });
    this.stadeService()
      .retrieve()
      .then(res => {
        this.stades = res.data;
      });
    this.unclassifiedService()
      .retrieve()
      .then(res => {
        this.unclassifieds = res.data;
      });
  }
}
