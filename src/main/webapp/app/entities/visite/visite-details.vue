<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <div class="row justify-content-center">
        <div class="col-8">
          <div v-if="visite">
            <h2 class="jh-entity-heading" data-cy="visiteDetailsHeading">
              <span v-text="$t('pathogeneApp.visite.detail.title')">Visit</span>
            </h2>
            <dl class="row jh-entity-details">
              <dt>
                <span v-text="$t('pathogeneApp.visite.code')">Code</span>
              </dt>
              <dd>
                <span>{{ visite.code }}</span>
              </dd>
              <dt>
                <span v-text="$t('pathogeneApp.visite.date')">Date</span>
              </dt>
              <dd>
                <span v-if="visite.date">{{ visite.date | formatDate }}</span>
              </dd>
              <dt>
                <span v-text="$t('pathogeneApp.visite.rendezVous')">Appointment</span>
              </dt>
              <dd>
                <div v-if="visite.rendezVous">
                  <router-link :to="{ name: 'RendezVousView', params: { rendezVousId: visite.rendezVous.id } }">{{
                    visite.rendezVous.code
                  }}</router-link>
                </div>
              </dd>
              <dt v-if="!isSecretaire()">
                <span v-text="$t('pathogeneApp.visite.detection')">Detection</span>
              </dt>
              <dd v-if="!isSecretaire()">
                <div v-if="visite.detection">
                  <router-link :to="{ name: 'DetectionView', params: { detectionId: visite.detection.id } }">{{
                    visite.detection.code
                  }}</router-link>
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
  </div>
</template>

<script lang="ts" src="./visite-details.component.ts"></script>
