<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <div class="row justify-content-center">
        <div class="col-8">
          <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
            <h2 id="pathogeneApp.stade.home.createOrEditLabel" data-cy="StadeCreateUpdateHeading">Create or edit a Stage</h2>
            <div>
              <div class="form-group" v-if="stade.id">
                <label for="id">ID</label>
                <input type="text" class="form-control" id="id" name="id" v-model="stade.id" readonly />
              </div>

              <div class="form-group">
                <label class="form-control-label" for="stade-level">Level</label>
                <input
                  type="text"
                  class="form-control"
                  name="level"
                  id="stade-level"
                  data-cy="level"
                  :class="{ valid: !$v.stade.level.$invalid, invalid: $v.stade.level.$invalid }"
                  v-model="$v.stade.level.$model"
                />
              </div>
              <div class="form-group">
                <label class="form-control-label" for="stade-description">Description</label>
                <input
                  type="text"
                  class="form-control"
                  name="description"
                  id="stade-description"
                  data-cy="description"
                  :class="{ valid: !$v.stade.description.$invalid, invalid: $v.stade.description.$invalid }"
                  v-model="$v.stade.description.$model"
                />
              </div>
              <div class="form-group">
                <label class="form-control-label" for="stade-maladie">Disease</label>
                <select class="form-control" id="stade-maladie" data-cy="maladie" name="maladie" v-model="stade.maladie">
                  <option v-bind:value="null"></option>
                  <option
                    v-bind:value="stade.maladie && maladieOption.id === stade.maladie.id ? stade.maladie : maladieOption"
                    v-for="maladieOption in maladies"
                    :key="maladieOption.id"
                  >
                    {{ maladieOption.nom }}
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
                <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span>Cancel</span>
              </button>
              <button
                type="submit"
                id="save-entity"
                data-cy="entityCreateSaveButton"
                :disabled="$v.stade.$invalid || isSaving"
                class="btn btn-primary"
              >
                <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span>Save</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./stade-update.component.ts"></script>
