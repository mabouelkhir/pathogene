/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import ClassificationDetailComponent from '@/entities/classification/classification-details.vue';
import ClassificationClass from '@/entities/classification/classification-details.component';
import ClassificationService from '@/entities/classification/classification.service';
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
  describe('Classification Management Detail Component', () => {
    let wrapper: Wrapper<ClassificationClass>;
    let comp: ClassificationClass;
    let classificationServiceStub: SinonStubbedInstance<ClassificationService>;

    beforeEach(() => {
      classificationServiceStub = sinon.createStubInstance<ClassificationService>(ClassificationService);

      wrapper = shallowMount<ClassificationClass>(ClassificationDetailComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: { classificationService: () => classificationServiceStub, alertService: () => new AlertService() },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundClassification = { id: 123 };
        classificationServiceStub.find.resolves(foundClassification);

        // WHEN
        comp.retrieveClassification(123);
        await comp.$nextTick();

        // THEN
        expect(comp.classification).toBe(foundClassification);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundClassification = { id: 123 };
        classificationServiceStub.find.resolves(foundClassification);

        // WHEN
        comp.beforeRouteEnter({ params: { classificationId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.classification).toBe(foundClassification);
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
