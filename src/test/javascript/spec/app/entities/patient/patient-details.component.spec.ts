/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import PatientDetailComponent from '@/entities/patient/patient-details.vue';
import PatientClass from '@/entities/patient/patient-details.component';
import PatientService from '@/entities/patient/patient.service';
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
  describe('Patient Management Detail Component', () => {
    let wrapper: Wrapper<PatientClass>;
    let comp: PatientClass;
    let patientServiceStub: SinonStubbedInstance<PatientService>;

    beforeEach(() => {
      patientServiceStub = sinon.createStubInstance<PatientService>(PatientService);

      wrapper = shallowMount<PatientClass>(PatientDetailComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: { patientService: () => patientServiceStub, alertService: () => new AlertService() },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundPatient = { id: 123 };
        patientServiceStub.find.resolves(foundPatient);

        // WHEN
        comp.retrievePatient(123);
        await comp.$nextTick();

        // THEN
        expect(comp.patient).toBe(foundPatient);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundPatient = { id: 123 };
        patientServiceStub.find.resolves(foundPatient);

        // WHEN
        comp.beforeRouteEnter({ params: { patientId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.patient).toBe(foundPatient);
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
