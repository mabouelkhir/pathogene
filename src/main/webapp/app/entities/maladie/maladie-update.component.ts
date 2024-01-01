import { Component, Vue, Inject } from 'vue-property-decorator';

import AlertService from '@/shared/alert/alert.service';

import DetectionService from '@/entities/detection/detection.service';
import { IDetection } from '@/shared/model/detection.model';

import PatientService from '@/entities/patient/patient.service';
import { IPatient } from '@/shared/model/patient.model';

import StadeService from '@/entities/stade/stade.service';
import { IStade } from '@/shared/model/stade.model';

import UnclassifiedService from '@/entities/unclassified/unclassified.service';
import { IUnclassified } from '@/shared/model/unclassified.model';

import { IMaladie, Maladie } from '@/shared/model/maladie.model';
import MaladieService from './maladie.service';

const validations: any = {
  maladie: {
    nom: {},
  },
};

@Component({
  validations,
})
export default class MaladieUpdate extends Vue {
  @Inject('maladieService') private maladieService: () => MaladieService;
  @Inject('alertService') private alertService: () => AlertService;

  public maladie: IMaladie = new Maladie();

  @Inject('detectionService') private detectionService: () => DetectionService;

  public detections: IDetection[] = [];

  @Inject('patientService') private patientService: () => PatientService;

  public patients: IPatient[] = [];

  @Inject('stadeService') private stadeService: () => StadeService;

  public stades: IStade[] = [];

  @Inject('unclassifiedService') private unclassifiedService: () => UnclassifiedService;

  public unclassifieds: IUnclassified[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.maladieId) {
        vm.retrieveMaladie(to.params.maladieId);
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
    if (this.maladie.id) {
      this.maladieService()
        .update(this.maladie)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('pathogeneApp.maladie.updated', { param: param.id });
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
      this.maladieService()
        .create(this.maladie)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('pathogeneApp.maladie.created', { param: param.id });
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

  public retrieveMaladie(maladieId): void {
    this.maladieService()
      .find(maladieId)
      .then(res => {
        this.maladie = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.detectionService()
      .retrieve()
      .then(res => {
        this.detections = res.data;
      });
    this.patientService()
      .retrieve()
      .then(res => {
        this.patients = res.data;
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
