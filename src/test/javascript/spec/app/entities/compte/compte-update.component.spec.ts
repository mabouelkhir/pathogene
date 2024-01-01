/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';
import { ToastPlugin } from 'bootstrap-vue';

import * as config from '@/shared/config/config';
import CompteUpdateComponent from '@/entities/compte/compte-update.vue';
import CompteClass from '@/entities/compte/compte-update.component';
import CompteService from '@/entities/compte/compte.service';

import UserService from '@/entities/user/user.service';
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
  describe('Compte Management Update Component', () => {
    let wrapper: Wrapper<CompteClass>;
    let comp: CompteClass;
    let compteServiceStub: SinonStubbedInstance<CompteService>;

    beforeEach(() => {
      compteServiceStub = sinon.createStubInstance<CompteService>(CompteService);

      wrapper = shallowMount<CompteClass>(CompteUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          compteService: () => compteServiceStub,
          alertService: () => new AlertService(),

          userService: () => new UserService(),
        },
      });
      comp = wrapper.vm;
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.compte = entity;
        compteServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(compteServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.compte = entity;
        compteServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(compteServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundCompte = { id: 123 };
        compteServiceStub.find.resolves(foundCompte);
        compteServiceStub.retrieve.resolves([foundCompte]);

        // WHEN
        comp.beforeRouteEnter({ params: { compteId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.compte).toBe(foundCompte);
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
