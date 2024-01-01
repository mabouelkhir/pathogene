import { Component, Vue, Inject } from 'vue-property-decorator';

import { ICompte } from '@/shared/model/compte.model';
import CompteService from './compte.service';
import AlertService from '@/shared/alert/alert.service';

@Component
export default class CompteDetails extends Vue {
  @Inject('compteService') private compteService: () => CompteService;
  @Inject('alertService') private alertService: () => AlertService;

  public compte: ICompte = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.compteId) {
        vm.retrieveCompte(to.params.compteId);
      }
    });
  }

  public retrieveCompte(compteId) {
    this.compteService()
      .find(compteId)
      .then(res => {
        this.compte = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
