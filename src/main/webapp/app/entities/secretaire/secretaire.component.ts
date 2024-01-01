import { mixins } from 'vue-class-component';
import { Component, Vue, Inject, Watch } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import { ISecretaire } from '@/shared/model/secretaire.model';

import JhiDataUtils from '@/shared/data/data-utils.service';

import SecretaireService from './secretaire.service';
import AlertService from '@/shared/alert/alert.service';

@Component({
  mixins: [Vue2Filters.mixin],
})
export default class Secretaire extends mixins(JhiDataUtils) {
  @Inject('secretaireService') private secretaireService: () => SecretaireService;
  @Inject('alertService') private alertService: () => AlertService;

  private removeId: number = null;
  public itemsPerPage = 20;
  public queryCount: number = null;
  public page = 1;
  public previousPage = 1;
  public propOrder = 'id';
  public reverse = false;
  public totalItems = 0;

  public secretaires: ISecretaire[] = [];
  public allSecretaires: ISecretaire[] = [];

  public isFetching = false;

  public searchQuery = '';

  public mounted(): void {
    this.retrieveAllSecretaires();
  }

  public clear(): void {
    this.page = 1;
    this.retrieveAllSecretaires();
  }

  public retrieveAllSecretaires(): void {
    this.isFetching = true;
    const paginationQuery = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };
    this.secretaireService()
      .retrieve(paginationQuery)
      .then(
        res => {
          this.secretaires = res.data;
          this.allSecretaires = res.data;
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

  public prepareRemove(instance: ISecretaire): void {
    this.removeId = instance.id;
    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }

  public removeSecretaire(): void {
    this.secretaireService()
      .delete(this.removeId)
      .then(() => {
        const message = this.$t('pathogeneApp.secretaire.deleted', { param: this.removeId });
        this.$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
        this.removeId = null;
        this.retrieveAllSecretaires();
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
    this.retrieveAllSecretaires();
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
    this.searchSecretaires();
  }

  public searchSecretaires(): void {
    // Si la requête de recherche est vide, affichez tous les patients
    if (this.searchQuery !== '') {
      // Effectuez la recherche en utilisant la requête de recherche (ignorez la casse)
      const searchQueryLowerCase = this.searchQuery.toLowerCase();
      this.secretaires = this.allSecretaires.filter(secretaire => {
        const nom = secretaire.nom.toLowerCase();
        const prenom = secretaire.prenom.toLowerCase();
        const numEmp = secretaire.numEmp.toLowerCase();

        return nom.includes(searchQueryLowerCase) || prenom.includes(searchQueryLowerCase) || numEmp.includes(searchQueryLowerCase);
      });
    } else {
      this.secretaires = this.allSecretaires;
    }
  }
}
