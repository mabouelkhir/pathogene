<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <div class="row justify-content-center">
        <div class="col-8">
          <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
            <h2 id="pathogeneApp.secretaire.home.createOrEditLabel" data-cy="SecretaireCreateUpdateHeading">Create a Secretaire</h2>
            <div>
              <div class="form-group">
                <label class="form-control-label" for="secretaire-nom">Last Name</label>
                <input
                  type="text"
                  class="form-control"
                  name="nom"
                  id="secretaire-nom"
                  data-cy="nom"
                  :class="{ valid: !$v.secretaire.nom.$invalid, invalid: $v.secretaire.nom.$invalid }"
                  v-model="$v.secretaire.nom.$model"
                />
              </div>

              <div class="form-group">
                <label class="form-control-label" for="secretaire-prenom">First Name</label>
                <input
                  type="text"
                  class="form-control"
                  name="prenom"
                  id="secretaire-prenom"
                  data-cy="prenom"
                  :class="{ valid: !$v.secretaire.prenom.$invalid, invalid: $v.secretaire.prenom.$invalid }"
                  v-model="$v.secretaire.prenom.$model"
                />
              </div>

              <div class="form-group">
                <label class="form-control-label">Login</label>
                <input
                  type="text"
                  class="form-control"
                  name="login"
                  :class="{ valid: !$v.user.login.$invalid, invalid: $v.user.login.$invalid }"
                  v-model="$v.user.login.$model"
                />
              </div>

              <div class="form-group">
                <label class="form-control-label" for="email">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  name="email"
                  :class="{ valid: !$v.user.email.$invalid, invalid: $v.user.email.$invalid }"
                  v-model="$v.user.email.$model"
                />
              </div>

              <div class="form-group">
                <label class="form-control-label" for="secretaire-numEmp">Empployee Number</label>
                <input
                  type="text"
                  class="form-control"
                  name="numEmp"
                  id="secretaire-numEmp"
                  data-cy="numEmp"
                  :class="{ valid: !$v.secretaire.numEmp.$invalid, invalid: $v.secretaire.numEmp.$invalid }"
                  v-model="$v.secretaire.numEmp.$model"
                />
              </div>

              <div class="form-group">
                <label class="form-control-label" for="secretaire-photo">Photo</label>
                <div>
                  <img
                    v-bind:src="'data:' + secretaire.photoContentType + ';base64,' + secretaire.photo"
                    style="max-height: 100px"
                    v-if="secretaire.photo"
                    alt="secretaire image"
                  />
                  <div v-if="secretaire.photo" class="form-text text-danger clearfix">
                    <span class="pull-left">{{ secretaire.photoContentType }}, {{ byteSize(secretaire.photo) }}</span>
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
                    v-on:change="setFileData($event, secretaire, 'photo', true)"
                    accept="image/*"
                  />
                </div>
                <input
                  type="hidden"
                  class="form-control"
                  name="photo"
                  id="secretaire-photo"
                  data-cy="photo"
                  :class="{ valid: !$v.secretaire.photo.$invalid, invalid: $v.secretaire.photo.$invalid }"
                  v-model="$v.secretaire.photo.$model"
                />
                <input
                  type="hidden"
                  class="form-control"
                  name="photoContentType"
                  id="secretaire-photoContentType"
                  v-model="secretaire.photoContentType"
                />
              </div>

              <div class="form-group">
                <label class="form-control-label" for="firstPassword">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="firstPassword"
                  name="password"
                  :class="{ valid: !$v.user.password.$invalid, invalid: $v.user.password.$invalid }"
                  v-model="$v.user.password.$model"
                  data-cy="firstPassword"
                />
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
                :disabled="$v.secretaire.$invalid || isSaving"
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

<script src="./add-secretaires.component.ts"></script>
