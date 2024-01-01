import { Component, Inject } from 'vue-property-decorator';

import { mixins } from 'vue-class-component';
import JhiDataUtils from '@/shared/data/data-utils.service';

import { ISecretaire } from '@/shared/model/secretaire.model';
import SecretaireService from './secretaire.service';
import AlertService from '@/shared/alert/alert.service';

@Component
export default class SecretaireDetails extends mixins(JhiDataUtils) {
  @Inject('secretaireService') private secretaireService: () => SecretaireService;
  @Inject('alertService') private alertService: () => AlertService;

  public secretaire: ISecretaire = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.secretaireId) {
        vm.retrieveSecretaire(to.params.secretaireId);
      }
    });
  }

  public retrieveSecretaire(secretaireId) {
    this.secretaireService()
      .find(secretaireId)
      .then(res => {
        this.secretaire = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
