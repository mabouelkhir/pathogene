<template>
  <div>
    <h2 id="page-heading" data-cy="UnclassifiedHeading">
      <span v-text="$t('pathogeneApp.unclassified.home.title')" id="unclassified-heading">Unclassifieds</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span v-text="$t('pathogeneApp.unclassified.home.refreshListLabel')">Refresh List</span>
        </button>
        <router-link :to="{ name: 'UnclassifiedCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-unclassified"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span v-text="$t('pathogeneApp.unclassified.home.createLabel')"> Create a new Unclassified </span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && unclassifieds && unclassifieds.length === 0">
      <span v-text="$t('pathogeneApp.unclassified.home.notFound')">No unclassifieds found</span>
    </div>
    <div class="table-responsive" v-if="unclassifieds && unclassifieds.length > 0">
      <table class="table table-striped" aria-describedby="unclassifieds">
        <thead>
          <tr>
            <th scope="row" v-on:click="changeOrder('id')">
              <span v-text="$t('global.field.id')">ID</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'id'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('code')">
              <span v-text="$t('pathogeneApp.unclassified.code')">Code</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'code'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('photo')">
              <span v-text="$t('pathogeneApp.unclassified.photo')">Photo</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'photo'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('maladie.id')">
              <span v-text="$t('pathogeneApp.unclassified.maladie')">Maladie</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'maladie.id'"></jhi-sort-indicator>
            </th>
            <th scope="row"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="unclassified in unclassifieds" :key="unclassified.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'UnclassifiedView', params: { unclassifiedId: unclassified.id } }">{{
                unclassified.id
              }}</router-link>
            </td>
            <td>{{ unclassified.code }}</td>
            <td>
              <a v-if="unclassified.photo" v-on:click="openFile(unclassified.photoContentType, unclassified.photo)">
                <img
                  v-bind:src="'data:' + unclassified.photoContentType + ';base64,' + unclassified.photo"
                  style="max-height: 30px"
                  alt="unclassified image"
                />
              </a>
              <span v-if="unclassified.photo">{{ unclassified.photoContentType }}, {{ byteSize(unclassified.photo) }}</span>
            </td>
            <td>
              <div v-if="unclassified.maladie">
                <router-link :to="{ name: 'MaladieView', params: { maladieId: unclassified.maladie.id } }">{{
                  unclassified.maladie.id
                }}</router-link>
              </div>
            </td>
            <td class="text-right">
              <div class="btn-group">
                <router-link :to="{ name: 'UnclassifiedView', params: { unclassifiedId: unclassified.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'UnclassifiedEdit', params: { unclassifiedId: unclassified.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                  </button>
                </router-link>
                <b-button
                  v-on:click="prepareRemove(unclassified)"
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
        ><span id="pathogeneApp.unclassified.delete.question" data-cy="unclassifiedDeleteDialogHeading" v-text="$t('entity.delete.title')"
          >Confirm delete operation</span
        ></span
      >
      <div class="modal-body">
        <p id="jhi-delete-unclassified-heading" v-text="$t('pathogeneApp.unclassified.delete.question', { id: removeId })">
          Are you sure you want to delete this Unclassified?
        </p>
      </div>
      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          id="jhi-confirm-delete-unclassified"
          data-cy="entityConfirmDeleteButton"
          v-text="$t('entity.action.delete')"
          v-on:click="removeUnclassified()"
        >
          Delete
        </button>
      </div>
    </b-modal>
    <div v-show="unclassifieds && unclassifieds.length > 0">
      <div class="row justify-content-center">
        <jhi-item-count :page="page" :total="queryCount" :itemsPerPage="itemsPerPage"></jhi-item-count>
      </div>
      <div class="row justify-content-center">
        <b-pagination size="md" :total-rows="totalItems" v-model="page" :per-page="itemsPerPage" :change="loadPage(page)"></b-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./unclassified.component.ts"></script>
