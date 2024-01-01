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
                <span v-text="$t('pathogeneApp.patient.adresse')">Address</span>
              </th>
              <th scope="row" v-on:click="changeOrder('telephone')">
                <span v-text="$t('pathogeneApp.patient.telephone')">Phone</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'telephone'"></jhi-sort-indicator>
              </th>
              <th scope="row" v-on:click="changeOrder('photo')">
                <span v-text="$t('pathogeneApp.patient.photo')">Photo</span>
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
                    style="max-height: 70px"
                    alt="patient image"
                  />
                </a>
              </td>
              <td class="text-right">
                <div class="btn-group">
                  <router-link :to="{ name: 'MedecinPatientsDetails', params: { patientId: patient.id } }" custom v-slot="{ navigate }">
                    <button @click="navigate" class="btn btn-info btn-sm details mr-1" data-cy="entityDetailsButton">
                      <font-awesome-icon icon="eye"></font-awesome-icon>
                      <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                    </button>
                  </router-link>
                  <b-button
                    v-on:click="prepareDetection(patient)"
                    variant="success"
                    class="btn btn-sm mr-1"
                    data-cy="entityDetectionButton"
                    v-b-modal.detectionEntity
                  >
                    <font-awesome-icon icon="plus"></font-awesome-icon>
                    <span class="d-none d-md-inline">Detection</span>
                  </b-button>
                  <b-button
                    v-on:click="prepareStade(patient)"
                    variant="dark"
                    class="btn btn-sm"
                    data-cy="entityStadeButton"
                    v-b-modal.stadeEntity
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
            <label class="form-control-label">Visit</label>
            <select class="form-control" id="visite-patient" data-cy="visite" name="patient" v-model="idVisite">
              <option v-for="visite in visites" :key="visite.id" v-bind:value="visite.id">
                {{ visite.date }}
              </option>
            </select>
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

      <b-modal ref="stadeEntity" id="stadeEntity">
        <span slot="modal-title"
          ><span id="pathogeneApp.patient.stade.question" data-cy="patientStadeDialogHeading">Choose the stage</span></span
        >
        <div class="modal-body">
          <table class="table table-striped" aria-describedby="stades">
            <thead>
              <tr>
                <th scope="row"><span>Level</span></th>
                <th scope="row"><span>Disease </span></th>
                <th scope="row"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stade in stades" :key="stade.id" data-cy="entityTable">
                <td>{{ stade.level }}</td>
                <td>
                  <div v-if="stade.maladie">{{ stade.maladie.nom }}</div>
                </td>
                <td class="text-right">
                  <div class="btn-group">
                    <b-button v-on:click="saveStade(stade)" variant="success" class="btn btn-sm" data-cy="entityCreateButton">
                      <span class="d-none d-md-inline">Choose</span>
                    </b-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div slot="modal-footer">
          <button type="button" class="btn btn-secondary" v-on:click="closeDialog()">Cancel</button>
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

<script lang="ts" src="./medecin-patients.component.ts"></script>
