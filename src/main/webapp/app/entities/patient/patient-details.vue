<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <div class="row justify-content-center">
        <div class="col-8">
          <div v-if="patient">
            <h2 class="jh-entity-heading" data-cy="patientDetailsHeading">
              <span v-text="$t('pathogeneApp.patient.detail.title')">Patient</span>
            </h2>
            <dl class="row jh-entity-details">
              <dt>
                <span v-text="$t('pathogeneApp.patient.photo')">Photo</span>
              </dt>
              <dd>
                <div v-if="patient.photo">
                  <a v-on:click="openFile(patient.photoContentType, patient.photo)">
                    <img
                      v-bind:src="'data:' + patient.photoContentType + ';base64,' + patient.photo"
                      style="max-width: 100%"
                      alt="patient image"
                    />
                  </a>
                </div>
              </dd>
              <dt>
                <span v-text="$t('pathogeneApp.patient.code')">Code</span>
              </dt>
              <dd>
                <span>{{ patient.code }}</span>
              </dd>
              <dt>
                <span v-text="$t('pathogeneApp.patient.nom')">LastName</span>
              </dt>
              <dd>
                <span>{{ patient.nom }}</span>
              </dd>
              <dt>
                <span v-text="$t('pathogeneApp.patient.prenom')">FirstName</span>
              </dt>
              <dd>
                <span>{{ patient.prenom }}</span>
              </dd>
              <dt>
                <span v-text="$t('pathogeneApp.patient.dateNaissance')">DateOfBirth </span>
              </dt>
              <dd>
                <span>{{ patient.dateNaissance }}</span>
              </dd>
              <dt>
                <span v-text="$t('pathogeneApp.patient.adresse')">Address</span>
              </dt>
              <dd>
                <span>{{ patient.adresse }}</span>
              </dd>
              <dt>
                <span v-text="$t('pathogeneApp.patient.genre')">Gender</span>
              </dt>
              <dd>
                <span v-text="$t('pathogeneApp.Genre.' + patient.genre)">{{ patient.genre }}</span>
              </dd>
              <dt>
                <span v-text="$t('pathogeneApp.patient.telephone')">Phone</span>
              </dt>
              <dd>
                <span>{{ patient.telephone }}</span>
              </dd>
              <dt>
                <span v-text="$t('pathogeneApp.patient.taille')">Height </span>
              </dt>
              <dd>
                <span>{{ patient.taille }}</span>
              </dd>
              <dt>
                <span v-text="$t('pathogeneApp.patient.poids')">Weight </span>
              </dt>
              <dd>
                <span>{{ patient.poids }}</span>
              </dd>
            </dl>
            <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
              <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
            </button>
            <router-link v-if="patient.id" :to="{ name: 'PatientEdit', params: { patientId: patient.id } }" custom v-slot="{ navigate }">
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

<script lang="ts" src="./patient-details.component.ts"></script>
