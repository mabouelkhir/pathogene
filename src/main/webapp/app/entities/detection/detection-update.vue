<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <div class="row justify-content-center">
        <div class="col-8">
          <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
            <h2
              id="pathogeneApp.detection.home.createOrEditLabel"
              data-cy="DetectionCreateUpdateHeading"
              v-text="$t('pathogeneApp.detection.home.createOrEditLabel')"
            >
              Create or edit a Detection
            </h2>
            <div>
              <div class="form-group" v-if="detection.id">
                <label for="id" v-text="$t('global.field.id')">ID</label>
                <input type="text" class="form-control" id="id" name="id" v-model="detection.id" readonly />
              </div>
              <div class="form-group">
                <label class="form-control-label" v-text="$t('pathogeneApp.detection.photo')" for="detection-photo">Photo</label>
                <div>
                  <img
                    v-bind:src="'data:' + detection.photoContentType + ';base64,' + detection.photo"
                    style="max-height: 100px"
                    v-if="detection.photo"
                    alt="detection image"
                  />
                  <div v-if="detection.photo" class="form-text text-danger clearfix">
                    <span class="pull-left">{{ detection.photoContentType }}, {{ byteSize(detection.photo) }}</span>
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
                    v-on:change="setFileData($event, detection, 'photo', true)"
                    accept="image/*"
                    v-text="$t('entity.action.addimage')"
                  />
                </div>
                <input
                  type="hidden"
                  class="form-control"
                  name="photo"
                  id="detection-photo"
                  data-cy="photo"
                  :class="{ valid: !$v.detection.photo.$invalid, invalid: $v.detection.photo.$invalid }"
                  v-model="$v.detection.photo.$model"
                />
                <input
                  type="hidden"
                  class="form-control"
                  name="photoContentType"
                  id="detection-photoContentType"
                  v-model="detection.photoContentType"
                />
              </div>
              <div class="form-group">
                <label class="form-control-label" v-text="$t('pathogeneApp.detection.validation')" for="detection-validation"
                  >Validation</label
                >
                <input
                  type="checkbox"
                  class="form-check"
                  name="validation"
                  id="detection-validation"
                  data-cy="validation"
                  :class="{ valid: !$v.detection.validation.$invalid, invalid: $v.detection.validation.$invalid }"
                  v-model="$v.detection.validation.$model"
                />
              </div>
              <div class="form-group">
                <label class="form-control-label" v-text="$t('pathogeneApp.detection.maladie')" for="detection-maladie">Disease </label>
                <select class="form-control" id="detection-maladie" data-cy="maladie" name="maladie" v-model="detection.maladie">
                  <option v-bind:value="null"></option>
                  <option
                    v-bind:value="detection.maladie && maladieOption.id === detection.maladie.id ? detection.maladie : maladieOption"
                    v-for="maladieOption in maladies"
                    :key="maladieOption.id"
                  >
                    {{ maladieOption.nom }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-control-label" v-text="$t('pathogeneApp.detection.patient')" for="detection-patient">Patient</label>
                <select class="form-control" id="detection-patient" data-cy="patient" name="patient" v-model="detection.patient">
                  <option v-bind:value="null"></option>
                  <option
                    v-bind:value="detection.patient && patientOption.id === detection.patient.id ? detection.patient : patientOption"
                    v-for="patientOption in patients"
                    :key="patientOption.id"
                  >
                    {{ patientOption.nom }} {{ patientOption.prenom }}
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
                :disabled="$v.detection.$invalid || isSaving"
                class="btn btn-primary"
              >
                <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
              </button>
            </div>
          </form>
        </div>
        <b-modal ref="afficheEntity" id="afficheEntity">
          <span slot="modal-title"
            ><span id="pathogeneApp.detection.affiche.question" data-cy="detectionAfficheDialogHeading">Result AI</span></span
          >
          <div class="modal-body">
            <dl class="row jh-entity-details">
              <dt>
                <span>Photo</span>
              </dt>
              <dd>
                <div v-if="detection.photo">
                  <a v-on:click="openFile(detection.photoContentType, detection.photo)">
                    <img
                      v-bind:src="'data:' + detection.photoContentType + ';base64,' + detection.photo"
                      style="max-width: 100%"
                      alt="patient image"
                    />
                  </a>
                  {{ detection.photoContentType }}, {{ byteSize(detection.photo) }}
                </div>
              </dd>
              <dt>
                <span>Description</span>
              </dt>
              <dd>
                <span>{{ detection.description }}</span>
              </dd>
            </dl>
          </div>
          <div slot="modal-footer">
            <button type="button" class="btn btn-secondary" v-on:click="closeDialog()">Quitter</button>
          </div>
        </b-modal>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./detection-update.component.ts"></script>
