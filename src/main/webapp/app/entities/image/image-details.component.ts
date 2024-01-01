import { Component, Inject } from 'vue-property-decorator';

import { mixins } from 'vue-class-component';
import JhiDataUtils from '@/shared/data/data-utils.service';

import { IImage } from '@/shared/model/image.model';
import ImageService from './image.service';
import AlertService from '@/shared/alert/alert.service';

@Component
export default class ImageDetails extends mixins(JhiDataUtils) {
  @Inject('imageService') private imageService: () => ImageService;
  @Inject('alertService') private alertService: () => AlertService;

  public image: IImage = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.imageId) {
        vm.retrieveImage(to.params.imageId);
      }
    });
  }

  public retrieveImage(imageId) {
    this.imageService()
      .find(imageId)
      .then(res => {
        this.image = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
