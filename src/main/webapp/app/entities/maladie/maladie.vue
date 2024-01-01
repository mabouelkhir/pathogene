<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <div>
        <h2 id="page-heading" data-cy="MaladieHeading">
          <span v-text="$t('pathogeneApp.maladie.home.title')" id="maladie-heading">Diseases</span>
          <div class="d-flex justify-content-between align-items-center">
            <div class="input-group col-4">
              <div class="input-group-prepend">
                <span class="input-group-text"><font-awesome-icon icon="magnifying-glass" /></span>
              </div>
              <input class="form-control" v-model="searchQuery" @input="searchMaladies" type="text" placeholder="Search Keyword" />
            </div>
            <div>
              <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
                <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
                <span v-text="$t('pathogeneApp.maladie.home.refreshListLabel')">Refresh List</span>
              </button>
              <router-link :to="{ name: 'MaladieCreate' }" custom v-slot="{ navigate }" v-if="isAdmin()">
                <button
                  @click="navigate"
                  id="jh-create-entity"
                  data-cy="entityCreateButton"
                  class="btn btn-primary jh-create-entity create-maladie"
                >
                  <font-awesome-icon icon="plus"></font-awesome-icon>
                  <span v-text="$t('pathogeneApp.maladie.home.createLabel')"> Create a new Disease </span>
                </button>
              </router-link>
            </div>
          </div>
        </h2>
        <br />
        <div class="alert alert-warning" v-if="!isFetching && maladies && maladies.length === 0">
          <span v-text="$t('pathogeneApp.maladie.home.notFound')">No Diseases found</span>
        </div>
        <div class="table-responsive" v-if="maladies && maladies.length > 0">
          <table class="table table-striped" aria-describedby="maladies">
            <thead>
              <tr>
                <th scope="row" v-on:click="changeOrder('code')">
                  <span v-text="$t('pathogeneApp.maladie.code')">Code</span>
                  <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'code'"></jhi-sort-indicator>
                </th>
                <th scope="row" v-on:click="changeOrder('nom')">
                  <span v-text="$t('pathogeneApp.maladie.nom')">Name</span>
                  <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'nom'"></jhi-sort-indicator>
                </th>
                <th scope="row"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="maladie in maladies" :key="maladie.id" data-cy="entityTable">
                <td>{{ maladie.code }}</td>
                <td>{{ maladie.nom }}</td>
                <td class="text-right">
                  <div class="btn-group">
                    <router-link :to="{ name: 'MaladieView', params: { maladieId: maladie.id } }" custom v-slot="{ navigate }">
                      <button @click="navigate" class="btn btn-info btn-sm details mr-1" data-cy="entityDetailsButton">
                        <font-awesome-icon icon="eye"></font-awesome-icon>
                        <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                      </button>
                    </router-link>
                    <router-link
                      :to="{ name: 'MaladieEdit', params: { maladieId: maladie.id } }"
                      custom
                      v-slot="{ navigate }"
                      v-if="isAdmin()"
                    >
                      <button @click="navigate" class="btn btn-primary btn-sm edit mr-1" data-cy="entityEditButton">
                        <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                        <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                      </button>
                    </router-link>
                    <b-button
                      v-if="isAdmin()"
                      v-on:click="prepareImportModele(maladie)"
                      variant="warning"
                      class="btn btn-sm mr-1"
                      data-cy="entityImportButton"
                      v-b-modal.importEntity
                    >
                      <font-awesome-icon icon="upload"></font-awesome-icon>
                      <span class="d-none d-md-inline">Import Model</span>
                    </b-button>
                    <b-button
                      v-if="isAdmin()"
                      v-on:click="prepareRemove(maladie)"
                      variant="danger"
                      class="btn btn-sm mr-1"
                      data-cy="entityDeleteButton"
                      v-b-modal.removeEntity
                    >
                      <font-awesome-icon icon="times"></font-awesome-icon>
                      <span class="d-none d-md-inline" v-text="$t('entity.action.delete')">Delete</span>
                    </b-button>
                    <b-button
                      v-if="isAdmin() || isMedecin()"
                      v-on:click="prepareAffecte(maladie)"
                      variant="success"
                      class="btn btn-sm"
                      data-cy="entityAffecteButton"
                      v-b-modal.affecteEntity
                    >
                      <font-awesome-icon icon="plus"></font-awesome-icon>
                      <span class="d-none d-md-inline">Stage</span>
                    </b-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <b-modal ref="removeEntity" id="removeEntity">
          <span slot="modal-title"
            ><span id="pathogeneApp.maladie.delete.question" data-cy="maladieDeleteDialogHeading" v-text="$t('entity.delete.title')"
              >Confirm delete operation</span
            ></span
          >
          <div class="modal-body">
            <p id="jhi-delete-maladie-heading" v-text="$t('pathogeneApp.maladie.delete.question', { id: removeId })">
              Are you sure you want to delete this Maladie?
            </p>
          </div>
          <div slot="modal-footer">
            <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
            <button
              type="button"
              class="btn btn-primary"
              id="jhi-confirm-delete-maladie"
              data-cy="entityConfirmDeleteButton"
              v-text="$t('entity.action.delete')"
              v-on:click="removeMaladie()"
            >
              Delete
            </button>
          </div>
        </b-modal>
        <b-modal ref="affecteEntity" id="affecteEntity">
          <span slot="modal-title"
            ><span id="pathogeneApp.maladie.affecte.question" data-cy="maladieAffecteDialogHeading">Create Disease stage</span></span
          >
          <div class="modal-body">
            <form name="editForm" role="form" novalidate v-on:submit.prevent="saveStade()">
              <div>
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
              </div>
              <div>
                <button
                  type="button"
                  id="cancel-save"
                  data-cy="entityCreateCancelButton"
                  class="btn btn-secondary"
                  v-on:click="closeDialog()"
                >
                  <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span>Cancel</span>
                </button>
                <button type="submit" id="save-entity" data-cy="entityCreateSaveButton" class="btn btn-primary">
                  <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span>Save</span>
                </button>
              </div>
            </form>
          </div>
          <div slot="modal-footer">
            <button type="button" class="btn btn-secondary" v-on:click="closeDialog()">Cancel</button>
          </div>
        </b-modal>
        <b-modal ref="importEntity" id="importEntity" @hidden="resetClassNames">
          <span slot="modal-title">
            <span id="pathogeneApp.maladie.import.title" data-cy="maladieImportDialogHeading">Import Model</span></span
          >
          <div class="modal-body">
            <form name="editForm" role="form" enctype="multipart/form-data" novalidate v-on:submit.prevent="saveModel()">
              <div>
                <div class="form-group">
                  <label class="form-control-label" for="width-image">Image width </label>
                  <input
                    type="number"
                    class="form-control"
                    name="width-image"
                    id="width-image"
                    data-cy="width-image"
                    v-model="imageWidth"
                  />
                </div>
                <div class="form-group">
                  <label class="form-control-label" for="heigth-image">Image heigth </label>
                  <input
                    type="number"
                    class="form-control"
                    name="heigth-image"
                    id="heigth-image"
                    data-cy="heigth-image"
                    v-model="imageHeight"
                  />
                </div>

                <div class="form-group">
                  <label class="form-control-label" for="stade-description">Model File</label>
                  <input
                    type="file"
                    class="form-control"
                    name="import-model"
                    id="stade-description"
                    data-cy="import-model"
                    ref="modelInput"
                  />
                </div>
                <div>
                  <!-- Dynamic class names and numbers input fields -->
                  <div v-for="(className, classNumber) in classNames" :key="classNumber" class="align-items-center">
                    <div class="form-group">
                      <label :for="`class-name-${classNumber}`" class="mr-2">Class Name {{ classNumber }}</label>
                      <div class="input-group mb-2">
                        <input
                          type="text"
                          class="form-control mr-2"
                          :name="`class-name-${classNumber}`"
                          :id="`class-name-${classNumber}`"
                          v-model="classNames[classNumber]"
                        />

                        <!-- Add a button to remove the class -->
                        <b-button
                          v-on:click="removeClassField(classNumber)"
                          variant="danger"
                          class="btn btn-sm"
                          data-cy="entityCancelButton"
                          v-b-modal.importEntity
                        >
                          <font-awesome-icon icon="times"></font-awesome-icon>
                        </b-button>
                      </div>
                    </div>
                  </div>
                  <!-- Add new class button -->
                  <button type="button" @click="addClassField" class="btn btn-primary">Add Class</button>
                </div>
              </div>
              <div class="mt-2">
                <button
                  type="button"
                  id="cancel-save"
                  data-cy="entityCreateCancelButton"
                  class="btn btn-secondary"
                  v-on:click="closeDialog()"
                >
                  <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span>Cancel</span>
                </button>
                <button type="submit" id="save-entity" data-cy="entityCreateSaveButton" class="btn btn-primary">
                  <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </b-modal>

        <div v-show="maladies && maladies.length > 0">
          <div class="row justify-content-center">
            <jhi-item-count :page="page" :total="queryCount" :itemsPerPage="itemsPerPage"></jhi-item-count>
          </div>
          <div class="row justify-content-center">
            <b-pagination
              size="md"
              :total-rows="totalItems"
              v-model="page"
              :per-page="itemsPerPage"
              :change="loadPage(page)"
            ></b-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./maladie.component.ts"></script>
