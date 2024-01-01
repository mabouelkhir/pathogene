import { Component, Inject } from 'vue-property-decorator';

import { mixins } from 'vue-class-component';
import JhiDataUtils from '@/shared/data/data-utils.service';

import { IMedecin } from '@/shared/model/medecin.model';
import MedecinService from './medecin.service';
import AlertService from '@/shared/alert/alert.service';

@Component
export default class MedecinDetails extends mixins(JhiDataUtils) {
  @Inject('medecinService') private medecinService: () => MedecinService;
  @Inject('alertService') private alertService: () => AlertService;

  public medecin: IMedecin = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.medecinId) {
        vm.retrieveMedecin(to.params.medecinId);
      }
    });
  }

  public retrieveMedecin(medecinId) {
    this.medecinService()
      .find(medecinId)
      .then(res => {
        this.medecin = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
