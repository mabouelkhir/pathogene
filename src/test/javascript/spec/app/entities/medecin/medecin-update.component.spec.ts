/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';
import { ToastPlugin } from 'bootstrap-vue';

import * as config from '@/shared/config/config';
import MedecinUpdateComponent from '@/entities/medecin/medecin-update.vue';
import MedecinClass from '@/entities/medecin/medecin-update.component';
import MedecinService from '@/entities/medecin/medecin.service';

import UserService from '@/entities/user/user.service';

import ClassificationService from '@/entities/classification/classification.service';

import RendezVousService from '@/entities/rendez-vous/rendez-vous.service';

import SecretaireService from '@/entities/secretaire/secretaire.service';
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
  describe('Medecin Management Update Component', () => {
    let wrapper: Wrapper<MedecinClass>;
    let comp: MedecinClass;
    let medecinServiceStub: SinonStubbedInstance<MedecinService>;

    beforeEach(() => {
      medecinServiceStub = sinon.createStubInstance<MedecinService>(MedecinService);

      wrapper = shallowMount<MedecinClass>(MedecinUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          medecinService: () => medecinServiceStub,
          alertService: () => new AlertService(),

          userService: () => new UserService(),

          classificationService: () =>
            sinon.createStubInstance<ClassificationService>(ClassificationService, {
              retrieve: sinon.stub().resolves({}),
            } as any),

          rendezVousService: () =>
            sinon.createStubInstance<RendezVousService>(RendezVousService, {
              retrieve: sinon.stub().resolves({}),
            } as any),

          secretaireService: () =>
            sinon.createStubInstance<SecretaireService>(SecretaireService, {
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
        comp.medecin = entity;
        medecinServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(medecinServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.medecin = entity;
        medecinServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(medecinServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundMedecin = { id: 123 };
        medecinServiceStub.find.resolves(foundMedecin);
        medecinServiceStub.retrieve.resolves([foundMedecin]);

        // WHEN
        comp.beforeRouteEnter({ params: { medecinId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.medecin).toBe(foundMedecin);
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
