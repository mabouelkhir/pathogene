import { Component, Inject } from 'vue-property-decorator';

import { mixins } from 'vue-class-component';
import JhiDataUtils from '@/shared/data/data-utils.service';

import AlertService from '@/shared/alert/alert.service';

import UserService from '@/entities/user/user.service';

import MedecinService from '@/entities/medecin/medecin.service';
import { IMedecin } from '@/shared/model/medecin.model';

import PatientService from '@/entities/patient/patient.service';
import { IPatient } from '@/shared/model/patient.model';

import { ISecretaire, Secretaire } from '@/shared/model/secretaire.model';
import SecretaireService from './secretaire.service';

const validations: any = {
  secretaire: {
    nom: {},
    numEmp: {},
    prenom: {},
    admin: {},
    photo: {},
  },
};

@Component({
  validations,
})
export default class SecretaireUpdate extends mixins(JhiDataUtils) {
  @Inject('secretaireService') private secretaireService: () => SecretaireService;
  @Inject('alertService') private alertService: () => AlertService;

  public secretaire: ISecretaire = new Secretaire();

  @Inject('userService') private userService: () => UserService;

  public users: Array<any> = [];

  @Inject('medecinService') private medecinService: () => MedecinService;

  public medecins: IMedecin[] = [];

  @Inject('patientService') private patientService: () => PatientService;

  public patients: IPatient[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.secretaireId) {
        vm.retrieveSecretaire(to.params.secretaireId);
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
    if (this.secretaire.id) {
      this.secretaireService()
        .update(this.secretaire)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('pathogeneApp.secretaire.updated', { param: param.id });
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
      this.secretaireService()
        .create(this.secretaire)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('pathogeneApp.secretaire.created', { param: param.id });
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

  public retrieveSecretaire(secretaireId): void {
    this.secretaireService()
      .find(secretaireId)
      .then(res => {
        this.secretaire = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public clearInputImage(field, fieldContentType, idInput): void {
    if (this.secretaire && field && fieldContentType) {
      if (Object.prototype.hasOwnProperty.call(this.secretaire, field)) {
        this.secretaire[field] = null;
      }
      if (Object.prototype.hasOwnProperty.call(this.secretaire, fieldContentType)) {
        this.secretaire[fieldContentType] = null;
      }
      if (idInput) {
        (<any>this).$refs[idInput] = null;
      }
    }
  }

  public initRelationships(): void {
    this.userService()
      .retrieve()
      .then(res => {
        this.users = res.data;
      });
    this.medecinService()
      .retrieve()
      .then(res => {
        this.medecins = res.data;
      });
    this.patientService()
      .retrieve()
      .then(res => {
        this.patients = res.data;
      });
  }
}
