<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <div class="row justify-content-center">
        <div class="col-8">
          <div v-if="patient">
            <h2 class="jh-entity-heading" data-cy="patientDetailsHeading"><span>Patient</span> {{ patient.id }}</h2>
            <dl class="row jh-entity-details">
              <dt>
                <span>Photo</span>
              </dt>
              <dd>
                <div v-if="patient.photo">
                  <a v-on:click="openFile(patient.photoContentType, patient.photo)">
                    <img
                      v-bind:src="'data:' + patient.photoContentType + ';base64,' + patient.photo"
                      style="max-width: 50%"
                      alt="patient image"
                    />
                  </a>
                </div>
              </dd>
              <dt>
                <span>Code</span>
              </dt>
              <dd>
                <span>{{ patient.code }}</span>
              </dd>
              <dt>
                <span>LastName</span>
              </dt>
              <dd>
                <span>{{ patient.nom }}</span>
              </dd>
              <dt>
                <span>FirstName</span>
              </dt>
              <dd>
                <span>{{ patient.prenom }}</span>
              </dd>
              <dt>
                <span>DateOfBirth </span>
              </dt>
              <dd>
                <span>{{ patient.dateNaissance }}</span>
              </dd>
              <dt>
                <span>Address</span>
              </dt>
              <dd>
                <span>{{ patient.adresse }}</span>
              </dd>
              <dt>
                <span>Gender</span>
              </dt>
              <dd>
                <span>{{ patient.genre }}</span>
              </dd>
              <dt>
                <span>Phone</span>
              </dt>
              <dd>
                <span>{{ patient.telephone }}</span>
              </dd>
              <dt>
                <span>Weight</span>
              </dt>
              <dd>
                <span>{{ patient.poids }}</span>
              </dd>
              <dt>
                <span>Height</span>
              </dt>
              <dd>
                <span>{{ patient.taille }}</span>
              </dd>

              <dt>
                <span>Stage</span>
              </dt>
              <dd>
                <div v-if="patient.stade">
                  <router-link :to="{ name: 'StadeView', params: { stadeId: patient.stade.id } }">
                    {{ patient.stade.level }}
                  </router-link>
                </div>
              </dd>
            </dl>
            <br />
            <div>
              <div>
                <h2 id="page-heading" data-cy="DetectionHeading">
                  <span id="detection-heading">Detections</span>
                </h2>
                <div class="d-flex justify-content-end">
                  <div class="input-group col-4">
                    <div class="input-group-prepend">
                      <span class="input-group-text"><font-awesome-icon icon="magnifying-glass" /></span>
                    </div>
                    <input class="form-control" v-model="searchQuery" @input="searchDetections" type="text" placeholder="Search Keywords" />
                  </div>
                </div>
              </div>
              <div class="table-responsive" v-if="detections && detections.length > 0">
                <table class="table table-striped" aria-describedby="detections">
                  <thead>
                    <tr>
                      <th scope="row"><span>Photo</span></th>
                      <th scope="row"><span>Validation</span></th>
                      <th scope="row"><span>Stage</span></th>
                      <th scope="row"><span>Description</span></th>
                      <th scope="row"><span>Disease</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="detection in detections" :key="detection.id" data-cy="entityTable">
                      <td>
                        <a v-if="detection.photo" v-on:click="openFile(detection.photoContentType, detection.photo)">
                          <img
                            v-bind:src="'data:' + detection.photoContentType + ';base64,' + detection.photo"
                            style="max-height: 70px"
                            alt="detection image"
                          />
                        </a>
                      </td>
                      <td v-if="detection.validation">Validated</td>
                      <td v-if="!detection.validation">Not Validated</td>
                      <td>{{ detection.stade }}</td>
                      <td>{{ detection.description }}</td>
                      <td>
                        <div v-if="detection.maladie">
                          {{ detection.maladie.nom }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
            <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
              <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span> Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./medecin-patients-details.component.ts"></script>
