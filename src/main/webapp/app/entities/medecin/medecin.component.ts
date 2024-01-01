import { mixins } from 'vue-class-component';
import { Component, Vue, Inject, Watch } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import { IMedecin } from '@/shared/model/medecin.model';

import JhiDataUtils from '@/shared/data/data-utils.service';

import MedecinService from './medecin.service';
import AlertService from '@/shared/alert/alert.service';

@Component({
  mixins: [Vue2Filters.mixin],
})
export default class Medecin extends mixins(JhiDataUtils) {
  @Inject('medecinService') private medecinService: () => MedecinService;
  @Inject('alertService') private alertService: () => AlertService;

  private removeId: number = null;
  public itemsPerPage = 20;
  public queryCount: number = null;
  public page = 1;
  public previousPage = 1;
  public propOrder = 'id';
  public reverse = false;
  public totalItems = 0;

  public medecins: IMedecin[] = [];
  public allMedecins: IMedecin[] = [];

  public isFetching = false;

  public searchQuery = '';

  public mounted(): void {
    this.retrieveAllMedecins();
  }

  public clear(): void {
    this.page = 1;
    this.retrieveAllMedecins();
  }

  public retrieveAllMedecins(): void {
    this.isFetching = true;
    const paginationQuery = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };
    this.medecinService()
      .retrieve(paginationQuery)
      .then(
        res => {
          this.medecins = res.data;
          this.allMedecins = res.data;
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

  public prepareRemove(instance: IMedecin): void {
    this.removeId = instance.id;
    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }

  public removeMedecin(): void {
    this.medecinService()
      .delete(this.removeId)
      .then(() => {
        const message = this.$t('pathogeneApp.medecin.deleted', { param: this.removeId });
        this.$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
        this.removeId = null;
        this.retrieveAllMedecins();
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
    this.retrieveAllMedecins();
  }

  public changeOrder(propOrder): void {
    this.propOrder = propOrder;
    this.reverse = !this.reverse;
    this.transition();
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
  }

  @Watch('searchQuery')
  onSearchQueryChanged(value: string, oldValue: string) {
    this.searchMedecins();
  }

  public searchMedecins(): void {
    // Si la requête de recherche est vide, affichez tous les patients
    if (this.searchQuery !== '') {
      // Effectuez la recherche en utilisant la requête de recherche (ignorez la casse)
      const searchQueryLowerCase = this.searchQuery.toLowerCase();
      this.medecins = this.allMedecins.filter(medecin => {
        const nom = medecin.nom.toLowerCase();
        const prenom = medecin.prenom.toLowerCase();
        const type = medecin.type.toLowerCase();

        return nom.includes(searchQueryLowerCase) || prenom.includes(searchQueryLowerCase) || type.includes(searchQueryLowerCase);
      });
    } else {
      this.medecins = this.allMedecins;
    }
  }
}
