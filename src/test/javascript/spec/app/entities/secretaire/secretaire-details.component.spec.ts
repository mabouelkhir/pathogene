/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import SecretaireDetailComponent from '@/entities/secretaire/secretaire-details.vue';
import SecretaireClass from '@/entities/secretaire/secretaire-details.component';
import SecretaireService from '@/entities/secretaire/secretaire.service';
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
  describe('Secretaire Management Detail Component', () => {
    let wrapper: Wrapper<SecretaireClass>;
    let comp: SecretaireClass;
    let secretaireServiceStub: SinonStubbedInstance<SecretaireService>;

    beforeEach(() => {
      secretaireServiceStub = sinon.createStubInstance<SecretaireService>(SecretaireService);

      wrapper = shallowMount<SecretaireClass>(SecretaireDetailComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: { secretaireService: () => secretaireServiceStub, alertService: () => new AlertService() },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundSecretaire = { id: 123 };
        secretaireServiceStub.find.resolves(foundSecretaire);

        // WHEN
        comp.retrieveSecretaire(123);
        await comp.$nextTick();

        // THEN
        expect(comp.secretaire).toBe(foundSecretaire);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundSecretaire = { id: 123 };
        secretaireServiceStub.find.resolves(foundSecretaire);

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
