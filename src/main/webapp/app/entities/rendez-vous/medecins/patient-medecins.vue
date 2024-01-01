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
                  <span v-text="$t('pathogeneApp.medecin.nom')">LastName</span>
                  <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'nom'"></jhi-sort-indicator>
                </th>
                <th scope="row" v-on:click="changeOrder('prenom')">
                  <span v-text="$t('pathogeneApp.medecin.prenom')">FirstName</span>
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
              </tr>
            </tbody>
          </table>
        </div>
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

<script lang="ts" src="./patient-medecins.component.ts"></script>
