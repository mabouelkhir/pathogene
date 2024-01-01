<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <h2 id="page-heading" data-cy="VisiteHeading">
        <span v-text="$t('pathogeneApp.visite.home.title')" id="visite-heading">Visits</span>
        <div class="d-flex justify-content-between align-items-center">
          <div class="input-group col-4">
            <div class="input-group-prepend">
              <span class="input-group-text"><font-awesome-icon icon="magnifying-glass" /></span>
            </div>
            <input class="form-control" v-model="searchQuery" @input="searchVisites" type="text" placeholder="Search Keyword" />
          </div>
          <div>
            <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
              <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
              <span v-text="$t('pathogeneApp.visite.home.refreshListLabel')">Refresh List</span>
            </button>
          </div>
        </div>
      </h2>
      <br />
      <div class="alert alert-warning" v-if="!isFetching && visites && visites.length === 0">
        <span v-text="$t('pathogeneApp.visite.home.notFound')">No visits found</span>
      </div>
      <div class="table-responsive" v-if="visites && visites.length > 0">
        <table class="table table-striped" aria-describedby="visites">
          <thead>
            <tr>
              <th scope="row" v-on:click="changeOrder('date')">
                <span v-text="$t('pathogeneApp.visite.date')">Date</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'date'"></jhi-sort-indicator>
              </th>
              <th scope="row" v-on:click="changeOrder('rendezVous.id')">
                <span v-text="$t('pathogeneApp.visite.rendezVous')">Appointment </span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'rendezVous.id'"></jhi-sort-indicator>
              </th>
              <th scope="row" v-if="!isPatient()"><span>Patient</span></th>
              <th scope="row" v-if="!isMedecin()"><span>Doctor </span></th>
              <th scope="row"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="visite in visites" :key="visite.id" data-cy="entityTable">
              <td>{{ visite.date ? visite.date : '' }}</td>
              <td>
                <div v-if="visite.rendezVous">
                  <router-link :to="{ name: 'RendezVousView', params: { rendezVousId: visite.rendezVous.id } }">{{
                    visite.rendezVous.code
                  }}</router-link>
                </div>
              </td>
              <td v-if="!isPatient()">{{ visite.rendezVous.patient?.nom }} {{ visite.rendezVous.patient?.prenom }}</td>
              <td v-if="!isMedecin()">{{ visite.rendezVous.medecin?.nom }} {{ visite.rendezVous.medecin?.prenom }}</td>
              <td class="text-right">
                <div class="btn-group">
                  <router-link :to="{ name: 'VisiteView', params: { visiteId: visite.id } }" custom v-slot="{ navigate }">
                    <button @click="navigate" class="btn btn-info btn-sm details mr-1" data-cy="entityDetailsButton">
                      <font-awesome-icon icon="eye"></font-awesome-icon>
                      <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                    </button>
                  </router-link>
                  <b-button
                    v-on:click="prepareRemove(visite)"
                    variant="danger"
                    class="btn btn-sm"
                    data-cy="entityDeleteButton"
                    v-b-modal.removeEntity
                    v-if="isSecretaire()"
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
          ><span id="pathogeneApp.visite.delete.question" data-cy="visiteDeleteDialogHeading" v-text="$t('entity.delete.title')"
            >Confirm delete operation</span
          ></span
        >
        <div class="modal-body">
          <p id="jhi-delete-visite-heading" v-text="$t('pathogeneApp.visite.delete.question', { id: removeId })">
            Are you sure you want to delete this Visit?
          </p>
        </div>
        <div slot="modal-footer">
          <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
          <button
            type="button"
            class="btn btn-primary"
            id="jhi-confirm-delete-visite"
            data-cy="entityConfirmDeleteButton"
            v-text="$t('entity.action.delete')"
            v-on:click="removeVisite()"
          >
            Delete
          </button>
        </div>
      </b-modal>
      <div v-show="visites && visites.length > 0">
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

<script lang="ts" src="./visite.component.ts"></script>
