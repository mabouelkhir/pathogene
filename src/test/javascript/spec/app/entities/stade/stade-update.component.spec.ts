/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';
import { ToastPlugin } from 'bootstrap-vue';

import * as config from '@/shared/config/config';
import StadeUpdateComponent from '@/entities/stade/stade-update.vue';
import StadeClass from '@/entities/stade/stade-update.component';
import StadeService from '@/entities/stade/stade.service';

import ClassificationService from '@/entities/classification/classification.service';

import ImageService from '@/entities/image/image.service';

import PatientService from '@/entities/patient/patient.service';

import MaladieService from '@/entities/maladie/maladie.service';
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
  describe('Stade Management Update Component', () => {
    let wrapper: Wrapper<StadeClass>;
    let comp: StadeClass;
    let stadeServiceStub: SinonStubbedInstance<StadeService>;

    beforeEach(() => {
      stadeServiceStub = sinon.createStubInstance<StadeService>(StadeService);

      wrapper = shallowMount<StadeClass>(StadeUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          stadeService: () => stadeServiceStub,
          alertService: () => new AlertService(),

          classificationService: () =>
            sinon.createStubInstance<ClassificationService>(ClassificationService, {
              retrieve: sinon.stub().resolves({}),
            } as any),

          imageService: () =>
            sinon.createStubInstance<ImageService>(ImageService, {
              retrieve: sinon.stub().resolves({}),
            } as any),

          patientService: () =>
            sinon.createStubInstance<PatientService>(PatientService, {
              retrieve: sinon.stub().resolves({}),
            } as any),

          maladieService: () =>
            sinon.createStubInstance<MaladieService>(MaladieService, {
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
        comp.stade = entity;
        stadeServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(stadeServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.stade = entity;
        stadeServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(stadeServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundStade = { id: 123 };
        stadeServiceStub.find.resolves(foundStade);
        stadeServiceStub.retrieve.resolves([foundStade]);

        // WHEN
        comp.beforeRouteEnter({ params: { stadeId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.stade).toBe(foundStade);
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
