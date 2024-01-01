/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';
import { ToastPlugin } from 'bootstrap-vue';

import dayjs from 'dayjs';
import { DATE_TIME_LONG_FORMAT } from '@/shared/date/filters';

import * as config from '@/shared/config/config';
import DetectionUpdateComponent from '@/entities/detection/detection-update.vue';
import DetectionClass from '@/entities/detection/detection-update.component';
import DetectionService from '@/entities/detection/detection.service';

import VisiteService from '@/entities/visite/visite.service';

import MaladieService from '@/entities/maladie/maladie.service';

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
  describe('Detection Management Update Component', () => {
    let wrapper: Wrapper<DetectionClass>;
    let comp: DetectionClass;
    let detectionServiceStub: SinonStubbedInstance<DetectionService>;

    beforeEach(() => {
      detectionServiceStub = sinon.createStubInstance<DetectionService>(DetectionService);

      wrapper = shallowMount<DetectionClass>(DetectionUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          detectionService: () => detectionServiceStub,
          alertService: () => new AlertService(),

          visiteService: () =>
            sinon.createStubInstance<VisiteService>(VisiteService, {
              retrieve: sinon.stub().resolves({}),
            } as any),

          maladieService: () =>
            sinon.createStubInstance<MaladieService>(MaladieService, {
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

    describe('load', () => {
      it('Should convert date from string', () => {
        // GIVEN
        const date = new Date('2019-10-15T11:42:02Z');

        // WHEN
        const convertedDate = comp.convertDateTimeFromServer(date);

        // THEN
        expect(convertedDate).toEqual(dayjs(date).format(DATE_TIME_LONG_FORMAT));
      });

      it('Should not convert date if date is not present', () => {
        expect(comp.convertDateTimeFromServer(null)).toBeNull();
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.detection = entity;
        detectionServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(detectionServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.detection = entity;
        detectionServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(detectionServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundDetection = { id: 123 };
        detectionServiceStub.find.resolves(foundDetection);
        detectionServiceStub.retrieve.resolves([foundDetection]);

        // WHEN
        comp.beforeRouteEnter({ params: { detectionId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.detection).toBe(foundDetection);
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
