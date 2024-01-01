/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import MedecinDetailComponent from '@/entities/medecin/medecin-details.vue';
import MedecinClass from '@/entities/medecin/medecin-details.component';
import MedecinService from '@/entities/medecin/medecin.service';
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
  describe('Medecin Management Detail Component', () => {
    let wrapper: Wrapper<MedecinClass>;
    let comp: MedecinClass;
    let medecinServiceStub: SinonStubbedInstance<MedecinService>;

    beforeEach(() => {
      medecinServiceStub = sinon.createStubInstance<MedecinService>(MedecinService);

      wrapper = shallowMount<MedecinClass>(MedecinDetailComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: { medecinService: () => medecinServiceStub, alertService: () => new AlertService() },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundMedecin = { id: 123 };
        medecinServiceStub.find.resolves(foundMedecin);

        // WHEN
        comp.retrieveMedecin(123);
        await comp.$nextTick();

        // THEN
        expect(comp.medecin).toBe(foundMedecin);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundMedecin = { id: 123 };
        medecinServiceStub.find.resolves(foundMedecin);

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
