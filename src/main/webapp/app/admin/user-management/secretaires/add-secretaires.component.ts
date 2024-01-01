import { Component, Inject } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import JhiDataUtils from '@/shared/data/data-utils.service';
import AlertService from '@/shared/alert/alert.service';
import { IPatient } from '@/shared/model/patient.model';
import { IMedecin } from '@/shared/model/medecin.model';
import { ISecretaire, Secretaire } from '@/shared/model/secretaire.model';
import { IUser, User } from '@/shared/model/user.model';
import UserManagementService from '@/admin/user-management/user-management.service';

const validations: any = {
  secretaire: {
    nom: {},
    numEmp: {},
    prenom: {},
    photo: {},
  },
  user: {
    login: {},
    email: {},
    password: {},
  },
};

@Component({
  validations,
})
export default class SecretaireUpdate extends mixins(JhiDataUtils) {
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('userManagementService') private userManagementService: () => UserManagementService;

  public secretaire: ISecretaire = new Secretaire();
  public user: IUser = new User();
  public isSaving = false;

  public async save() {
    this.isSaving = true;
    this.user.firstName = this.secretaire.prenom;
    this.user.lastName = this.secretaire.nom;
    try {
      await this.userManagementService().createSecretaire({
        user: this.user,
        secretaire: this.secretaire,
      });
      this.$router.push('/secretary');
      this.$bvToast.toast('A Secretary is created', {
        toaster: 'b-toaster-top-center',
        title: 'Success',
        variant: 'success',
        solid: true,
        autoHideDelay: 5000,
      });
    } catch (e) {
      console.log(e);
    }
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
}
