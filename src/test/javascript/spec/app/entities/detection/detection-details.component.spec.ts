/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import DetectionDetailComponent from '@/entities/detection/detection-details.vue';
import DetectionClass from '@/entities/detection/detection-details.component';
import DetectionService from '@/entities/detection/detection.service';
import router from '@/router';
import AlertService from '@/shared/alert/alert.service';

const localVue = createLocalVue();
localVue.use(VueRouter);

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('router-link', {});

describe('Component Tests', () => {
  describe('Detection Management Detail Component', () => {
    let wrapper: Wrapper<DetectionClass>;
    let comp: DetectionClass;
    let detectionServiceStub: SinonStubbedInstance<DetectionService>;

    beforeEach(() => {
      detectionServiceStub = sinon.createStubInstance<DetectionService>(DetectionService);

      wrapper = shallowMount<DetectionClass>(DetectionDetailComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: { detectionService: () => detectionServiceStub, alertService: () => new AlertService() },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundDetection = { id: 123 };
        detectionServiceStub.find.resolves(foundDetection);

        // WHEN
        comp.retrieveDetection(123);
        await comp.$nextTick();

        // THEN
        expect(comp.detection).toBe(foundDetection);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundDetection = { id: 123 };
        detectionServiceStub.find.resolves(foundDetection);

        // WHEN
        comp.beforeRouteEnter({ params: { detectionId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.detection).toBe(foundDetection);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        comp.previousState();
        await comp.$nextTick();

        expect(comp.$router.currentRoute.fullPath).toContain('/');
      });
    });
  });
});
