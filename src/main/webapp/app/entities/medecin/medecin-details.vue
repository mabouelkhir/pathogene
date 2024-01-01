<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <div class="row justify-content-center">
        <div class="col-8">
          <div v-if="medecin">
            <h2 class="jh-entity-heading" data-cy="medecinDetailsHeading">
              <span v-text="$t('pathogeneApp.medecin.detail.title')">Doctors</span>
            </h2>
            <dl class="row jh-entity-details">
              <dt>
                <span v-text="$t('pathogeneApp.medecin.photo')">Photo</span>
              </dt>
              <dd>
                <div v-if="medecin.photo">
                  <a v-on:click="openFile(medecin.photoContentType, medecin.photo)">
                    <img
                      v-bind:src="'data:' + medecin.photoContentType + ';base64,' + medecin.photo"
                      style="max-width: 100%"
                      alt="Doctor image"
                    />
                  </a>
                </div>
              </dd>
              <dt>
                <span>Code</span>
              </dt>
              <dd>
                <span>{{ medecin.code }}</span>
              </dd>

              <dt>
                <span v-text="$t('pathogeneApp.medecin.nom')">LastName</span>
              </dt>
              <dd>
                <span>{{ medecin.nom }}</span>
              </dd>
              <dt>
                <span v-text="$t('pathogeneApp.medecin.numEmp')">Employee Number </span>
              </dt>
              <dd>
                <span>{{ medecin.numEmp }}</span>
              </dd>
              <dt>
                <span v-text="$t('pathogeneApp.medecin.prenom')">FirstName</span>
              </dt>
              <dd>
                <span>{{ medecin.prenom }}</span>
              </dd>
              <dt>
                <span v-text="$t('pathogeneApp.medecin.expertLevel')">Expert Level</span>
              </dt>
              <dd>
                <span>{{ medecin.expertLevel }}</span>
              </dd>
              <dt>
                <span v-text="$t('pathogeneApp.medecin.type')">Type</span>
              </dt>
              <dd>
                <span>{{ medecin.type }}</span>
              </dd>
              <dt>
                <span v-text="$t('pathogeneApp.medecin.nbrPatients')">NumberOfPatients </span>
              </dt>
              <dd>
                <span>{{ medecin.nbrPatients }}</span>
              </dd>
              <dt>
                <span v-text="$t('pathogeneApp.medecin.rating')">Rating</span>
              </dt>
              <dd>
                <span>{{ medecin.rating }}</span>
              </dd>
              <dt>
                <span v-text="$t('pathogeneApp.medecin.description')">Description</span>
              </dt>
              <dd>
                <span>{{ medecin.description }}</span>
              </dd>

              <dt>
                <span v-text="$t('pathogeneApp.medecin.secretaire')">Secretary</span>
              </dt>
              <dd>
                <div v-if="medecin.secretaire">
                  <router-link :to="{ name: 'SecretaireView', params: { secretaireId: medecin.secretaire.id } }"
                    >{{ medecin.secretaire.nom }} {{ medecin.secretaire.prenom }}
                  </router-link>
                </div>
              </dd>
            </dl>
            <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
              <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
            </button>
            <router-link v-if="medecin.id" :to="{ name: 'MedecinEdit', params: { medecinId: medecin.id } }" custom v-slot="{ navigate }">
              <button @click="navigate" class="btn btn-primary">
                <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.edit')"> Edit</span>
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./medecin-details.component.ts"></script>
