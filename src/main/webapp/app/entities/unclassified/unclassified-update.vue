<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="pathogeneApp.unclassified.home.createOrEditLabel"
          data-cy="UnclassifiedCreateUpdateHeading"
          v-text="$t('pathogeneApp.unclassified.home.createOrEditLabel')"
        >
          Create or edit a Unclassified
        </h2>
        <div>
          <div class="form-group" v-if="unclassified.id">
            <label for="id" v-text="$t('global.field.id')">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="unclassified.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('pathogeneApp.unclassified.code')" for="unclassified-code">Code</label>
            <input
              type="text"
              class="form-control"
              name="code"
              id="unclassified-code"
              data-cy="code"
              :class="{ valid: !$v.unclassified.code.$invalid, invalid: $v.unclassified.code.$invalid }"
              v-model="$v.unclassified.code.$model"
            />
            <div v-if="$v.unclassified.code.$anyDirty && $v.unclassified.code.$invalid"></div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('pathogeneApp.unclassified.photo')" for="unclassified-photo">Photo</label>
            <div>
              <img
                v-bind:src="'data:' + unclassified.photoContentType + ';base64,' + unclassified.photo"
                style="max-height: 100px"
                v-if="unclassified.photo"
                alt="unclassified image"
              />
              <div v-if="unclassified.photo" class="form-text text-danger clearfix">
                <span class="pull-left">{{ unclassified.photoContentType }}, {{ byteSize(unclassified.photo) }}</span>
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
                v-on:change="setFileData($event, unclassified, 'photo', true)"
                accept="image/*"
                v-text="$t('entity.action.addimage')"
              />
            </div>
            <input
              type="hidden"
              class="form-control"
              name="photo"
              id="unclassified-photo"
              data-cy="photo"
              :class="{ valid: !$v.unclassified.photo.$invalid, invalid: $v.unclassified.photo.$invalid }"
              v-model="$v.unclassified.photo.$model"
            />
            <input
              type="hidden"
              class="form-control"
              name="photoContentType"
              id="unclassified-photoContentType"
              v-model="unclassified.photoContentType"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('pathogeneApp.unclassified.maladie')" for="unclassified-maladie">Maladie</label>
            <select class="form-control" id="unclassified-maladie" data-cy="maladie" name="maladie" v-model="unclassified.maladie">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="unclassified.maladie && maladieOption.id === unclassified.maladie.id ? unclassified.maladie : maladieOption"
                v-for="maladieOption in maladies"
                :key="maladieOption.id"
              >
                {{ maladieOption.id }}
              </option>
            </select>
          </div>
        </div>
        <div>
          <button type="button" id="cancel-save" data-cy="entityCreateCancelButton" class="btn btn-secondary" v-on:click="previousState()">
            <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.cancel')">Cancel</span>
          </button>
          <button
            type="submit"
            id="save-entity"
            data-cy="entityCreateSaveButton"
            :disabled="$v.unclassified.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./unclassified-update.component.ts"></script>
