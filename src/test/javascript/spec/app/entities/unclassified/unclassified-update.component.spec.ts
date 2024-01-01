/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';
import { ToastPlugin } from 'bootstrap-vue';

import * as config from '@/shared/config/config';
import UnclassifiedUpdateComponent from '@/entities/unclassified/unclassified-update.vue';
import UnclassifiedClass from '@/entities/unclassified/unclassified-update.component';
import UnclassifiedService from '@/entities/unclassified/unclassified.service';

import ClassificationService from '@/entities/classification/classification.service';

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
  describe('Unclassified Management Update Component', () => {
    let wrapper: Wrapper<UnclassifiedClass>;
    let comp: UnclassifiedClass;
    let unclassifiedServiceStub: SinonStubbedInstance<UnclassifiedService>;

    beforeEach(() => {
      unclassifiedServiceStub = sinon.createStubInstance<UnclassifiedService>(UnclassifiedService);

      wrapper = shallowMount<UnclassifiedClass>(UnclassifiedUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          unclassifiedService: () => unclassifiedServiceStub,
          alertService: () => new AlertService(),

          classificationService: () =>
            sinon.createStubInstance<ClassificationService>(ClassificationService, {
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
        comp.unclassified = entity;
        unclassifiedServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(unclassifiedServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.unclassified = entity;
        unclassifiedServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(unclassifiedServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundUnclassified = { id: 123 };
        unclassifiedServiceStub.find.resolves(foundUnclassified);
        unclassifiedServiceStub.retrieve.resolves([foundUnclassified]);

        // WHEN
        comp.beforeRouteEnter({ params: { unclassifiedId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.unclassified).toBe(foundUnclassified);
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
