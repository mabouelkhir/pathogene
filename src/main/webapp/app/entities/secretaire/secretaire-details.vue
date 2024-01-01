<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <div class="row justify-content-center">
        <div class="col-8">
          <div v-if="secretaire">
            <h2 class="jh-entity-heading" data-cy="secretaireDetailsHeading"><span>Secretary</span></h2>
            <dl class="row jh-entity-details">
              <dt>
                <span>Photo</span>
              </dt>
              <dd>
                <div v-if="secretaire.photo">
                  <a v-on:click="openFile(secretaire.photoContentType, secretaire.photo)">
                    <img
                      v-bind:src="'data:' + secretaire.photoContentType + ';base64,' + secretaire.photo"
                      style="max-width: 100%"
                      alt="secretaire image"
                    />
                  </a>
                </div>
              </dd>

              <dt>
                <span>Code</span>
              </dt>
              <dd>
                <span>{{ secretaire.code }}</span>
              </dd>

              <dt>
                <span>Employee Number </span>
              </dt>
              <dd>
                <span>{{ secretaire.numEmp }}</span>
              </dd>

              <dt>
                <span>LastName</span>
              </dt>
              <dd>
                <span>{{ secretaire.nom }}</span>
              </dd>

              <dt>
                <span>FirstName</span>
              </dt>
              <dd>
                <span>{{ secretaire.prenom }}</span>
              </dd>
            </dl>
            <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
              <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span> Back</span>
            </button>
            <router-link
              v-if="secretaire.id"
              :to="{ name: 'SecretaireEdit', params: { secretaireId: secretaire.id } }"
              custom
              v-slot="{ navigate }"
            >
              <button @click="navigate" class="btn btn-primary">
                <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span> Edit</span>
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./secretaire-details.component.ts"></script>
