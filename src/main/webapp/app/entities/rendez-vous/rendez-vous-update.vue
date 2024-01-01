<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="pathogeneApp.rendezVous.home.createOrEditLabel"
          data-cy="RendezVousCreateUpdateHeading"
          v-text="$t('pathogeneApp.rendezVous.home.createOrEditLabel')"
        >
          Create or edit a Appointment
        </h2>
        <div>
          <div class="form-group" v-if="rendezVous.id">
            <label for="id" v-text="$t('global.field.id')">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="rendezVous.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('pathogeneApp.rendezVous.date')" for="rendez-vous-date">Date</label>
            <div class="d-flex">
              <input
                id="rendez-vous-date"
                data-cy="date"
                type="datetime-local"
                class="form-control"
                name="date"
                :class="{ valid: !$v.rendezVous.date.$invalid, invalid: $v.rendezVous.date.$invalid }"
                :value="convertDateTimeFromServer($v.rendezVous.date.$model)"
                @change="updateZonedDateTimeField('date', $event)"
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('pathogeneApp.rendezVous.code')" for="rendez-vous-code">Code</label>
            <input
              type="text"
              class="form-control"
              name="code"
              id="rendez-vous-code"
              data-cy="code"
              :class="{ valid: !$v.rendezVous.code.$invalid, invalid: $v.rendezVous.code.$invalid }"
              v-model="$v.rendezVous.code.$model"
            />
            <div v-if="$v.rendezVous.code.$anyDirty && $v.rendezVous.code.$invalid"></div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('pathogeneApp.rendezVous.status')" for="rendez-vous-status">Status</label>
            <input
              type="text"
              class="form-control"
              name="status"
              id="rendez-vous-status"
              data-cy="status"
              :class="{ valid: !$v.rendezVous.status.$invalid, invalid: $v.rendezVous.status.$invalid }"
              v-model="$v.rendezVous.status.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('pathogeneApp.rendezVous.patient')" for="rendez-vous-patient">Patient</label>
            <select class="form-control" id="rendez-vous-patient" data-cy="patient" name="patient" v-model="rendezVous.patient">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="rendezVous.patient && patientOption.id === rendezVous.patient.id ? rendezVous.patient : patientOption"
                v-for="patientOption in patients"
                :key="patientOption.id"
              >
                {{ patientOption.id }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('pathogeneApp.rendezVous.medecin')" for="rendez-vous-medecin">Doctor </label>
            <select class="form-control" id="rendez-vous-medecin" data-cy="medecin" name="medecin" v-model="rendezVous.medecin">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="rendezVous.medecin && medecinOption.id === rendezVous.medecin.id ? rendezVous.medecin : medecinOption"
                v-for="medecinOption in medecins"
                :key="medecinOption.id"
              >
                {{ medecinOption.id }}
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
            :disabled="$v.rendezVous.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./rendez-vous-update.component.ts"></script>
