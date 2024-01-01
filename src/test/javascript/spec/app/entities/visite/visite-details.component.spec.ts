/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import VisiteDetailComponent from '@/entities/visite/visite-details.vue';
import VisiteClass from '@/entities/visite/visite-details.component';
import VisiteService from '@/entities/visite/visite.service';
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
  describe('Visite Management Detail Component', () => {
    let wrapper: Wrapper<VisiteClass>;
    let comp: VisiteClass;
    let visiteServiceStub: SinonStubbedInstance<VisiteService>;

    beforeEach(() => {
      visiteServiceStub = sinon.createStubInstance<VisiteService>(VisiteService);

      wrapper = shallowMount<VisiteClass>(VisiteDetailComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: { visiteService: () => visiteServiceStub, alertService: () => new AlertService() },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundVisite = { id: 123 };
        visiteServiceStub.find.resolves(foundVisite);

        // WHEN
        comp.retrieveVisite(123);
        await comp.$nextTick();

        // THEN
        expect(comp.visite).toBe(foundVisite);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundVisite = { id: 123 };
        visiteServiceStub.find.resolves(foundVisite);

        // WHEN
        comp.beforeRouteEnter({ params: { visiteId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.visite).toBe(foundVisite);
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
