import { Component, Inject } from 'vue-property-decorator';

import { mixins } from 'vue-class-component';
import JhiDataUtils from '@/shared/data/data-utils.service';

import { IDetection } from '@/shared/model/detection.model';
import DetectionService from './detection.service';
import AlertService from '@/shared/alert/alert.service';
import AccountService from '@/account/account.service';

@Component
export default class DetectionDetails extends mixins(JhiDataUtils) {
  @Inject('detectionService') private detectionService: () => DetectionService;
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('accountService') private accountService: () => AccountService;

  public detection: IDetection = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.detectionId) {
        vm.retrieveDetection(to.params.detectionId);
      }
    });
  }

  public retrieveDetection(detectionId) {
    this.detectionService()
      .find(detectionId)
      .then(res => {
        this.detection = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public isMedecin(): boolean {
    return this.accountService().userAuthorities.includes('MEDECIN');
  }

  public previousState() {
    this.$router.go(-1);
  }
}
