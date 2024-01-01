/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';
import { ToastPlugin } from 'bootstrap-vue';

import * as config from '@/shared/config/config';
import ImageUpdateComponent from '@/entities/image/image-update.vue';
import ImageClass from '@/entities/image/image-update.component';
import ImageService from '@/entities/image/image.service';

import StadeService from '@/entities/stade/stade.service';
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
  describe('Image Management Update Component', () => {
    let wrapper: Wrapper<ImageClass>;
    let comp: ImageClass;
    let imageServiceStub: SinonStubbedInstance<ImageService>;

    beforeEach(() => {
      imageServiceStub = sinon.createStubInstance<ImageService>(ImageService);

      wrapper = shallowMount<ImageClass>(ImageUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          imageService: () => imageServiceStub,
          alertService: () => new AlertService(),

          stadeService: () =>
            sinon.createStubInstance<StadeService>(StadeService, {
              retrieve: sinon.stub().resolves({}),
            } as any),
        },
      });
      comp = wrapper.vm;
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.image = entity;
        imageServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(imageServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.image = entity;
        imageServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(imageServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundImage = { id: 123 };
        imageServiceStub.find.resolves(foundImage);
        imageServiceStub.retrieve.resolves([foundImage]);

        // WHEN
        comp.beforeRouteEnter({ params: { imageId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.image).toBe(foundImage);
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
