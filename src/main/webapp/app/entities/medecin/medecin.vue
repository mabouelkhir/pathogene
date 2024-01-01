<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <div>
        <h2 id="page-heading" data-cy="MedecinHeading">
          <span v-text="$t('pathogeneApp.medecin.home.title')" id="medecin-heading">Doctors</span>
          <div class="d-flex justify-content-between align-items-center">
            <div class="input-group col-4">
              <div class="input-group-prepend">
                <span class="input-group-text"><font-awesome-icon icon="magnifying-glass" /></span>
              </div>
              <input
                class="form-control"
                v-model="searchQuery"
                @input="searchMedecins"
                type="text"
                placeholder="Search by lastName, firstName or type"
              />
            </div>
            <div>
              <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
                <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
                <span v-text="$t('pathogeneApp.medecin.home.refreshListLabel')">Refresh List</span>
              </button>
              <router-link :to="{ name: 'AddMedecins' }" custom v-slot="{ navigate }">
                <button
                  @click="navigate"
                  id="jh-create-entity"
                  data-cy="entityCreateButton"
                  class="btn btn-primary jh-create-entity create-medecin"
                >
                  <font-awesome-icon icon="plus"></font-awesome-icon>
                  <span v-text="$t('pathogeneApp.medecin.home.createLabel')"> New Doctor </span>
                </button>
              </router-link>
            </div>
          </div>
        </h2>
        <br />
        <div class="alert alert-warning" v-if="!isFetching && medecins && medecins.length === 0">
          <span v-text="$t('pathogeneApp.medecin.home.notFound')">No Doctors found</span>
        </div>
        <div class="table-responsive" v-if="medecins && medecins.length > 0">
          <table class="table table-striped" aria-describedby="medecins">
            <thead>
              <tr>
                <th scope="row" v-on:click="changeOrder('nom')">
                  <span v-text="$t('pathogeneApp.medecin.nom')">Last Name</span>
                  <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'nom'"></jhi-sort-indicator>
                </th>
                <th scope="row" v-on:click="changeOrder('prenom')">
                  <span v-text="$t('pathogeneApp.medecin.prenom')">First Name</span>
                  <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'prenom'"></jhi-sort-indicator>
                </th>
                <th scope="row" v-on:click="changeOrder('photo')">
                  <span v-text="$t('pathogeneApp.medecin.photo')">Photo</span>
                  <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'photo'"></jhi-sort-indicator>
                </th>
                <th scope="row" v-on:click="changeOrder('type')">
                  <span v-text="$t('pathogeneApp.medecin.type')">Type</span>
                  <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'type'"></jhi-sort-indicator>
                </th>
                <th scope="row" v-on:click="changeOrder('description')">
                  <span v-text="$t('pathogeneApp.medecin.description')">Description</span>
                  <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'description'"></jhi-sort-indicator>
                </th>
                <th scope="row"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="medecin in medecins" :key="medecin.id" data-cy="entityTable">
                <td>{{ medecin.nom }}</td>
                <td>{{ medecin.prenom }}</td>
                <td>
                  <a v-if="medecin.photo" v-on:click="openFile(medecin.photoContentType, medecin.photo)">
                    <img
                      v-bind:src="'data:' + medecin.photoContentType + ';base64,' + medecin.photo"
                      style="width: 90px; max-height: 70px"
                      alt="medecin image"
                    />
                  </a>
                </td>
                <td>{{ medecin.type }}</td>
                <td>{{ medecin.description }}</td>
                <td class="text-right">
                  <div class="btn-group">
                    <router-link :to="{ name: 'MedecinView', params: { medecinId: medecin.id } }" custom v-slot="{ navigate }">
                      <button @click="navigate" class="btn btn-info btn-sm details mr-1" data-cy="entityDetailsButton">
                        <font-awesome-icon icon="eye"></font-awesome-icon>
                        <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                      </button>
                    </router-link>
                    <router-link :to="{ name: 'MedecinEdit', params: { medecinId: medecin.id } }" custom v-slot="{ navigate }">
                      <button @click="navigate" class="btn btn-primary btn-sm edit mr-1" data-cy="entityEditButton">
                        <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                        <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                      </button>
                    </router-link>
                    <b-button
                      v-on:click="prepareRemove(medecin)"
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
            ><span id="pathogeneApp.medecin.delete.question" data-cy="medecinDeleteDialogHeading" v-text="$t('entity.delete.title')"
              >Confirm delete operation</span
            ></span
          >
          <div class="modal-body">
            <p id="jhi-delete-medecin-heading" v-text="$t('pathogeneApp.medecin.delete.question', { id: removeId })">
              Are you sure you want to delete this Doctor?
            </p>
          </div>
          <div slot="modal-footer">
            <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
            <button
              type="button"
              class="btn btn-primary"
              id="jhi-confirm-delete-medecin"
              data-cy="entityConfirmDeleteButton"
              v-text="$t('entity.action.delete')"
              v-on:click="removeMedecin()"
            >
              Delete
            </button>
          </div>
        </b-modal>
        <div v-show="medecins && medecins.length > 0">
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

<script lang="ts" src="./medecin.component.ts"></script>
