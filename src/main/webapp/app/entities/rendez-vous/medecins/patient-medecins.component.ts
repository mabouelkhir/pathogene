import { mixins } from 'vue-class-component';
import { Component, Vue, Inject, Watch } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import JhiDataUtils from '@/shared/data/data-utils.service';
import AccountService from '@/account/account.service';
import { IMedecin } from '@/shared/model/medecin.model';

@Component({
  mixins: [Vue2Filters.mixin],
})
export default class PatientMedecins extends mixins(JhiDataUtils) {
  @Inject('accountService') private accountService: () => AccountService;

  public medecins: IMedecin[] = [];
  public allMedecins: IMedecin[] = [];

  public itemsPerPage = 20;
  public queryCount: number = null;
  public page = 1;
  public previousPage = 1;
  public propOrder = 'id';
  public reverse = false;
  public totalItems = 0;
  public isFetching = false;

  public searchQuery = '';

  public mounted(): void {
    this.retrieveAllMedecins();
  }

  public async retrieveAllMedecins() {
    this.isFetching = true;
    try {
      const medecins = await this.accountService().retrieveMedecins({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      });
      this.medecins = medecins.data;
      this.allMedecins = medecins.data;
      this.totalItems = Number(medecins.headers['x-total-count']);
      this.queryCount = this.totalItems;
      this.isFetching = false;
      if (this.medecins == null || this.medecins.length == 0) {
        (this.$root as any).$bvToast.toast("Vous n'avez aucun medecin", {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'info',
          solid: true,
          autoHideDelay: 5000,
        });
        this.isFetching = false;
        this.$router.push('/rendez-vous');
      }
    } catch (e) {
      console.log(e);
      this.isFetching = false;
    }
  }

  public transition(): void {
    this.retrieveAllMedecins();
  }
  public handleSyncList(): void {
    this.clear();
  }

  public clear(): void {
    this.page = 1;
    this.retrieveAllMedecins();
  }
  public changeOrder(propOrder): void {
    this.propOrder = propOrder;
    this.reverse = !this.reverse;
    this.transition();
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
        const telephone = medecin.type.toLowerCase();

        return nom.includes(searchQueryLowerCase) || prenom.includes(searchQueryLowerCase) || telephone.includes(searchQueryLowerCase);
      });
    } else {
      this.medecins = this.allMedecins;
    }
  }
}
