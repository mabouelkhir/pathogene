import { Component, Vue, Inject } from 'vue-property-decorator';

import { IRendezVous } from '@/shared/model/rendez-vous.model';
import RendezVousService from './rendez-vous.service';
import AlertService from '@/shared/alert/alert.service';
import AccountService from '@/account/account.service';

@Component
export default class RendezVousDetails extends Vue {
  @Inject('rendezVousService') private rendezVousService: () => RendezVousService;
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('accountService') private accountService: () => AccountService;

  public rendezVous: IRendezVous = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.rendezVousId) {
        vm.retrieveRendezVous(to.params.rendezVousId);
      }
    });
  }

  public retrieveRendezVous(rendezVousId) {
    this.rendezVousService()
      .find(rendezVousId)
      .then(res => {
        this.rendezVous = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public isMedecin(): boolean {
    return this.accountService().userAuthorities.includes('MEDECIN');
  }

  public isPatient(): boolean {
    return this.accountService().userAuthorities.includes('PATIENT');
  }

  public previousState() {
    this.$router.go(-1);
  }
}
