import { Component, Vue, Inject } from 'vue-property-decorator';

import dayjs from 'dayjs';
import { DATE_TIME_LONG_FORMAT } from '@/shared/date/filters';

import AlertService from '@/shared/alert/alert.service';

import VisiteService from '@/entities/visite/visite.service';
import { IVisite } from '@/shared/model/visite.model';

import PatientService from '@/entities/patient/patient.service';
import { IPatient } from '@/shared/model/patient.model';

import MedecinService from '@/entities/medecin/medecin.service';
import { IMedecin } from '@/shared/model/medecin.model';

import { IRendezVous, RendezVous } from '@/shared/model/rendez-vous.model';
import RendezVousService from './rendez-vous.service';

const validations: any = {
  rendezVous: {
    date: {},
    code: {},
    status: {},
  },
};

@Component({
  validations,
})
export default class RendezVousUpdate extends Vue {
  @Inject('rendezVousService') private rendezVousService: () => RendezVousService;
  @Inject('alertService') private alertService: () => AlertService;

  public rendezVous: IRendezVous = new RendezVous();

  @Inject('visiteService') private visiteService: () => VisiteService;

  public visites: IVisite[] = [];

  @Inject('patientService') private patientService: () => PatientService;

  public patients: IPatient[] = [];

  @Inject('medecinService') private medecinService: () => MedecinService;

  public medecins: IMedecin[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.rendezVousId) {
        vm.retrieveRendezVous(to.params.rendezVousId);
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
    if (this.rendezVous.id) {
      this.rendezVousService()
        .update(this.rendezVous)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('pathogeneApp.rendezVous.updated', { param: param.id });
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
      this.rendezVousService()
        .create(this.rendezVous)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('pathogeneApp.rendezVous.created', { param: param.id });
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

  public convertDateTimeFromServer(date: Date): string {
    if (date && dayjs(date).isValid()) {
      return dayjs(date).format(DATE_TIME_LONG_FORMAT);
    }
    return null;
  }

  public updateInstantField(field, event) {
    if (event.target.value) {
      this.rendezVous[field] = dayjs(event.target.value, DATE_TIME_LONG_FORMAT);
    } else {
      this.rendezVous[field] = null;
    }
  }

  public updateZonedDateTimeField(field, event) {
    if (event.target.value) {
      this.rendezVous[field] = dayjs(event.target.value, DATE_TIME_LONG_FORMAT);
    } else {
      this.rendezVous[field] = null;
    }
  }

  public retrieveRendezVous(rendezVousId): void {
    this.rendezVousService()
      .find(rendezVousId)
      .then(res => {
        res.date = new Date(res.date);
        this.rendezVous = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.visiteService()
      .retrieve()
      .then(res => {
        this.visites = res.data;
      });
    this.patientService()
      .retrieve()
      .then(res => {
        this.patients = res.data;
      });
    this.medecinService()
      .retrieve()
      .then(res => {
        this.medecins = res.data;
      });
  }
}
