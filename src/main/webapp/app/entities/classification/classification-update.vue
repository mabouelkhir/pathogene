<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="pathogeneApp.classification.home.createOrEditLabel"
          data-cy="ClassificationCreateUpdateHeading"
          v-text="$t('pathogeneApp.classification.home.createOrEditLabel')"
        >
          Create or edit a Classification
        </h2>
        <div>
          <div class="form-group" v-if="classification.id">
            <label for="id" v-text="$t('global.field.id')">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="classification.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('pathogeneApp.classification.code')" for="classification-code">Code</label>
            <input
              type="text"
              class="form-control"
              name="code"
              id="classification-code"
              data-cy="code"
              :class="{ valid: !$v.classification.code.$invalid, invalid: $v.classification.code.$invalid }"
              v-model="$v.classification.code.$model"
            />
            <div v-if="$v.classification.code.$anyDirty && $v.classification.code.$invalid"></div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('pathogeneApp.classification.score')" for="classification-score">Score</label>
            <input
              type="checkbox"
              class="form-check"
              name="score"
              id="classification-score"
              data-cy="score"
              :class="{ valid: !$v.classification.score.$invalid, invalid: $v.classification.score.$invalid }"
              v-model="$v.classification.score.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('pathogeneApp.classification.medecin')" for="classification-medecin"
              >Medecin</label
            >
            <select class="form-control" id="classification-medecin" data-cy="medecin" name="medecin" v-model="classification.medecin">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="
                  classification.medecin && medecinOption.id === classification.medecin.id ? classification.medecin : medecinOption
                "
                v-for="medecinOption in medecins"
                :key="medecinOption.id"
              >
                {{ medecinOption.id }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('pathogeneApp.classification.stade')" for="classification-stade">Stade</label>
            <select class="form-control" id="classification-stade" data-cy="stade" name="stade" v-model="classification.stade">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="classification.stade && stadeOption.id === classification.stade.id ? classification.stade : stadeOption"
                v-for="stadeOption in stades"
                :key="stadeOption.id"
              >
                {{ stadeOption.id }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('pathogeneApp.classification.unclassified')" for="classification-unclassified"
              >Unclassified</label
            >
            <select
              class="form-control"
              id="classification-unclassified"
              data-cy="unclassified"
              name="unclassified"
              v-model="classification.unclassified"
            >
              <option v-bind:value="null"></option>
              <option
                v-bind:value="
                  classification.unclassified && unclassifiedOption.id === classification.unclassified.id
                    ? classification.unclassified
                    : unclassifiedOption
                "
                v-for="unclassifiedOption in unclassifieds"
                :key="unclassifiedOption.id"
              >
                {{ unclassifiedOption.id }}
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
            :disabled="$v.classification.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./classification-update.component.ts"></script>
