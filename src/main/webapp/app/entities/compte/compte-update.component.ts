import { Component, Vue, Inject } from 'vue-property-decorator';

import AlertService from '@/shared/alert/alert.service';

import UserService from '@/entities/user/user.service';

import { ICompte, Compte } from '@/shared/model/compte.model';
import CompteService from './compte.service';

const validations: any = {
  compte: {},
};

@Component({
  validations,
})
export default class CompteUpdate extends Vue {
  @Inject('compteService') private compteService: () => CompteService;
  @Inject('alertService') private alertService: () => AlertService;

  public compte: ICompte = new Compte();

  @Inject('userService') private userService: () => UserService;

  public users: Array<any> = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.compteId) {
        vm.retrieveCompte(to.params.compteId);
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
    if (this.compte.id) {
      this.compteService()
        .update(this.compte)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('pathogeneApp.compte.updated', { param: param.id });
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
      this.compteService()
        .create(this.compte)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('pathogeneApp.compte.created', { param: param.id });
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

  public retrieveCompte(compteId): void {
    this.compteService()
      .find(compteId)
      .then(res => {
        this.compte = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.userService()
      .retrieve()
      .then(res => {
        this.users = res.data;
      });
  }
}
