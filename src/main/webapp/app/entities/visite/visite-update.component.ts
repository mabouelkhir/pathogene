import { Component, Vue, Inject } from 'vue-property-decorator';

import dayjs from 'dayjs';
import { DATE_TIME_LONG_FORMAT } from '@/shared/date/filters';

import AlertService from '@/shared/alert/alert.service';

import RendezVousService from '@/entities/rendez-vous/rendez-vous.service';
import { IRendezVous } from '@/shared/model/rendez-vous.model';

import DetectionService from '@/entities/detection/detection.service';
import { IDetection } from '@/shared/model/detection.model';

import { IVisite, Visite } from '@/shared/model/visite.model';
import VisiteService from './visite.service';

const validations: any = {
  visite: {
    code: {},
    date: {},
  },
};

@Component({
  validations,
})
export default class VisiteUpdate extends Vue {
  @Inject('visiteService') private visiteService: () => VisiteService;
  @Inject('alertService') private alertService: () => AlertService;

  public visite: IVisite = new Visite();

  @Inject('rendezVousService') private rendezVousService: () => RendezVousService;

  public rendezVous: IRendezVous[] = [];

  @Inject('detectionService') private detectionService: () => DetectionService;

  public detections: IDetection[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.visiteId) {
        vm.retrieveVisite(to.params.visiteId);
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
    if (this.visite.id) {
      this.visiteService()
        .update(this.visite)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = 'A Visite is updated with identifier ' + param.id;
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
      this.visiteService()
        .create(this.visite)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = 'A Visite is created with identifier ' + param.id;
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
      this.visite[field] = dayjs(event.target.value, DATE_TIME_LONG_FORMAT);
    } else {
      this.visite[field] = null;
    }
  }

  public updateZonedDateTimeField(field, event) {
    if (event.target.value) {
      this.visite[field] = dayjs(event.target.value, DATE_TIME_LONG_FORMAT);
    } else {
      this.visite[field] = null;
    }
  }

  public retrieveVisite(visiteId): void {
    this.visiteService()
      .find(visiteId)
      .then(res => {
        res.date = new Date(res.date);
        this.visite = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.rendezVousService()
      .retrieve()
      .then(res => {
        this.rendezVous = res.data;
      });
    this.detectionService()
      .retrieve()
      .then(res => {
        this.detections = res.data;
      });
  }
}
