<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <div>
        <h2 id="page-heading" data-cy="ImageHeading">
          <span v-text="$t('pathogeneApp.image.home.title')" id="image-heading">Images</span>
          <div class="d-flex justify-content-end">
            <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
              <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
              <span v-text="$t('pathogeneApp.image.home.refreshListLabel')">Refresh List</span>
            </button>
            <router-link :to="{ name: 'ImageCreate' }" custom v-slot="{ navigate }">
              <button
                @click="navigate"
                id="jh-create-entity"
                data-cy="entityCreateButton"
                class="btn btn-primary jh-create-entity create-image"
              >
                <font-awesome-icon icon="plus"></font-awesome-icon>
                <span v-text="$t('pathogeneApp.image.home.createLabel')"> Create a new Image </span>
              </button>
            </router-link>
          </div>
        </h2>
        <br />
        <div class="alert alert-warning" v-if="!isFetching && images && images.length === 0">
          <span v-text="$t('pathogeneApp.image.home.notFound')">No images found</span>
        </div>
        <div class="table-responsive" v-if="images && images.length > 0">
          <table class="table table-striped" aria-describedby="images">
            <thead>
              <tr>
                <th scope="row" v-on:click="changeOrder('code')">
                  <span v-text="$t('pathogeneApp.image.code')">Code</span>
                  <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'code'"></jhi-sort-indicator>
                </th>
                <th scope="row" v-on:click="changeOrder('photo')">
                  <span v-text="$t('pathogeneApp.image.photo')">Photo</span>
                  <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'photo'"></jhi-sort-indicator>
                </th>
                <th scope="row" v-on:click="changeOrder('stade.id')">
                  <span v-text="$t('pathogeneApp.image.stade')">Stage</span>
                  <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'stade.id'"></jhi-sort-indicator>
                </th>
                <th scope="row"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="image in images" :key="image.id" data-cy="entityTable">
                <td>{{ image.code }}</td>
                <td>
                  <a v-if="image.photo" v-on:click="openFile(image.photoContentType, image.photo)">
                    <img
                      v-bind:src="'data:' + image.photoContentType + ';base64,' + image.photo"
                      style="width: 50px; max-height: 30px"
                      alt="image image"
                    />
                  </a>
                </td>
                <td>
                  <div v-if="image.stade">
                    <router-link :to="{ name: 'StadeView', params: { stadeId: image.stade.id } }">{{ image.stade.code }}</router-link>
                  </div>
                </td>
                <td class="text-right">
                  <div class="btn-group">
                    <router-link :to="{ name: 'ImageView', params: { imageId: image.id } }" custom v-slot="{ navigate }">
                      <button @click="navigate" class="btn btn-info btn-sm details mr-1" data-cy="entityDetailsButton">
                        <font-awesome-icon icon="eye"></font-awesome-icon>
                        <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                      </button>
                    </router-link>
                    <router-link :to="{ name: 'ImageEdit', params: { imageId: image.id } }" custom v-slot="{ navigate }">
                      <button @click="navigate" class="btn btn-primary btn-sm edit mr-1" data-cy="entityEditButton">
                        <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                        <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                      </button>
                    </router-link>
                    <b-button
                      v-on:click="prepareRemove(image)"
                      variant="danger"
                      class="btn btn-sm"
                      data-cy="entityDeleteButton"
                      v-b-modal.removeEntity
                    >
                      <font-awesome-icon icon="times"></font-awesome-icon>
                      <span class="d-none d-md-inline" v-text="$t('entity.action.delete')">Delete</span>
                    </b-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <b-modal ref="removeEntity" id="removeEntity">
          <span slot="modal-title"
            ><span id="pathogeneApp.image.delete.question" data-cy="imageDeleteDialogHeading" v-text="$t('entity.delete.title')"
              >Confirm delete operation</span
            ></span
          >
          <div class="modal-body">
            <p id="jhi-delete-image-heading" v-text="$t('pathogeneApp.image.delete.question', { id: removeId })">
              Are you sure you want to delete this Image?
            </p>
          </div>
          <div slot="modal-footer">
            <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
            <button
              type="button"
              class="btn btn-primary"
              id="jhi-confirm-delete-image"
              data-cy="entityConfirmDeleteButton"
              v-text="$t('entity.action.delete')"
              v-on:click="removeImage()"
            >
              Delete
            </button>
          </div>
        </b-modal>
        <div v-show="images && images.length > 0">
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

<script lang="ts" src="./image.component.ts"></script>
