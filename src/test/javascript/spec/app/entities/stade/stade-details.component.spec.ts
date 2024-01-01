/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import StadeDetailComponent from '@/entities/stade/stade-details.vue';
import StadeClass from '@/entities/stade/stade-details.component';
import StadeService from '@/entities/stade/stade.service';
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
  describe('Stade Management Detail Component', () => {
    let wrapper: Wrapper<StadeClass>;
    let comp: StadeClass;
    let stadeServiceStub: SinonStubbedInstance<StadeService>;

    beforeEach(() => {
      stadeServiceStub = sinon.createStubInstance<StadeService>(StadeService);

      wrapper = shallowMount<StadeClass>(StadeDetailComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: { stadeService: () => stadeServiceStub, alertService: () => new AlertService() },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundStade = { id: 123 };
        stadeServiceStub.find.resolves(foundStade);

        // WHEN
        comp.retrieveStade(123);
        await comp.$nextTick();

        // THEN
        expect(comp.stade).toBe(foundStade);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundStade = { id: 123 };
        stadeServiceStub.find.resolves(foundStade);

        // WHEN
        comp.beforeRouteEnter({ params: { stadeId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.stade).toBe(foundStade);
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
