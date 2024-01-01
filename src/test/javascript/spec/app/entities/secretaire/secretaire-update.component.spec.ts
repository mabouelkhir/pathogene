/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';
import { ToastPlugin } from 'bootstrap-vue';

import * as config from '@/shared/config/config';
import SecretaireUpdateComponent from '@/entities/secretaire/secretaire-update.vue';
import SecretaireClass from '@/entities/secretaire/secretaire-update.component';
import SecretaireService from '@/entities/secretaire/secretaire.service';

import UserService from '@/entities/user/user.service';

import MedecinService from '@/entities/medecin/medecin.service';

import PatientService from '@/entities/patient/patient.service';
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
  describe('Secretaire Management Update Component', () => {
    let wrapper: Wrapper<SecretaireClass>;
    let comp: SecretaireClass;
    let secretaireServiceStub: SinonStubbedInstance<SecretaireService>;

    beforeEach(() => {
      secretaireServiceStub = sinon.createStubInstance<SecretaireService>(SecretaireService);

      wrapper = shallowMount<SecretaireClass>(SecretaireUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          secretaireService: () => secretaireServiceStub,
          alertService: () => new AlertService(),

          userService: () => new UserService(),

          medecinService: () =>
            sinon.createStubInstance<MedecinService>(MedecinService, {
              retrieve: sinon.stub().resolves({}),
            } as any),

          patientService: () =>
            sinon.createStubInstance<PatientService>(PatientService, {
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
        comp.secretaire = entity;
        secretaireServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(secretaireServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.secretaire = entity;
        secretaireServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(secretaireServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundSecretaire = { id: 123 };
        secretaireServiceStub.find.resolves(foundSecretaire);
        secretaireServiceStub.retrieve.resolves([foundSecretaire]);

        // WHEN
        comp.beforeRouteEnter({ params: { secretaireId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.secretaire).toBe(foundSecretaire);
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
