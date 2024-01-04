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
                  {{ visite.rendezVous.code }}
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
                    v-on:click="prepareDetection(visite)"
                    variant="success"
                    class="btn btn-sm mr-1"
                    data-cy="entityDetectionButton"
                    v-b-modal.detectionEntity
                    v-if="isMedecin()"
                  >
                    <font-awesome-icon icon="plus"></font-awesome-icon>
                    <span class="d-none d-md-inline">Detection</span>
                  </b-button>
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
      <b-modal ref="detectionEntity" id="detectionEntity">
        <span slot="modal-title"
        ><span id="pathogeneApp.patient.detection.question" data-cy="patientDetectionDialogHeading">Create detection</span></span
        >
        <div class="modal-body">
          <div class="form-group">
            <label class="form-control-label" for="detection-photo">Photo</label>
            <div>
              <img
                v-bind:src="'data:' + detection.photoContentType + ';base64,' + detection.photo"
                style="max-height: 100px"
                v-if="detection.photo"
                alt="detection image"
              />
              <div v-if="detection.photo" class="form-text text-danger clearfix">
                <span class="pull-left">{{ detection.photoContentType }}, {{ byteSize(detection.photo) }}</span>
                <button
                  type="button"
                  v-on:click="clearInputImage(detection, 'file_photo', 'photo', 'photoContentType', 'file_photo')"
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
                v-on:change="setFileData($event, detection, 'photo', true)"
                accept="image/*"
              />
            </div>
            <input
              type="hidden"
              class="form-control"
              name="photo"
              id="detection-photo"
              data-cy="photo"
              :class="{ valid: !$v.detection.photo.$invalid, invalid: $v.detection.photo.$invalid }"
              v-model="$v.detection.photo.$model"
            />
            <input
              type="hidden"
              class="form-control"
              name="photoContentType"
              id="detection-photoContentType"
              v-model="detection.photoContentType"
            />
          </div>

          <div class="form-group">
            <label class="form-control-label" for="detection-validation">Validation</label>
            <input
              type="checkbox"
              class="form-check"
              name="validation"
              id="detection-validation"
              data-cy="validation"
              :class="{ valid: !$v.detection.validation.$invalid, invalid: $v.detection.validation.$invalid }"
              v-model="$v.detection.validation.$model"
            />
          </div>

          <div class="form-group">
            <label class="form-control-label">Disease</label>
            <select class="form-control" id="maladie-patient" data-cy="maladie" name="maladie" v-model="idMaladie">
              <option v-for="maladie in maladies" :key="maladie.id" v-bind:value="maladie.id">
                {{ maladie.nom }}
              </option>
            </select>
          </div>
        </div>
        <div slot="modal-footer">
          <button type="button" class="btn btn-secondary" v-on:click="closeDialog()">Cancel</button>
          <button type="submit" id="save-entity" data-cy="entityCreateSaveButton" class="btn btn-primary" v-on:click="saveDetection()">
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span>Save</span>
          </button>
        </div>
      </b-modal>
      <b-modal ref="afficheEntity" id="afficheEntity">
        <span slot="modal-title"
        ><span id="pathogeneApp.detection.affiche.question" data-cy="detectionAfficheDialogHeading">Result AI</span></span
        >
        <div class="modal-body">
          <dl class="row jh-entity-details">
            <dt>
              <span>Photo</span>
            </dt>
            <dd>
              <div v-if="detection.photo">
                <a v-on:click="openFile(detection.photoContentType, detection.photo)">
                  <img
                    v-bind:src="'data:' + detection.photoContentType + ';base64,' + detection.photo"
                    style="width: 90px; max-height: 70px"
                    alt="patient image"
                  />
                </a>
              </div>
            </dd>
            <dt>
              <span>Description</span>
            </dt>
            <dd>
              <span>{{ detection.description }}</span>
            </dd>
            <dt>
              <span>Stage</span>
            </dt>
            <dd>
              <span>{{ detection.stade }}</span>
            </dd>
          </dl>
        </div>
        <div slot="modal-footer">
          <button type="button" class="btn btn-secondary" v-on:click="closeDialog()">Leave</button>
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
