<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <div class="col-8">
        <div v-if="rendezVous">
          <h2 class="jh-entity-heading" data-cy="rendezVousDetailsHeading">
            <span v-text="$t('pathogeneApp.rendezVous.detail.title')">Appointment</span>
          </h2>
          <dl class="row jh-entity-details">
            <dt>
              <span v-text="$t('pathogeneApp.rendezVous.code')">Code</span>
            </dt>
            <dd>
              <span>{{ rendezVous.code }}</span>
            </dd>
            <dt>
              <span v-text="$t('pathogeneApp.rendezVous.date')">Date</span>
            </dt>
            <dd>
              <span v-if="rendezVous.date">{{ rendezVous.date | formatDate }}</span>
            </dd>
            <dt>
              <span v-text="$t('pathogeneApp.rendezVous.status')">Status</span>
            </dt>
            <dd>
              <span>{{ rendezVous.status }}</span>
            </dd>
            <dt>
              <span v-text="$t('pathogeneApp.rendezVous.patient')">Patient</span>
            </dt>
            <dd v-if="!isPatient()">
              <div v-if="rendezVous.patient">{{ rendezVous.patient.nom }} {{ rendezVous.patient.prenom }}</div>
            </dd>
            <dt>
              <span v-text="$t('pathogeneApp.rendezVous.medecin')">Doctor</span>
            </dt>
            <dd v-if="!isMedecin()">
              <div v-if="rendezVous.medecin">
                <router-link :to="{ name: 'MedecinView', params: { medecinId: rendezVous.medecin.id } }">
                  {{ rendezVous.medecin.nom }} {{ rendezVous.medecin.prenom }}
                </router-link>
              </div>
            </dd>
          </dl>
          <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
            <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./rendez-vous-details.component.ts"></script>
