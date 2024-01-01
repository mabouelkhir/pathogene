<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <div class="row justify-content-center">
        <div class="col-8">
          <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
            <h2
              id="pathogeneApp.visite.home.createOrEditLabel"
              data-cy="VisiteCreateUpdateHeading"
              v-text="$t('pathogeneApp.visite.home.createOrEditLabel')"
            >
              Create or edit a Visit
            </h2>
            <div>
              <div class="form-group" v-if="visite.id">
                <label for="id" v-text="$t('global.field.id')">ID</label>
                <input type="text" class="form-control" id="id" name="id" v-model="visite.id" readonly />
              </div>
              <div class="form-group">
                <label class="form-control-label" v-text="$t('pathogeneApp.visite.code')" for="visite-code">Code</label>
                <input
                  type="text"
                  class="form-control"
                  name="code"
                  id="visite-code"
                  data-cy="code"
                  :class="{ valid: !$v.visite.code.$invalid, invalid: $v.visite.code.$invalid }"
                  v-model="$v.visite.code.$model"
                />
                <div v-if="$v.visite.code.$anyDirty && $v.visite.code.$invalid"></div>
              </div>
              <div class="form-group">
                <label class="form-control-label" v-text="$t('pathogeneApp.visite.date')" for="visite-date">Date</label>
                <div class="d-flex">
                  <input
                    id="visite-date"
                    data-cy="date"
                    type="datetime-local"
                    class="form-control"
                    name="date"
                    :class="{ valid: !$v.visite.date.$invalid, invalid: $v.visite.date.$invalid }"
                    :value="convertDateTimeFromServer($v.visite.date.$model)"
                    @change="updateZonedDateTimeField('date', $event)"
                  />
                </div>
              </div>
              <div class="form-group">
                <label class="form-control-label" v-text="$t('pathogeneApp.visite.rendezVous')" for="visite-rendezVous">Appointment </label>
                <select class="form-control" id="visite-rendezVous" data-cy="rendezVous" name="rendezVous" v-model="visite.rendezVous">
                  <option v-bind:value="null"></option>
                  <option
                    v-bind:value="visite.rendezVous && rendezVousOption.id === visite.rendezVous.id ? visite.rendezVous : rendezVousOption"
                    v-for="rendezVousOption in rendezVous"
                    :key="rendezVousOption.id"
                  >
                    {{ rendezVousOption.id }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-control-label" v-text="$t('pathogeneApp.visite.detection')" for="visite-detection">Detection</label>
                <select class="form-control" id="visite-detection" data-cy="detection" name="detection" v-model="visite.detection">
                  <option v-bind:value="null"></option>
                  <option
                    v-bind:value="visite.detection && detectionOption.id === visite.detection.id ? visite.detection : detectionOption"
                    v-for="detectionOption in detections"
                    :key="detectionOption.id"
                  >
                    {{ detectionOption.id }}
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
                :disabled="$v.visite.$invalid || isSaving"
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
<script lang="ts" src="./visite-update.component.ts"></script>
