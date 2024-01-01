/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import CompteDetailComponent from '@/entities/compte/compte-details.vue';
import CompteClass from '@/entities/compte/compte-details.component';
import CompteService from '@/entities/compte/compte.service';
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
  describe('Compte Management Detail Component', () => {
    let wrapper: Wrapper<CompteClass>;
    let comp: CompteClass;
    let compteServiceStub: SinonStubbedInstance<CompteService>;

    beforeEach(() => {
      compteServiceStub = sinon.createStubInstance<CompteService>(CompteService);

      wrapper = shallowMount<CompteClass>(CompteDetailComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: { compteService: () => compteServiceStub, alertService: () => new AlertService() },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundCompte = { id: 123 };
        compteServiceStub.find.resolves(foundCompte);

        // WHEN
        comp.retrieveCompte(123);
        await comp.$nextTick();

        // THEN
        expect(comp.compte).toBe(foundCompte);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundCompte = { id: 123 };
        compteServiceStub.find.resolves(foundCompte);

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
