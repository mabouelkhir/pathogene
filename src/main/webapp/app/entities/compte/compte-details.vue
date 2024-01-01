<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="compte">
        <h2 class="jh-entity-heading" data-cy="compteDetailsHeading">
          <span v-text="$t('pathogeneApp.compte.detail.title')">Compte</span> {{ compte.id }}
        </h2>
        <dl class="row jh-entity-details">
          <dt>
            <span v-text="$t('pathogeneApp.compte.user')">User</span>
          </dt>
          <dd>
            {{ compte.user ? compte.user.id : '' }}
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
        </button>
        <router-link v-if="compte.id" :to="{ name: 'CompteEdit', params: { compteId: compte.id } }" custom v-slot="{ navigate }">
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.edit')"> Edit</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./compte-details.component.ts"></script>
