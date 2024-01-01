import { mixins } from 'vue-class-component';
import { Component, Vue, Inject, Watch } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import { IDetection } from '@/shared/model/detection.model';

import JhiDataUtils from '@/shared/data/data-utils.service';

import DetectionService from './detection.service';
import AlertService from '@/shared/alert/alert.service';
import AccountService from '@/account/account.service';

@Component({
  mixins: [Vue2Filters.mixin],
})
export default class Detection extends mixins(JhiDataUtils) {
  @Inject('detectionService') private detectionService: () => DetectionService;
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('accountService') private accountService: () => AccountService;

  private removeId: number = null;
  public itemsPerPage = 20;
  public queryCount: number = null;
  public page = 1;
  public previousPage = 1;
  public propOrder = 'id';
  public reverse = false;
  public totalItems = 0;

  public detections: IDetection[] = [];
  public allDetections: IDetection[] = [];

  public isFetching = false;

  public searchQuery = '';

  public mounted(): void {
    if (this.isMedecin()) this.retrieveAllDetections();
    else this.retrievePatientDetections();
  }

  public clear(): void {
    this.page = 1;
    this.retrieveAllDetections();
  }

  public retrieveAllDetections(): void {
    this.isFetching = true;
    const paginationQuery = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };
    this.detectionService()
      .retrieve(paginationQuery)
      .then(
        res => {
          this.detections = res.data;
          this.allDetections = res.data;
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

  public prepareRemove(instance: IDetection): void {
    this.removeId = instance.id;
    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }

  public removeDetection(): void {
    this.detectionService()
      .delete(this.removeId)
      .then(() => {
        const message = 'A Detection is deleted';
        this.$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
        this.removeId = null;
        this.retrieveAllDetections();
        this.closeDialog();
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public retrievePatientDetections(): void {
    this.isFetching = true;
    const paginationQuery = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };
    this.detectionService()
      .retrieveAllForPatient(paginationQuery)
      .then(
        res => {
          this.detections = res.data;
          this.allDetections = res.data;
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

  public sort(): Array<any> {
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
    this.retrieveAllDetections();
  }

  public changeOrder(propOrder): void {
    this.propOrder = propOrder;
    this.reverse = !this.reverse;
    this.transition();
  }

  public isMedecin(): boolean {
    return this.accountService().userAuthorities.includes('MEDECIN');
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
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
        const patientNom = detection.patient?.nom.toLowerCase();
        const patientPrenom = detection.patient?.prenom.toLowerCase();
        const description = detection.description.toLowerCase();
        const validation = detection.validation.toString().toLowerCase();

        return (
          stade.includes(searchQueryLowerCase) ||
          maladie.includes(searchQueryLowerCase) ||
          description.includes(searchQueryLowerCase) ||
          validation.includes(searchQueryLowerCase) ||
          (this.isMedecin() && patientNom.includes(searchQueryLowerCase)) ||
          patientPrenom.includes(searchQueryLowerCase)
        );
      });
    } else {
      this.detections = this.allDetections;
    }
  }
}
