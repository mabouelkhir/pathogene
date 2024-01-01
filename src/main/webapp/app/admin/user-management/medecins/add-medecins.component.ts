import { Component, Inject } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import JhiDataUtils from '@/shared/data/data-utils.service';
import AlertService from '@/shared/alert/alert.service';
import UserManagementService from '@/admin/user-management/user-management.service';
import SecretaireService from '@/entities/secretaire/secretaire.service';
import { ISecretaire } from '@/shared/model/secretaire.model';
import { IMedecin, Medecin } from '@/shared/model/medecin.model';
import { IUser, User } from '@/shared/model/user.model';

const validations: any = {
  medecin: {
    code: {},
    nom: {},
    numEmp: {},
    prenom: {},
    expertLevel: {},
    photo: {},
    type: {},
    nbrPatients: {},
    rating: {},
    description: {},
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
export default class AddMedecins extends mixins(JhiDataUtils) {
  @Inject('userManagementService') private userManagementService: () => UserManagementService;
  @Inject('alertService') private alertService: () => AlertService;

  private secretaireService: SecretaireService = new SecretaireService();
  public user: IUser = new User();
  public medecin: IMedecin = new Medecin();
  public secretaires: ISecretaire[] = [];
  public isSaving = false;

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initRelationships();
    });
  }

  public async save() {
    this.isSaving = true;
    this.user.firstName = this.medecin.prenom;
    this.user.lastName = this.medecin.nom;
    try {
      await this.userManagementService().createMedecin({
        user: this.user,
        medecin: this.medecin,
      });
      this.isSaving = false;
      this.$router.push('/doctor');
      const message = 'A Doctor is created';
      this.$bvToast.toast(message.toString(), {
        toaster: 'b-toaster-top-center',
        title: 'Success',
        variant: 'success',
        solid: true,
        autoHideDelay: 5000,
      });
    } catch (e) {
      this.alertService().showHttpError(this, e.response);
    }
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public clearInputImage(field, fieldContentType, idInput): void {
    if (this.medecin && field && fieldContentType) {
      if (Object.prototype.hasOwnProperty.call(this.medecin, field)) {
        this.medecin[field] = null;
      }
      if (Object.prototype.hasOwnProperty.call(this.medecin, fieldContentType)) {
        this.medecin[fieldContentType] = null;
      }
      if (idInput) {
        (<any>this).$refs[idInput] = null;
      }
    }
  }

  public initRelationships(): void {
    this.secretaireService.retrieve().then(res => {
      this.secretaires = res.data;
    });
  }
}
