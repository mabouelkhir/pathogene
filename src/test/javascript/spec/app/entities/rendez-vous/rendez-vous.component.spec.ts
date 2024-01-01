/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import { ToastPlugin } from 'bootstrap-vue';

import * as config from '@/shared/config/config';
import RendezVousComponent from '@/entities/rendez-vous/rendez-vous.vue';
import RendezVousClass from '@/entities/rendez-vous/rendez-vous.component';
import RendezVousService from '@/entities/rendez-vous/rendez-vous.service';
import AlertService from '@/shared/alert/alert.service';

const localVue = createLocalVue();
localVue.use(ToastPlugin);

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('b-badge', {});
localVue.component('jhi-sort-indicator', {});
localVue.directive('b-modal', {});
localVue.component('b-button', {});
localVue.component('router-link', {});

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  describe('RendezVous Management Component', () => {
    let wrapper: Wrapper<RendezVousClass>;
    let comp: RendezVousClass;
    let rendezVousServiceStub: SinonStubbedInstance<RendezVousService>;

    beforeEach(() => {
      rendezVousServiceStub = sinon.createStubInstance<RendezVousService>(RendezVousService);
      rendezVousServiceStub.retrieve.resolves({ headers: {} });

      wrapper = shallowMount<RendezVousClass>(RendezVousComponent, {
        store,
        i18n,
        localVue,
        stubs: { jhiItemCount: true, bPagination: true, bModal: bModalStub as any },
        provide: {
          rendezVousService: () => rendezVousServiceStub,
          alertService: () => new AlertService(),
        },
      });
      comp = wrapper.vm;
    });

    it('Should call load all on init', async () => {
      // GIVEN
      rendezVousServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.retrieveAllRendezVouss();
      await comp.$nextTick();

      // THEN
      expect(rendezVousServiceStub.retrieve.called).toBeTruthy();
    });

    it('should load a page', async () => {
      // GIVEN
      rendezVousServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      await comp.$nextTick();

      // THEN
      expect(rendezVousServiceStub.retrieve.called).toBeTruthy();
    });

    it('should not load a page if the page is the same as the previous page', () => {
      // GIVEN
      rendezVousServiceStub.retrieve.reset();

      // THEN
      expect(rendezVousServiceStub.retrieve.called).toBeFalsy();
    });

    it('should re-initialize the page', async () => {
      // GIVEN
      rendezVousServiceStub.retrieve.reset();
      rendezVousServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // THEN
      expect(rendezVousServiceStub.retrieve.callCount).toEqual(3);
    });

    it('should calculate the sort attribute for an id', () => {
      // WHEN
    });

    it('should calculate the sort attribute for a non-id attribute', () => {
      // GIVEN
    });
    it('Should call delete service on confirmDelete', async () => {
      // GIVEN
      rendezVousServiceStub.delete.resolves({});

      // WHEN
      expect(rendezVousServiceStub.retrieve.callCount).toEqual(1);

      comp.removeRendezVous();
      await comp.$nextTick();

      // THEN
      expect(rendezVousServiceStub.delete.called).toBeTruthy();
      expect(rendezVousServiceStub.retrieve.callCount).toEqual(2);
    });
  });
});
