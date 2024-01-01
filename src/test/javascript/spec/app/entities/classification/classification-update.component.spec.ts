/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';
import { ToastPlugin } from 'bootstrap-vue';

import * as config from '@/shared/config/config';
import ClassificationUpdateComponent from '@/entities/classification/classification-update.vue';
import ClassificationClass from '@/entities/classification/classification-update.component';
import ClassificationService from '@/entities/classification/classification.service';

import MedecinService from '@/entities/medecin/medecin.service';

import StadeService from '@/entities/stade/stade.service';

import UnclassifiedService from '@/entities/unclassified/unclassified.service';
import AlertService from '@/shared/alert/alert.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
const router = new Router();
localVue.use(Router);
localVue.use(ToastPlugin);
localVue.component('font-awesome-icon', {});
localVue.component('b-input-group', {});
localVue.component('b-input-group-prepend', {});
localVue.component('b-form-datepicker', {});
localVue.component('b-form-input', {});

describe('Component Tests', () => {
  describe('Classification Management Update Component', () => {
    let wrapper: Wrapper<ClassificationClass>;
    let comp: ClassificationClass;
    let classificationServiceStub: SinonStubbedInstance<ClassificationService>;

    beforeEach(() => {
      classificationServiceStub = sinon.createStubInstance<ClassificationService>(ClassificationService);

      wrapper = shallowMount<ClassificationClass>(ClassificationUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          classificationService: () => classificationServiceStub,
          alertService: () => new AlertService(),

          medecinService: () =>
            sinon.createStubInstance<MedecinService>(MedecinService, {
              retrieve: sinon.stub().resolves({}),
            } as any),

          stadeService: () =>
            sinon.createStubInstance<StadeService>(StadeService, {
              retrieve: sinon.stub().resolves({}),
            } as any),

          unclassifiedService: () =>
            sinon.createStubInstance<UnclassifiedService>(UnclassifiedService, {
              retrieve: sinon.stub().resolves({}),
            } as any),
        },
      });
      comp = wrapper.vm;
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.classification = entity;
        classificationServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(classificationServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.classification = entity;
        classificationServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(classificationServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundClassification = { id: 123 };
        classificationServiceStub.find.resolves(foundClassification);
        classificationServiceStub.retrieve.resolves([foundClassification]);

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
