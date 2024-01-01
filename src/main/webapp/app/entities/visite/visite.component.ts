import { Component, Vue, Inject, Watch } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import { IVisite } from '@/shared/model/visite.model';

import VisiteService from './visite.service';
import AlertService from '@/shared/alert/alert.service';
import AccountService from '@/account/account.service';

@Component({
  mixins: [Vue2Filters.mixin],
})
export default class Visite extends Vue {
  @Inject('visiteService') private visiteService: () => VisiteService;
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

  public visites: IVisite[] = [];
  public allVisites: IVisite[] = [];

  public isFetching = false;

  public searchQuery = '';

  public mounted(): void {
    if (this.isSecretaire()) {
      this.retrieveAllVisites();
    } else if (this.isPatient()) {
      this.retrieveAllVisitesForPatient();
    } else this.retrieveAllVisitesForMedecin();
  }

  public clear(): void {
    this.page = 1;
    this.retrieveAllVisites();
  }

  public retrieveAllVisites(): void {
    this.isFetching = true;
    const paginationQuery = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };
    this.visiteService()
      .retrieve(paginationQuery)
      .then(
        res => {
          this.visites = res.data;
          this.allVisites = res.data;
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

  public retrieveAllVisitesForMedecin(): void {
    this.isFetching = true;
    const paginationQuery = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };
    this.visiteService()
      .retrieveVisitesForMedecin(paginationQuery)
      .then(
        res => {
          this.visites = res.data;
          this.allVisites = res.data;
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

  public retrieveAllVisitesForPatient(): void {
    this.isFetching = true;
    const paginationQuery = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };
    this.visiteService()
      .retrieveVisitesForPatient(paginationQuery)
      .then(
        res => {
          this.visites = res.data;
          this.allVisites = res.data;
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

  public prepareRemove(instance: IVisite): void {
    this.removeId = instance.id;
    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }

  public removeVisite(): void {
    this.visiteService()
      .delete(this.removeId)
      .then(() => {
        const message = 'A Visite is deleted';
        this.$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
        this.removeId = null;
        this.retrieveAllVisites();
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
    this.retrieveAllVisites();
  }

  public changeOrder(propOrder): void {
    this.propOrder = propOrder;
    this.reverse = !this.reverse;
    this.transition();
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
  }

  public isSecretaire(): boolean {
    return this.accountService().userAuthorities.includes('SECRETAIRE');
  }

  public isPatient(): boolean {
    return this.accountService().userAuthorities.includes('PATIENT');
  }

  public isMedecin(): boolean {
    return this.accountService().userAuthorities.includes('MEDECIN');
  }

  @Watch('searchQuery')
  onSearchQueryChanged(value: string, oldValue: string) {
    this.searchVisites();
  }

  public searchVisites(): void {
    // Si la requête de recherche est vide, affichez tous les patients
    if (this.searchQuery !== '') {
      // Effectuez la recherche en utilisant la requête de recherche (ignorez la casse)
      const searchQueryLowerCase = this.searchQuery.toLowerCase();
      this.visites = this.allVisites.filter(visite => {
        const date = visite.date.toString().toLowerCase();
        const patientNom = visite.rendezVous.patient?.nom.toLowerCase();
        const patientPrenom = visite.rendezVous.patient?.nom.toLowerCase();
        const medecinNom = visite.rendezVous.medecin?.nom.toLowerCase();
        const medecinPrenom = visite.rendezVous.medecin?.prenom.toLowerCase();

        return (
          date.includes(searchQueryLowerCase) ||
          (this.isSecretaire() &&
            (medecinNom.includes(searchQueryLowerCase) ||
              medecinPrenom.includes(searchQueryLowerCase) ||
              patientNom.includes(searchQueryLowerCase) ||
              patientPrenom.includes(searchQueryLowerCase))) ||
          (this.isMedecin() && (patientNom.includes(searchQueryLowerCase) || patientPrenom.includes(searchQueryLowerCase))) ||
          (this.isPatient() && (medecinNom.includes(searchQueryLowerCase) || medecinPrenom.includes(searchQueryLowerCase)))
        );
      });
    } else {
      this.visites = this.allVisites;
    }
  }
}
