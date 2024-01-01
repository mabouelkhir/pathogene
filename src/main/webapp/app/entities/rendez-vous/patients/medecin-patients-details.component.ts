import { Component, Inject, Watch } from 'vue-property-decorator';

import { mixins } from 'vue-class-component';
import JhiDataUtils from '@/shared/data/data-utils.service';

import { IPatient } from '@/shared/model/patient.model';
import PatientService from '@/entities/patient/patient.service';
import AlertService from '@/shared/alert/alert.service';
import { IDetection } from '@/shared/model/detection.model';
import DetectionService from '@/entities/detection/detection.service';

@Component
export default class PatientDetails extends mixins(JhiDataUtils) {
  @Inject('patientService') private patientService: () => PatientService;
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('detectionService') private detectionService: () => DetectionService;

  private patient: IPatient = {};
  private detections: IDetection[] = [];

  public itemsPerPage = 5;
  public queryCount: number = null;
  public page = 1;
  public previousPage = 1;
  public propOrder = 'id';
  public reverse = false;
  public totalItems = 0;
  public isFetching = false;
  public patientId: number = null;
  public allDetections: IDetection[] = [];

  public searchQuery = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.patientId) {
        vm.patientId = to.params.patientId;
        vm.retrievePatient(vm.patientId);
        vm.retrieveAllDetectionsForPatient(vm.patientId);
      }
    });
  }

  public retrievePatient(patientId) {
    this.patientService()
      .find(patientId)
      .then(res => {
        this.patient = res;
        //this.detections = this.patient.detections;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState() {
    this.$router.go(-1);
  }

  public retrieveAllDetectionsForPatient(patientId): void {
    this.isFetching = true;
    this.detectionService()
      .retrieveAllForPatientId(patientId, {
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .then(
        res => {
          this.detections = res.data;
          this.allDetections = res.data;
          this.isFetching = false;
          this.totalItems = Number(res.headers['x-total-count']);
          this.queryCount = this.totalItems;
        },
        err => {
          this.isFetching = false;
          this.alertService().showHttpError(this, err.response);
        }
      );
  }

  public sort(): any {
    const result = [this.propOrder + ',' + (this.reverse ? 'desc' : 'asc')];
    if (this.propOrder !== 'id') {
      result.push('id');
    }
    return result;
  }

  public loadPage(page: number): void {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  public transition(): void {
    this.retrieveAllDetectionsForPatient(this.patientId);
  }

  @Watch('searchQuery')
  onSearchQueryChanged(value: string, oldValue: string) {
    this.searchDetections();
  }

  public searchDetections(): void {
    // Si la requête de recherche est vide, affichez tous les patients
    if (this.searchQuery !== '') {
      // Effectuez la recherche en utilisant la requête de recherche (ignorez la casse)
      const searchQueryLowerCase = this.searchQuery.toLowerCase();
      this.detections = this.allDetections.filter(detection => {
        const stade = detection.stade.toLowerCase();
        const maladie = detection.maladie?.nom.toLowerCase();
        const description = detection.description.toLowerCase();
        const validation = detection.validation.toString().toLowerCase();

        return (
          stade.includes(searchQueryLowerCase) ||
          maladie.includes(searchQueryLowerCase) ||
          description.includes(searchQueryLowerCase) ||
          validation.includes(searchQueryLowerCase)
        );
      });
    } else {
      this.detections = this.allDetections;
    }
  }
}
