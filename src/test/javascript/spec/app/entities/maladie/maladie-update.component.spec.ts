/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';
import { ToastPlugin } from 'bootstrap-vue';

import * as config from '@/shared/config/config';
import MaladieUpdateComponent from '@/entities/maladie/maladie-update.vue';
import MaladieClass from '@/entities/maladie/maladie-update.component';
import MaladieService from '@/entities/maladie/maladie.service';

import DetectionService from '@/entities/detection/detection.service';

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
  describe('Maladie Management Update Component', () => {
    let wrapper: Wrapper<MaladieClass>;
    let comp: MaladieClass;
    let maladieServiceStub: SinonStubbedInstance<MaladieService>;

    beforeEach(() => {
      maladieServiceStub = sinon.createStubInstance<MaladieService>(MaladieService);

      wrapper = shallowMount<MaladieClass>(MaladieUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          maladieService: () => maladieServiceStub,
          alertService: () => new AlertService(),

          detectionService: () =>
            sinon.createStubInstance<DetectionService>(DetectionService, {
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
        comp.maladie = entity;
        maladieServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(maladieServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.maladie = entity;
        maladieServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(maladieServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundMaladie = { id: 123 };
        maladieServiceStub.find.resolves(foundMaladie);
        maladieServiceStub.retrieve.resolves([foundMaladie]);

        // WHEN
        comp.beforeRouteEnter({ params: { maladieId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.maladie).toBe(foundMaladie);
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
