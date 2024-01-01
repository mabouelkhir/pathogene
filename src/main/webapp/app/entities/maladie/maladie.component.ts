import { Component, Vue, Inject, Watch } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import { IMaladie } from '@/shared/model/maladie.model';

import MaladieService from './maladie.service';
import AlertService from '@/shared/alert/alert.service';
import AccountService from '@/account/account.service';
import StadeService from '@/entities/stade/stade.service';
import { IStade, Stade } from '@/shared/model/stade.model';

const validations: any = {
  stade: {
    level: {},
    description: {},
  },
};

@Component({
  mixins: [Vue2Filters.mixin],
  validations,
})
export default class Maladie extends Vue {
  @Inject('maladieService') private maladieService: () => MaladieService;
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('stadeService') private stadeService: () => StadeService;
  @Inject('accountService') private accountService: () => AccountService;

  private removeId: number = null;
  public itemsPerPage = 20;
  public queryCount: number = null;
  public page = 1;
  public previousPage = 1;
  public propOrder = 'id';
  public reverse = false;
  public totalItems = 0;

  public maladies: IMaladie[] = [];
  public allMaladies: IMaladie[] = [];
  public maladie: IMaladie;

  private stade: IStade = new Stade();

  public isFetching = false;

  public searchQuery = '';

  private importId: number = null;

  public imageWidth: number = null;

  public imageHeight: number = null;

  public classNames: { [key: number]: string } = {
    0: '', // Initial class name
  };

  public mounted(): void {
    if (this.isMedecin() || this.isAdmin()) this.retrieveAllMaladies();
    else this.retrieveAllMaladiesForPatient();
  }

  public clear(): void {
    this.page = 1;
    this.retrieveAllMaladies();
  }

  public retrieveAllMaladies(): void {
    this.isFetching = true;
    const paginationQuery = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };
    this.maladieService()
      .retrieve(paginationQuery)
      .then(
        res => {
          this.maladies = res.data;
          this.allMaladies = res.data;
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

  public retrieveAllMaladiesForPatient() {
    this.isFetching = true;
    this.maladieService()
      .findByPatient()
      .then(res => {
        this.maladies.push(res);
        this.allMaladies.push(res);
        this.totalItems = this.maladies.length;
        this.isFetching = false;
      })
      .catch(error => {
        this.isFetching = false;
        this.alertService().showHttpError(this, error.response);
      });
  }

  public handleSyncList(): void {
    this.clear();
  }

  public prepareRemove(instance: IMaladie): void {
    this.removeId = instance.id;
    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }

  // preparation de l'affectation
  public prepareAffecte(instance: IMaladie): void {
    this.maladie = instance;
  }

  public prepareImportModele(instance: IMaladie): void {
    this.maladie = instance;
    this.importId = instance.id;
    if (<any>this.$refs.importEntity) {
      (<any>this.$refs.importEntity).show();
    }
  }

  // Method to add a new class input field
  public addClassField() {
    const nextClassNumber = Object.keys(this.classNames).length;
    this.$set(this.classNames, nextClassNumber, ''); // Add a new class name field
  }

  public removeClassField(classNumber) {
    // Remove the class by its number
    this.$delete(this.classNames, classNumber);
  }

  public resetClassNames() {
    this.classNames = { 0: '' };
  }

  public async saveStade() {
    this.stade.maladie = this.maladie;
    try {
      await this.stadeService().create(this.stade);
      this.$bvToast.toast('A stade is created', {
        toaster: 'b-toaster-top-center',
        title: 'Sucess',
        variant: 'success',
        solid: true,
        autoHideDelay: 5000,
      });
      this.closeDialog();
      this.stade = new Stade();
    } catch (e) {
      console.log(e);
    }
  }

  public async saveModel() {
    const formData = new FormData();
    formData.append('imageWidth', this.imageWidth.toString());
    formData.append('imageHeight', this.imageHeight.toString());
    formData.append('modelFile', (this.$refs.modelInput as HTMLInputElement).files[0]);
    // Iterate through classNames and append each class name to formData
    for (const [classNumber, className] of Object.entries(this.classNames)) {
      formData.append(`classNames[${classNumber}]`, className);
    }
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    try {
      await this.maladieService().uploadModel(this.importId, formData);
      this.$bvToast.toast('A model is imported', {
        toaster: 'b-toaster-top-center',
        title: 'Sucess',
        variant: 'success',
        solid: true,
        autoHideDelay: 5000,
      });
      this.closeDialog();
    } catch (e) {
      console.log(e);
    }
  }

  public removeMaladie(): void {
    this.maladieService()
      .delete(this.removeId)
      .then(() => {
        const message = this.$t('pathogeneApp.maladie.deleted', { param: this.removeId });
        this.$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
        this.removeId = null;
        this.retrieveAllMaladies();
        this.closeDialog();
      })
      .catch(error => {
        this.$bvToast.toast("You can't delete this Maladie", {
          toaster: 'b-toaster-top-center',
          title: 'Error',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
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
    this.retrieveAllMaladies();
  }

  public changeOrder(propOrder): void {
    this.propOrder = propOrder;
    this.reverse = !this.reverse;
    this.transition();
  }

  public isMedecin(): boolean {
    return this.accountService().userAuthorities.includes('MEDECIN');
  }

  public isAdmin(): boolean {
    return this.accountService().userAuthorities.includes('ROLE_ADMIN');
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
    (<any>this.$refs.affecteEntity).hide();
    (<any>this.$refs.importEntity).hide();
  }

  @Watch('searchQuery')
  onSearchQueryChanged(value: string, oldValue: string) {
    this.searchMaladies();
  }

  public searchMaladies(): void {
    // Si la requête de recherche est vide, affichez tous les patients
    if (this.searchQuery !== '') {
      // Effectuez la recherche en utilisant la requête de recherche (ignorez la casse)
      const searchQueryLowerCase = this.searchQuery.toLowerCase();
      this.maladies = this.allMaladies.filter(maladie => {
        const nom = maladie.nom.toLowerCase();

        return nom.includes(searchQueryLowerCase);
      });
    } else {
      this.maladies = this.allMaladies;
    }
  }
}
