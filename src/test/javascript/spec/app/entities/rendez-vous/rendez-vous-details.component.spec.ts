/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import RendezVousDetailComponent from '@/entities/rendez-vous/rendez-vous-details.vue';
import RendezVousClass from '@/entities/rendez-vous/rendez-vous-details.component';
import RendezVousService from '@/entities/rendez-vous/rendez-vous.service';
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
  describe('RendezVous Management Detail Component', () => {
    let wrapper: Wrapper<RendezVousClass>;
    let comp: RendezVousClass;
    let rendezVousServiceStub: SinonStubbedInstance<RendezVousService>;

    beforeEach(() => {
      rendezVousServiceStub = sinon.createStubInstance<RendezVousService>(RendezVousService);

      wrapper = shallowMount<RendezVousClass>(RendezVousDetailComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: { rendezVousService: () => rendezVousServiceStub, alertService: () => new AlertService() },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundRendezVous = { id: 123 };
        rendezVousServiceStub.find.resolves(foundRendezVous);

        // WHEN
        comp.retrieveRendezVous(123);
        await comp.$nextTick();

        // THEN
        expect(comp.rendezVous).toBe(foundRendezVous);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundRendezVous = { id: 123 };
        rendezVousServiceStub.find.resolves(foundRendezVous);

        // WHEN
        comp.beforeRouteEnter({ params: { rendezVousId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.rendezVous).toBe(foundRendezVous);
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
