<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <div class="row justify-content-center">
        <div class="col-8">
          <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
            <h2
              id="pathogeneApp.image.home.createOrEditLabel"
              data-cy="ImageCreateUpdateHeading"
              v-text="$t('pathogeneApp.image.home.createOrEditLabel')"
            >
              Create or edit a Image
            </h2>
            <div>
              <div class="form-group" v-if="image.id">
                <label for="id" v-text="$t('global.field.id')">ID</label>
                <input type="text" class="form-control" id="id" name="id" v-model="image.id" readonly />
              </div>
              <div class="form-group">
                <label class="form-control-label" v-text="$t('pathogeneApp.image.photo')" for="image-photo">Photo</label>
                <div>
                  <img
                    v-bind:src="'data:' + image.photoContentType + ';base64,' + image.photo"
                    style="max-height: 100px"
                    v-if="image.photo"
                    alt="image image"
                  />
                  <div v-if="image.photo" class="form-text text-danger clearfix">
                    <span class="pull-left">{{ image.photoContentType }}, {{ byteSize(image.photo) }}</span>
                    <button
                      type="button"
                      v-on:click="clearInputImage('photo', 'photoContentType', 'file_photo')"
                      class="btn btn-secondary btn-xs pull-right"
                    >
                      <font-awesome-icon icon="times"></font-awesome-icon>
                    </button>
                  </div>
                  <input
                    type="file"
                    ref="file_photo"
                    id="file_photo"
                    data-cy="photo"
                    v-on:change="setFileData($event, image, 'photo', true)"
                    accept="image/*"
                    v-text="$t('entity.action.addimage')"
                  />
                </div>
                <input
                  type="hidden"
                  class="form-control"
                  name="photo"
                  id="image-photo"
                  data-cy="photo"
                  :class="{ valid: !$v.image.photo.$invalid, invalid: $v.image.photo.$invalid }"
                  v-model="$v.image.photo.$model"
                />
                <input
                  type="hidden"
                  class="form-control"
                  name="photoContentType"
                  id="image-photoContentType"
                  v-model="image.photoContentType"
                />
              </div>
              <div class="form-group">
                <label class="form-control-label" v-text="$t('pathogeneApp.image.stade')" for="image-stade">Stage</label>
                <select class="form-control" id="image-stade" data-cy="stade" name="stade" v-model="image.stade">
                  <option v-bind:value="null"></option>
                  <option
                    v-bind:value="image.stade && stadeOption.id === image.stade.id ? image.stade : stadeOption"
                    v-for="stadeOption in stades"
                    :key="stadeOption.id"
                  >
                    {{ stadeOption.code }} - {{ stadeOption.level }}
                  </option>
                </select>
              </div>
            </div>
            <div>
              <button
                type="button"
                id="cancel-save"
                data-cy="entityCreateCancelButton"
                class="btn btn-secondary"
                v-on:click="previousState()"
              >
                <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.cancel')">Cancel</span>
              </button>
              <button
                type="submit"
                id="save-entity"
                data-cy="entityCreateSaveButton"
                :disabled="$v.image.$invalid || isSaving"
                class="btn btn-primary"
              >
                <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./image-update.component.ts"></script>
