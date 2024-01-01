import { Component, Vue, Inject } from 'vue-property-decorator';

import { IClassification } from '@/shared/model/classification.model';
import ClassificationService from './classification.service';
import AlertService from '@/shared/alert/alert.service';

@Component
export default class ClassificationDetails extends Vue {
  @Inject('classificationService') private classificationService: () => ClassificationService;
  @Inject('alertService') private alertService: () => AlertService;

  public classification: IClassification = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.classificationId) {
        vm.retrieveClassification(to.params.classificationId);
      }
    });
  }

  public retrieveClassification(classificationId) {
    this.classificationService()
      .find(classificationId)
      .then(res => {
        this.classification = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
