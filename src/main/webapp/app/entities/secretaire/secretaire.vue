<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <h2 id="page-heading" data-cy="SecretaireHeading">
        <span v-text="$t('pathogeneApp.secretaire.home.title')" id="secretaire-heading">Secretaries</span>
        <div class="d-flex justify-content-between align-items-center">
          <div class="input-group col-4">
            <div class="input-group-prepend">
              <span class="input-group-text"><font-awesome-icon icon="magnifying-glass" /></span>
            </div>
            <input
              class="form-control"
              v-model="searchQuery"
              @input="searchSecretaires"
              type="text"
              placeholder="Search by lastName, firstName or numEmp"
            />
          </div>
          <div>
            <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
              <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
              <span v-text="$t('pathogeneApp.secretaire.home.refreshListLabel')">Refresh List</span>
            </button>
            <router-link :to="{ name: 'AddSecretaires' }" custom v-slot="{ navigate }">
              <button
                @click="navigate"
                id="jh-create-entity"
                data-cy="entityCreateButton"
                class="btn btn-primary jh-create-entity create-secretaire"
              >
                <font-awesome-icon icon="plus"></font-awesome-icon>
                <span v-text="$t('pathogeneApp.secretaire.home.createLabel')"> New Secretary </span>
              </button>
            </router-link>
          </div>
        </div>
      </h2>
      <br />
      <div class="alert alert-warning" v-if="!isFetching && secretaires && secretaires.length === 0">
        <span v-text="$t('pathogeneApp.secretaire.home.notFound')">No secretaries found</span>
      </div>
      <div class="table-responsive" v-if="secretaires && secretaires.length > 0">
        <table class="table table-striped" aria-describedby="secretaires">
          <thead>
            <tr>
              <th scope="row" v-on:click="changeOrder('nom')">
                <span v-text="$t('pathogeneApp.secretaire.nom')">LastName</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'nom'"></jhi-sort-indicator>
              </th>
              <th scope="row" v-on:click="changeOrder('numEmp')">
                <span v-text="$t('pathogeneApp.secretaire.numEmp')">Employee Number </span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'numEmp'"></jhi-sort-indicator>
              </th>
              <th scope="row" v-on:click="changeOrder('prenom')">
                <span v-text="$t('pathogeneApp.secretaire.prenom')">FirstName</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'prenom'"></jhi-sort-indicator>
              </th>
              <th scope="row" v-on:click="changeOrder('photo')">
                <span v-text="$t('pathogeneApp.secretaire.photo')">Photo</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'photo'"></jhi-sort-indicator>
              </th>
              <th scope="row"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="secretaire in secretaires" :key="secretaire.id" data-cy="entityTable">
              <td>{{ secretaire.nom }}</td>
              <td>{{ secretaire.numEmp }}</td>
              <td>{{ secretaire.prenom }}</td>
              <td>
                <a v-if="secretaire.photo" v-on:click="openFile(secretaire.photoContentType, secretaire.photo)">
                  <img
                    v-bind:src="'data:' + secretaire.photoContentType + ';base64,' + secretaire.photo"
                    style="width: 90px; max-height: 70px"
                    alt="secretaire image"
                  />
                </a>
              </td>
              <td class="text-right">
                <div class="btn-group">
                  <router-link :to="{ name: 'SecretaireView', params: { secretaireId: secretaire.id } }" custom v-slot="{ navigate }">
                    <button @click="navigate" class="btn btn-info btn-sm details mr-1" data-cy="entityDetailsButton">
                      <font-awesome-icon icon="eye"></font-awesome-icon>
                      <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                    </button>
                  </router-link>
                  <router-link :to="{ name: 'SecretaireEdit', params: { secretaireId: secretaire.id } }" custom v-slot="{ navigate }">
                    <button @click="navigate" class="btn btn-primary btn-sm edit mr-1" data-cy="entityEditButton">
                      <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                      <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                    </button>
                  </router-link>
                  <b-button
                    v-on:click="prepareRemove(secretaire)"
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
          ><span id="pathogeneApp.secretaire.delete.question" data-cy="secretaireDeleteDialogHeading" v-text="$t('entity.delete.title')"
            >Confirm delete operation</span
          ></span
        >
        <div class="modal-body">
          <p id="jhi-delete-secretaire-heading" v-text="$t('pathogeneApp.secretaire.delete.question', { id: removeId })">
            Are you sure you want to delete this Secretary?
          </p>
        </div>
        <div slot="modal-footer">
          <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
          <button
            type="button"
            class="btn btn-primary"
            id="jhi-confirm-delete-secretaire"
            data-cy="entityConfirmDeleteButton"
            v-text="$t('entity.action.delete')"
            v-on:click="removeSecretaire()"
          >
            Delete
          </button>
        </div>
      </b-modal>
      <div v-show="secretaires && secretaires.length > 0">
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

<script lang="ts" src="./secretaire.component.ts"></script>
