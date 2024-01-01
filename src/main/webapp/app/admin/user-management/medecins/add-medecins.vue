<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <div class="row justify-content-center">
        <div class="col-8">
          <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
            <h2 id="pathogeneApp.medecin.home.createOrEditLabel" data-cy="MedecinCreateUpdateHeading">Create a Doctor</h2>
            <div>
              <div class="form-group">
                <label class="form-control-label" for="medecin-nom">LastName</label>
                <input
                  type="text"
                  class="form-control"
                  name="nom"
                  id="medecin-nom"
                  data-cy="nom"
                  :class="{ valid: !$v.medecin.nom.$invalid, invalid: $v.medecin.nom.$invalid }"
                  v-model="$v.medecin.nom.$model"
                />
              </div>

              <div class="form-group">
                <label class="form-control-label" for="medecin-prenom">FirstName</label>
                <input
                  type="text"
                  class="form-control"
                  name="prenom"
                  id="medecin-prenom"
                  data-cy="prenom"
                  :class="{ valid: !$v.medecin.prenom.$invalid, invalid: $v.medecin.prenom.$invalid }"
                  v-model="$v.medecin.prenom.$model"
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
                <label class="form-control-label" for="medecin-numEmp">Employee Number</label>
                <input
                  type="text"
                  class="form-control"
                  name="numEmp"
                  id="medecin-numEmp"
                  data-cy="numEmp"
                  :class="{ valid: !$v.medecin.numEmp.$invalid, invalid: $v.medecin.numEmp.$invalid }"
                  v-model="$v.medecin.numEmp.$model"
                />
              </div>

              <div class="form-group">
                <label class="form-control-label" for="medecin-expertLevel">Expert Level</label>
                <input
                  type="number"
                  class="form-control"
                  name="expertLevel"
                  id="medecin-expertLevel"
                  data-cy="expertLevel"
                  :class="{ valid: !$v.medecin.expertLevel.$invalid, invalid: $v.medecin.expertLevel.$invalid }"
                  v-model.number="$v.medecin.expertLevel.$model"
                />
              </div>

              <div class="form-group">
                <label class="form-control-label" for="medecin-photo">Photo</label>
                <div>
                  <img
                    v-bind:src="'data:' + medecin.photoContentType + ';base64,' + medecin.photo"
                    style="max-height: 100px"
                    v-if="medecin.photo"
                    alt="medecin image"
                  />
                  <div v-if="medecin.photo" class="form-text text-danger clearfix">
                    <span class="pull-left">{{ medecin.photoContentType }}, {{ byteSize(medecin.photo) }}</span>
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
                    v-on:change="setFileData($event, medecin, 'photo', true)"
                    accept="image/*"
                  />
                </div>
                <input
                  type="hidden"
                  class="form-control"
                  name="photo"
                  id="medecin-photo"
                  data-cy="photo"
                  :class="{ valid: !$v.medecin.photo.$invalid, invalid: $v.medecin.photo.$invalid }"
                  v-model="$v.medecin.photo.$model"
                />
                <input
                  type="hidden"
                  class="form-control"
                  name="photoContentType"
                  id="medecin-photoContentType"
                  v-model="medecin.photoContentType"
                />
              </div>

              <div class="form-group">
                <label class="form-control-label" for="medecin-type">Type</label>
                <input
                  type="text"
                  class="form-control"
                  name="type"
                  id="medecin-type"
                  data-cy="type"
                  :class="{ valid: !$v.medecin.type.$invalid, invalid: $v.medecin.type.$invalid }"
                  v-model="$v.medecin.type.$model"
                />
              </div>

              <div class="form-group">
                <label class="form-control-label" for="medecin-nbrPatients">NumberOfPatients</label>
                <input
                  type="number"
                  class="form-control"
                  name="nbrPatients"
                  id="medecin-nbrPatients"
                  data-cy="nbrPatients"
                  :class="{ valid: !$v.medecin.nbrPatients.$invalid, invalid: $v.medecin.nbrPatients.$invalid }"
                  v-model.number="$v.medecin.nbrPatients.$model"
                />
              </div>

              <div class="form-group">
                <label class="form-control-label" for="medecin-rating">Rating</label>
                <input
                  type="number"
                  class="form-control"
                  name="rating"
                  id="medecin-rating"
                  data-cy="rating"
                  :class="{ valid: !$v.medecin.rating.$invalid, invalid: $v.medecin.rating.$invalid }"
                  v-model.number="$v.medecin.rating.$model"
                />
              </div>

              <div class="form-group">
                <label class="form-control-label" for="medecin-description">Description</label>
                <input
                  type="text"
                  class="form-control"
                  name="description"
                  id="medecin-description"
                  data-cy="description"
                  :class="{ valid: !$v.medecin.description.$invalid, invalid: $v.medecin.description.$invalid }"
                  v-model="$v.medecin.description.$model"
                />
              </div>

              <div class="form-group">
                <label class="form-control-label" for="medecin-secretaire">Secretary</label>
                <select class="form-control" id="medecin-secretaire" data-cy="secretaire" name="secretaire" v-model="medecin.secretaire">
                  <option v-bind:value="null"></option>
                  <option
                    v-bind:value="
                      medecin.secretaire && secretaireOption.id === medecin.secretaire.id ? medecin.secretaire : secretaireOption
                    "
                    v-for="secretaireOption in secretaires"
                    :key="secretaireOption.id"
                  >
                    {{ secretaireOption.prenom }} {{ secretaireOption.nom }}
                  </option>
                </select>
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
                  :disabled="$v.medecin.$invalid || isSaving"
                  class="btn btn-primary"
                >
                  <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span>Save</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./add-medecins.component.ts"></script>
