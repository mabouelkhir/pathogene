import { Component, Vue, Inject } from 'vue-property-decorator';

import { IVisite } from '@/shared/model/visite.model';
import VisiteService from './visite.service';
import AlertService from '@/shared/alert/alert.service';
import AccountService from '@/account/account.service';

@Component
export default class VisiteDetails extends Vue {
  @Inject('visiteService') private visiteService: () => VisiteService;
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('accountService') private accountService: () => AccountService;

  public visite: IVisite = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.visiteId) {
        vm.retrieveVisite(to.params.visiteId);
      }
    });
  }

  public retrieveVisite(visiteId) {
    this.visiteService()
      .find(visiteId)
      .then(res => {
        this.visite = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
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

  public previousState() {
    this.$router.go(-1);
  }
}
