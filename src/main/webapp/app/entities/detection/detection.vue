<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <div>
        <h2 id="page-heading" data-cy="DetectionHeading">
          <span v-text="$t('pathogeneApp.detection.home.title')" id="detection-heading">Detections</span>
          <div class="d-flex justify-content-between align-items-center">
            <div class="input-group col-4">
              <div class="input-group-prepend">
                <span class="input-group-text"><font-awesome-icon icon="magnifying-glass" /></span>
              </div>
              <input class="form-control" v-model="searchQuery" @input="searchDetections" type="text" placeholder="Search Keyword" />
            </div>
            <div>
              <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
                <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
                <span v-text="$t('pathogeneApp.detection.home.refreshListLabel')">Refresh List</span>
              </button>
            </div>
          </div>
        </h2>
        <br />
        <div class="alert alert-warning" v-if="!isFetching && detections && detections.length === 0">
          <span v-text="$t('pathogeneApp.detection.home.notFound')">No detections found</span>
        </div>
        <div class="table-responsive" v-if="detections && detections.length > 0">
          <table class="table table-striped" aria-describedby="detections">
            <thead>
              <tr>
                <th scope="row">
                  <span v-text="$t('pathogeneApp.detection.photo')">Photo</span>
                </th>
                <th scope="row" v-on:click="changeOrder('validation')">
                  <span v-text="$t('pathogeneApp.detection.validation')">Validation</span>
                  <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'validation'"></jhi-sort-indicator>
                </th>
                <th scope="row" v-on:click="changeOrder('stade')">
                  <span v-text="$t('pathogeneApp.detection.stade')">Stage</span>
                  <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'stade'"></jhi-sort-indicator>
                </th>
                <th scope="row">
                  <span v-text="$t('pathogeneApp.detection.description')">Description</span>
                </th>
                <th scope="row">
                  <span v-text="$t('pathogeneApp.detection.date')">Date</span>
                </th>
                <th scope="row" v-on:click="changeOrder('maladie.id')">
                  <span v-text="$t('pathogeneApp.detection.maladie')">Disease </span>
                  <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'maladie.id'"></jhi-sort-indicator>
                </th>
                <th scope="row" v-if="isMedecin()" v-on:click="changeOrder('patient.id')">
                  <span v-text="$t('pathogeneApp.detection.patient')">Patient</span>
                  <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'patient.id'"></jhi-sort-indicator>
                </th>
                <th scope="row"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="detection in detections" :key="detection.id" data-cy="entityTable">
                <td>
                  <a v-if="detection.photo" v-on:click="openFile(detection.photoContentType, detection.photo)">
                    <img
                      v-bind:src="'data:' + detection.photoContentType + ';base64,' + detection.photo"
                      style="width: 70px; max-height: 70px"
                      alt="detection image"
                    />
                  </a>
                </td>
                <td>{{ detection.validation }}</td>
                <td>{{ detection.stade }}</td>
                <td>{{ detection.description }}</td>
                <td>{{ detection.date | formatDate }}</td>
                <td>
                  <div v-if="detection.maladie">
                    {{ detection.maladie.nom }}
                  </div>
                </td>
                <td v-if="isMedecin()">
                  <div v-if="detection.patient">{{ detection.patient.nom }} {{ detection.patient.prenom }}</div>
                </td>
                <td class="text-right">
                  <div class="btn-group">
                    <router-link :to="{ name: 'DetectionView', params: { detectionId: detection.id } }" custom v-slot="{ navigate }">
                      <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                        <font-awesome-icon icon="eye"></font-awesome-icon>
                        <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                      </button>
                    </router-link>
                    <router-link
                      :to="{ name: 'DetectionEdit', params: { detectionId: detection.id } }"
                      custom
                      v-slot="{ navigate }"
                      v-if="isMedecin()"
                    >
                      <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                        <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                        <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                      </button>
                    </router-link>
                    <!--
                    <b-button
                      v-on:click="prepareRemove(detection)"
                      variant="danger"
                      class="btn btn-sm"
                      data-cy="entityDeleteButton"
                      v-b-modal.removeEntity
                      v-if="isMedecin()"
                    >
                      <font-awesome-icon icon="times"></font-awesome-icon>
                      <span class="d-none d-md-inline" v-text="$t('entity.action.delete')">Delete</span>
                    </b-button>
                    -->
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <b-modal ref="removeEntity" id="removeEntity">
          <span slot="modal-title"
            ><span id="pathogeneApp.detection.delete.question" data-cy="detectionDeleteDialogHeading" v-text="$t('entity.delete.title')"
              >Confirm delete operation</span
            ></span
          >
          <div class="modal-body">
            <p id="jhi-delete-detection-heading" v-text="$t('pathogeneApp.detection.delete.question', { id: removeId })">
              Are you sure you want to delete this Detection?
            </p>
          </div>
          <div slot="modal-footer">
            <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
            <button
              type="button"
              class="btn btn-primary"
              id="jhi-confirm-delete-detection"
              data-cy="entityConfirmDeleteButton"
              v-text="$t('entity.action.delete')"
              v-on:click="removeDetection()"
            >
              Delete
            </button>
          </div>
        </b-modal>
        <div v-show="detections && detections.length > 0">
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

<script lang="ts" src="./detection.component.ts"></script>
