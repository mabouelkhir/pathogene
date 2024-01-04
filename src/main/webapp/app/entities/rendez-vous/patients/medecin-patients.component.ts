import { mixins } from 'vue-class-component';
import { Component, Vue, Inject, Watch } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import JhiDataUtils from '@/shared/data/data-utils.service';
import AccountService from '@/account/account.service';
import { IPatient } from '@/shared/model/patient.model';
import { Detection, IDetection } from '@/shared/model/detection.model';
import DetectionService from '@/entities/detection/detection.service';
import { IVisite, Visite } from '@/shared/model/visite.model';
import VisiteService from '@/entities/visite/visite.service';
import { IMaladie, Maladie } from '@/shared/model/maladie.model';
import MaladieService from '@/entities/maladie/maladie.service';
import { IStade } from '@/shared/model/stade.model';
import StadeService from '@/entities/stade/stade.service';
import PatientService from '@/entities/patient/patient.service';

const validations: any = {
  detection: {
    photo: {},
    validation: {},
    stade: {},
  },
};

@Component({
  mixins: [Vue2Filters.mixin],
  validations,
})
export default class MedecinPatients extends mixins(JhiDataUtils) {
  @Inject('accountService') private accountService: () => AccountService;
  @Inject('detectionService') private detectionService: () => DetectionService;
  @Inject('visiteService') private visiteService: () => VisiteService;
  @Inject('maladieService') private maladieService: () => MaladieService;
  @Inject('stadeService') private stadeService: () => StadeService;
  @Inject('patientService') private patientService: () => PatientService;

  public patients: IPatient[] = [];
  public allPatients: IPatient[] = [];
  public patient: IPatient;
  private detection: IDetection = new Detection();
  private visites: IVisite[] = [];
  private maladies: IMaladie[] = [];
  private stades: IStade[] = [];
  private maladie: IMaladie = new Maladie();
  private visite: IVisite;
  private idVisite: number = null;
  private idMaladie: number = null;
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
    this.retrieveAllPatients();
    this.retrieveAllVisites();
    this.retrieveAllMaladies();
    this.retrieveAllStades();
  }

  public clear(): void {
    this.page = 1;
    this.retrieveAllPatients();
  }

  public async retrieveAllStades() {
    this.isFetching = true;
    try {
      const response = await this.stadeService().retrieve({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      });
      this.isFetching = false;
      this.stades = response.data;
      this.totalItems = Number(response.headers['x-total-count']);
      this.queryCount = this.totalItems;
    } catch (e) {
      console.log(e);
      this.isFetching = false;
    }
  }

  public async retrieveAllPatients() {
    this.isFetching = true;
    this.accountService()
      .retrievePatients({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
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
          //this.alertService().showHttpError(this, err.response);
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
    this.retrieveAllPatients();
  }

  public async retrieveAllVisites() {
    this.isFetching = true;
    try {
      const response = await this.accountService().retrieveAllVisites({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      });
      this.isFetching = false;
      this.visites = response.data;
      this.totalItems = Number(response.headers['x-total-count']);
      this.queryCount = this.totalItems;
    } catch (e) {
      console.log(e);
      this.isFetching = false;
    }
  }

  public async retrieveAllMaladies() {
    this.isFetching = true;
    try {
      const response = await this.maladieService().retrieve({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      });
      this.isFetching = false;
      this.maladies = response.data;
      this.totalItems = Number(response.headers['x-total-count']);
      this.queryCount = this.totalItems;
    } catch (e) {
      console.log(e);
      this.isFetching = false;
    }
  }

  public async prepareDetection(instance: IPatient) {
    this.patient = instance;
    const visites = await this.visiteService().retrieveForMed(instance.id);
    this.visites = visites.data;
    if (<any>this.$refs.detectionEntity) {
      (<any>this.$refs.detectionEntity).show();
    }
  }

  public prepareStade(instance: IPatient): void {
    this.patient = instance;
  }

  public async saveDetection() {
    this.detection.date = new Date();
    this.detection.patient = this.patient;
    this.maladie = await this.maladieService().find(this.idMaladie);
    this.detection.maladie = this.maladie;
    const response = await this.detectionService().create(this.detection);
    this.detection = response;

    (this.$root as any).$bvToast.toast('A detection is created', {
      toaster: 'b-toaster-top-center',
      title: 'Info',
      variant: 'info',
      solid: true,
      autoHideDelay: 5000,
    });
    this.closeDialog();
    if (<any>this.$refs.afficheEntity) {
      (<any>this.$refs.afficheEntity).show();
    }
    this.visite = await this.visiteService().find(this.idVisite);
    this.visite.detection = this.detection;
    await this.visiteService().update(this.visite);
  }

  public async saveStade(instance: IStade) {
    this.patient.stade = instance;
    try {
      await this.patientService().update(this.patient);
      (this.$root as any).$bvToast.toast('A Stade and Patient are affected', {
        toaster: 'b-toaster-top-center',
        title: 'Info',
        variant: 'info',
        solid: true,
        autoHideDelay: 5000,
      });
      this.closeDialog();
    } catch (e) {
      console.log(e);
    }
  }

  public closeDialog(): void {
    (<any>this.$refs.detectionEntity).hide();
    (<any>this.$refs.afficheEntity).hide();
    (<any>this.$refs.stadeEntity).hide();
  }

  public handleSyncList(): void {
    this.clear();
  }

  public changeOrder(propOrder): void {
    this.propOrder = propOrder;
    this.reverse = !this.reverse;
    this.transition();
  }

  @Watch('searchQuery')
  onSearchQueryChanged(value: string, oldValue: string) {
    this.searchPatients();
  }

  public searchPatients(): void {
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
