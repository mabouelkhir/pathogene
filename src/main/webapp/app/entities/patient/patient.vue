<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <h2 id="page-heading" data-cy="PatientHeading">
        <span v-text="$t('pathogeneApp.patient.home.title')" id="patient-heading">Patients</span>
        <div class="d-flex justify-content-between align-items-center">
          <div class="input-group col-4">
            <div class="input-group-prepend">
              <span class="input-group-text"><font-awesome-icon icon="magnifying-glass" /></span>
            </div>
            <input
              class="form-control"
              v-model="searchQuery"
              @input="searchPatients"
              type="text"
              placeholder="Rechercher par nom, prénom ou téléphone"
            />
          </div>
          <div>
            <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
              <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
              <span v-text="$t('pathogeneApp.patient.home.refreshListLabel')">Refresh List</span>
            </button>
            <router-link :to="{ name: 'AddPatients' }" custom v-slot="{ navigate }">
              <button
                @click="navigate"
                id="jh-create-entity"
                data-cy="entityCreateButton"
                class="btn btn-primary jh-create-entity create-patient"
              >
                <font-awesome-icon icon="plus"></font-awesome-icon>
                <span v-text="$t('pathogeneApp.patient.home.createLabel')"> New Patient </span>
              </button>
            </router-link>
          </div>
        </div>
      </h2>
      <br />
      <div class="alert alert-warning" v-if="!isFetching && patients && patients.length === 0">
        <span v-text="$t('pathogeneApp.patient.home.notFound')">No patients found</span>
      </div>
      <div class="table-responsive" v-if="patients && patients.length > 0">
        <table class="table table-striped" aria-describedby="patients">
          <thead>
            <tr>
              <th scope="row" v-on:click="changeOrder('nom')">
                <span v-text="$t('pathogeneApp.patient.nom')">LastName</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'nom'"></jhi-sort-indicator>
              </th>
              <th scope="row" v-on:click="changeOrder('prenom')">
                <span v-text="$t('pathogeneApp.patient.prenom')">FirstName</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'prenom'"></jhi-sort-indicator>
              </th>
              <th scope="row" v-on:click="changeOrder('adresse')">
                <span v-text="$t('pathogeneApp.patient.adresse')">Adresse</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'adresse'"></jhi-sort-indicator>
              </th>
              <th scope="row" v-on:click="changeOrder('telephone')">
                <span v-text="$t('pathogeneApp.patient.telephone')">Phone</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'telephone'"></jhi-sort-indicator>
              </th>
              <th scope="row" v-on:click="changeOrder('photo')">
                <span v-text="$t('pathogeneApp.patient.photo')">Photo</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'photo'"></jhi-sort-indicator>
              </th>
              <th scope="row"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="patient in patients" :key="patient.id" data-cy="entityTable">
              <td>{{ patient.nom }}</td>
              <td>{{ patient.prenom }}</td>
              <td>{{ patient.adresse }}</td>
              <td>{{ patient.telephone }}</td>
              <td>
                <a v-if="patient.photo" v-on:click="openFile(patient.photoContentType, patient.photo)">
                  <img
                    v-bind:src="'data:' + patient.photoContentType + ';base64,' + patient.photo"
                    style="width: 90px; max-height: 70px"
                    alt="patient image"
                  />
                </a>
              </td>
              <td class="text-right">
                <div class="btn-group">
                  <router-link :to="{ name: 'PatientView', params: { patientId: patient.id } }" custom v-slot="{ navigate }">
                    <button @click="navigate" class="btn btn-info btn-sm details mr-1" data-cy="entityDetailsButton">
                      <font-awesome-icon icon="eye"></font-awesome-icon>
                      <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                    </button>
                  </router-link>
                  <router-link :to="{ name: 'PatientEdit', params: { patientId: patient.id } }" custom v-slot="{ navigate }">
                    <button @click="navigate" class="btn btn-primary btn-sm edit mr-1" data-cy="entityEditButton">
                      <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                      <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                    </button>
                  </router-link>
                  <b-button
                    v-on:click="prepareRemove(patient)"
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
          ><span id="pathogeneApp.patient.delete.question" data-cy="patientDeleteDialogHeading" v-text="$t('entity.delete.title')"
            >Confirm delete operation</span
          ></span
        >
        <div class="modal-body">
          <p id="jhi-delete-patient-heading" v-text="$t('pathogeneApp.patient.delete.question', { id: removeId })">
            Are you sure you want to delete this Patient?
          </p>
        </div>
        <div slot="modal-footer">
          <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
          <button
            type="button"
            class="btn btn-primary"
            id="jhi-confirm-delete-patient"
            data-cy="entityConfirmDeleteButton"
            v-text="$t('entity.action.delete')"
            v-on:click="removePatient()"
          >
            Delete
          </button>
        </div>
      </b-modal>
      <div v-show="patients && patients.length > 0">
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

<script lang="ts" src="./patient.component.ts"></script>
