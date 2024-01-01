<template>
  <div>
    <b-dropdown-item to="/classification">
      <font-awesome-icon icon="asterisk" />
      <span v-text="$t('global.menu.entities.classification')">Classification</span>
    </b-dropdown-item>
    <b-dropdown-item to="/compte">
      <font-awesome-icon icon="asterisk" />
      <span v-text="$t('global.menu.entities.compte')">Compte</span>
    </b-dropdown-item>
    <b-dropdown-item to="/detection">
      <font-awesome-icon icon="asterisk" />
      <span v-text="$t('global.menu.entities.detection')">Detection</span>
    </b-dropdown-item>
    <b-dropdown-item to="/image">
      <font-awesome-icon icon="asterisk" />
      <span v-text="$t('global.menu.entities.image')">Image</span>
    </b-dropdown-item>
    <b-dropdown-item to="/maladie">
      <font-awesome-icon icon="asterisk" />
      <span v-text="$t('global.menu.entities.maladie')">Maladie</span>
    </b-dropdown-item>
    <b-dropdown-item to="/medecin">
      <font-awesome-icon icon="asterisk" />
      <span v-text="$t('global.menu.entities.medecin')">Medecin</span>
    </b-dropdown-item>
    <b-dropdown-item to="/patient">
      <font-awesome-icon icon="asterisk" />
      <span v-text="$t('global.menu.entities.patient')">Patient</span>
    </b-dropdown-item>
    <b-dropdown-item to="/rendez-vous">
      <font-awesome-icon icon="asterisk" />
      <span v-text="$t('global.menu.entities.rendezVous')">Rendez Vous</span>
    </b-dropdown-item>
    <b-dropdown-item to="/secretaire">
      <font-awesome-icon icon="asterisk" />
      <span v-text="$t('global.menu.entities.secretaire')">Secretaire</span>
    </b-dropdown-item>
    <b-dropdown-item to="/stade">
      <font-awesome-icon icon="asterisk" />
      <span v-text="$t('global.menu.entities.stade')">Stade</span>
    </b-dropdown-item>
    <b-dropdown-item to="/unclassified">
      <font-awesome-icon icon="asterisk" />
      <span v-text="$t('global.menu.entities.unclassified')">Unclassified</span>
    </b-dropdown-item>
    <b-dropdown-item to="/visite">
      <font-awesome-icon icon="asterisk" />
      <span v-text="$t('global.menu.entities.visite')">Visite</span>
    </b-dropdown-item>
    <!-- jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here -->
  </div>
</template>

<script lang="ts" src="./entities-menu.component.ts"></script>
