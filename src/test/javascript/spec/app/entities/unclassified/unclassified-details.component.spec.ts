/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import UnclassifiedDetailComponent from '@/entities/unclassified/unclassified-details.vue';
import UnclassifiedClass from '@/entities/unclassified/unclassified-details.component';
import UnclassifiedService from '@/entities/unclassified/unclassified.service';
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
  describe('Unclassified Management Detail Component', () => {
    let wrapper: Wrapper<UnclassifiedClass>;
    let comp: UnclassifiedClass;
    let unclassifiedServiceStub: SinonStubbedInstance<UnclassifiedService>;

    beforeEach(() => {
      unclassifiedServiceStub = sinon.createStubInstance<UnclassifiedService>(UnclassifiedService);

      wrapper = shallowMount<UnclassifiedClass>(UnclassifiedDetailComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: { unclassifiedService: () => unclassifiedServiceStub, alertService: () => new AlertService() },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundUnclassified = { id: 123 };
        unclassifiedServiceStub.find.resolves(foundUnclassified);

        // WHEN
        comp.retrieveUnclassified(123);
        await comp.$nextTick();

        // THEN
        expect(comp.unclassified).toBe(foundUnclassified);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundUnclassified = { id: 123 };
        unclassifiedServiceStub.find.resolves(foundUnclassified);

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
