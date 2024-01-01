import { mixins } from 'vue-class-component';
import { Component, Vue, Inject, Watch } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import { IPatient } from '@/shared/model/patient.model';

import JhiDataUtils from '@/shared/data/data-utils.service';

import PatientService from './patient.service';
import AlertService from '@/shared/alert/alert.service';
import { ref } from 'vue';

@Component({
  mixins: [Vue2Filters.mixin],
})
export default class Patient extends mixins(JhiDataUtils) {
  @Inject('patientService') private patientService: () => PatientService;
  @Inject('alertService') private alertService: () => AlertService;

  private removeId: number = null;
  public itemsPerPage = 20;
  public queryCount: number = null;
  public page = 1;
  public previousPage = 1;
  public propOrder = 'id';
  public reverse = false;
  public totalItems = 0;

  public patients: IPatient[] = [];

  public isFetching = false;

  public allPatients: IPatient[] = [];

  public mounted(): void {
    this.retrieveAllPatients();
  }

  public clear(): void {
    this.page = 1;
    this.retrieveAllPatients();
  }

  public retrieveAllPatients(): void {
    this.isFetching = true;
    const paginationQuery = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };
    this.patientService()
      .retrieve(paginationQuery)
      .then(
        res => {
          this.patients = res.data;
          this.allPatients = res.data;
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

  public prepareRemove(instance: IPatient): void {
    this.removeId = instance.id;
    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }

  public removePatient(): void {
    this.patientService()
      .delete(this.removeId)
      .then(() => {
        const message = this.$t('pathogeneApp.patient.deleted', { param: this.removeId });
        this.$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
        this.removeId = null;
        this.retrieveAllPatients();
        this.closeDialog();
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
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
    this.retrieveAllPatients();
  }

  public changeOrder(propOrder): void {
    this.propOrder = propOrder;
    this.reverse = !this.reverse;
    this.transition();
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
  }

  public originalSearchQuery = ''; // Ajoutez une variable pour stocker la requête de recherche d'origine

  public searchQuery = '';

  @Watch('searchQuery')
  onSearchQueryChanged(value: string, oldValue: string) {
    // Filtrer les patients chaque fois que searchQuery change
    console.log('searchQuery changed. New value:', value, 'Old value:', oldValue);
    this.searchPatients();
  }

  public searchPatients(): void {
    // Copiez la liste complète des patients dans une variable temporaire
    console.log(this.searchQuery);
    console.log(this.allPatients);
    // Si la requête de recherche est vide, affichez tous les patients
    if (this.searchQuery !== '') {
      // Effectuez la recherche en utilisant la requête de recherche (ignorez la casse)
      const searchQueryLowerCase = this.searchQuery.toLowerCase();
      this.patients = this.allPatients.filter(patient => {
        const nom = patient.nom.toLowerCase();
        const prenom = patient.prenom.toLowerCase();
        const telephone = patient.telephone.toLowerCase();
        const adresse = patient.adresse.toLowerCase();

        return (
          nom.includes(searchQueryLowerCase) ||
          prenom.includes(searchQueryLowerCase) ||
          telephone.includes(searchQueryLowerCase) ||
          adresse.includes(searchQueryLowerCase)
        );
      });
    } else {
      this.patients = this.allPatients;
    }
  }
}
