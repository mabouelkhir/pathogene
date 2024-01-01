<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="pathogeneApp.compte.home.createOrEditLabel"
          data-cy="CompteCreateUpdateHeading"
          v-text="$t('pathogeneApp.compte.home.createOrEditLabel')"
        >
          Create or edit a Compte
        </h2>
        <div>
          <div class="form-group" v-if="compte.id">
            <label for="id" v-text="$t('global.field.id')">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="compte.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('pathogeneApp.compte.user')" for="compte-user">User</label>
            <select class="form-control" id="compte-user" data-cy="user" name="user" v-model="compte.user">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="compte.user && userOption.id === compte.user.id ? compte.user : userOption"
                v-for="userOption in users"
                :key="userOption.id"
              >
                {{ userOption.id }}
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
            :disabled="$v.compte.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./compte-update.component.ts"></script>
