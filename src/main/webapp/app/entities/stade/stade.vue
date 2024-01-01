<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <h2 id="page-heading" data-cy="StadeHeading">
        <span v-text="$t('pathogeneApp.stade.home.title')" id="stade-heading">Stages</span>
        <div class="d-flex justify-content-end">
          <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
            <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
            <span v-text="$t('pathogeneApp.stade.home.refreshListLabel')">Refresh List</span>
          </button>
        </div>
      </h2>
      <br />
      <div class="alert alert-warning" v-if="!isFetching && stades && stades.length === 0">
        <span v-text="$t('pathogeneApp.stade.home.notFound')">No stages found</span>
      </div>
      <div class="table-responsive" v-if="stades && stades.length > 0">
        <table class="table table-striped" aria-describedby="stades">
          <thead>
            <tr>
              <th scope="row" v-on:click="changeOrder('level')">
                <span v-text="$t('pathogeneApp.stade.level')">Level</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'level'"></jhi-sort-indicator>
              </th>
              <th scope="row" v-on:click="changeOrder('description')">
                <span v-text="$t('pathogeneApp.stade.description')">Description</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'description'"></jhi-sort-indicator>
              </th>
              <th scope="row" v-on:click="changeOrder('maladie.id')">
                <span v-text="$t('pathogeneApp.stade.maladie')">Disease</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'maladie.id'"></jhi-sort-indicator>
              </th>
              <th scope="row"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stade in stades" :key="stade.id" data-cy="entityTable">
              <td>{{ stade.level }}</td>
              <td>{{ stade.description }}</td>
              <td>
                <div v-if="stade.maladie">
                  <router-link :to="{ name: 'MaladieView', params: { maladieId: stade.maladie.id } }">{{ stade.maladie.nom }}</router-link>
                </div>
              </td>
              <td class="text-right">
                <div class="btn-group">
                  <router-link :to="{ name: 'StadeView', params: { stadeId: stade.id } }" custom v-slot="{ navigate }">
                    <button @click="navigate" class="btn btn-info btn-sm details mr-1" data-cy="entityDetailsButton">
                      <font-awesome-icon icon="eye"></font-awesome-icon>
                      <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                    </button>
                  </router-link>
                  <router-link :to="{ name: 'StadeEdit', params: { stadeId: stade.id } }" custom v-slot="{ navigate }">
                    <button @click="navigate" class="btn btn-primary btn-sm edit mr-1" data-cy="entityEditButton">
                      <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                      <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                    </button>
                  </router-link>
                  <b-button
                    v-on:click="prepareRemove(stade)"
                    variant="danger"
                    class="btn btn-sm"
                    data-cy="entityDeleteButton"
                    v-b-modal.removeEntity
                  >
                    <font-awesome-icon icon="times"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="$t('entity.action.delete')">Delete</span>
                  </b-button>
                  <b-button
                    v-on:click="prepareCeate(stade)"
                    variant="success"
                    class="btn btn-sm"
                    data-cy="entityCreateButton"
                    v-b-modal.createEntity
                  >
                    <font-awesome-icon icon="plus"></font-awesome-icon>
                    <span class="d-none d-md-inline">Image</span>
                  </b-button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <b-modal ref="removeEntity" id="removeEntity">
        <span slot="modal-title"
          ><span id="pathogeneApp.stade.delete.question" data-cy="stadeDeleteDialogHeading" v-text="$t('entity.delete.title')"
            >Confirm delete operation</span
          ></span
        >
        <div class="modal-body">
          <p id="jhi-delete-stade-heading" v-text="$t('pathogeneApp.stade.delete.question', { id: removeId })">
            Are you sure you want to delete this Stage?
          </p>
        </div>
        <div slot="modal-footer">
          <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
          <button
            type="button"
            class="btn btn-primary"
            id="jhi-confirm-delete-stade"
            data-cy="entityConfirmDeleteButton"
            v-text="$t('entity.action.delete')"
            v-on:click="removeStade()"
          >
            Delete
          </button>
        </div>
      </b-modal>

      <b-modal ref="createEntity" id="affecteEntity">
        <span slot="modal-title"
          ><span id="pathogeneApp.maladie.affecte.question" data-cy="maladieAffecteDialogHeading">Create an image</span></span
        >
        <div class="modal-body">
          <div>
            <div class="form-group">
              <label class="form-control-label" for="image-photo">Photo</label>
              <div>
                <img
                  v-bind:src="'data:' + image.photoContentType + ';base64,' + image.photo"
                  style="max-height: 100px"
                  v-if="image.photo"
                  alt="image image"
                />
                <div v-if="image.photo" class="form-text text-danger clearfix">
                  <span class="pull-left">{{ image.photoContentType }}, {{ byteSize(image.photo) }}</span>
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
                  v-on:change="setFileData($event, image, 'photo', true)"
                  accept="image/*"
                />
              </div>
              <input
                type="hidden"
                class="form-control"
                name="photo"
                id="image-photo"
                data-cy="photo"
                :class="{ valid: !$v.image.photo.$invalid, invalid: $v.image.photo.$invalid }"
                v-model="$v.image.photo.$model"
              />
              <input
                type="hidden"
                class="form-control"
                name="photoContentType"
                id="image-photoContentType"
                v-model="image.photoContentType"
              />
            </div>
          </div>
        </div>
        <div slot="modal-footer">
          <button type="button" class="btn btn-secondary" v-on:click="closeDialog()">Cancel</button>
          <button type="submit" id="save-entity" data-cy="entityCreateSaveButton" class="btn btn-primary" v-on:click="saveImage()">
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span>Save</span>
          </button>
        </div>
      </b-modal>

      <div v-show="stades && stades.length > 0">
        <div class="row justify-content-center">
          <jhi-item-count :page="page" :total="queryCount" :itemsPerPage="itemsPerPage"></jhi-item-count>
        </div>
        <div class="row justify-content-center">
          <b-pagination size="md" :total-rows="totalItems" v-model="page" :per-page="itemsPerPage" :change="loadPage(page)"></b-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./stade.component.ts"></script>
