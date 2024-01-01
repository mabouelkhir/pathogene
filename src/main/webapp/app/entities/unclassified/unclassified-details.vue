<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="unclassified">
        <h2 class="jh-entity-heading" data-cy="unclassifiedDetailsHeading">
          <span v-text="$t('pathogeneApp.unclassified.detail.title')">Unclassified</span> {{ unclassified.id }}
        </h2>
        <dl class="row jh-entity-details">
          <dt>
            <span v-text="$t('pathogeneApp.unclassified.code')">Code</span>
          </dt>
          <dd>
            <span>{{ unclassified.code }}</span>
          </dd>
          <dt>
            <span v-text="$t('pathogeneApp.unclassified.photo')">Photo</span>
          </dt>
          <dd>
            <div v-if="unclassified.photo">
              <a v-on:click="openFile(unclassified.photoContentType, unclassified.photo)">
                <img
                  v-bind:src="'data:' + unclassified.photoContentType + ';base64,' + unclassified.photo"
                  style="max-width: 100%"
                  alt="unclassified image"
                />
              </a>
              {{ unclassified.photoContentType }}, {{ byteSize(unclassified.photo) }}
            </div>
          </dd>
          <dt>
            <span v-text="$t('pathogeneApp.unclassified.maladie')">Maladie</span>
          </dt>
          <dd>
            <div v-if="unclassified.maladie">
              <router-link :to="{ name: 'MaladieView', params: { maladieId: unclassified.maladie.id } }">{{
                unclassified.maladie.id
              }}</router-link>
            </div>
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
        </button>
        <router-link
          v-if="unclassified.id"
          :to="{ name: 'UnclassifiedEdit', params: { unclassifiedId: unclassified.id } }"
          custom
          v-slot="{ navigate }"
        >
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.edit')"> Edit</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./unclassified-details.component.ts"></script>
