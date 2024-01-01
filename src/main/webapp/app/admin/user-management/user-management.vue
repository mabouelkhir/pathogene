<template>
  <div class="container-fluid">
    <div class="card jh-card">
      <h2>
        <span id="user-management-page-heading" data-cy="userManagementPageHeading">Users</span>

        <div class="d-flex justify-content-between align-items-center">
          <div class="input-group col-4">
            <div class="input-group-prepend">
              <span class="input-group-text"><font-awesome-icon icon="magnifying-glass" /></span>
            </div>
            <input class="form-control" v-model="searchQuery" @input="searchUsers" type="text" placeholder="Search by login, email" />
          </div>
          <div>
            <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isLoading">
              <font-awesome-icon icon="sync" :spin="isLoading"></font-awesome-icon> <span>Refresh List</span>
            </button>
          </div>
        </div>
      </h2>
      <div class="table-responsive" v-if="users">
        <table class="table table-striped" aria-describedby="Users">
          <thead>
            <tr>
              <th scope="col" v-on:click="changeOrder('login')">
                <span>Login</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'login'"></jhi-sort-indicator>
              </th>
              <th scope="col" v-on:click="changeOrder('email')">
                <span>Email</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'email'"></jhi-sort-indicator>
              </th>
              <th scope="col">Status</th>
              <th scope="col"><span>Profiles</span></th>
              <th scope="col"></th>
            </tr>
          </thead>

          <tbody v-if="users && isAdmin()">
            <tr v-for="user in filteredUsersNotPatient" :key="user.id" :id="user.login">
              <td>{{ user.login }}</td>
              <td class="jhi-user-email">{{ user.email }}</td>
              <td>
                <button class="btn btn-danger btn-sm deactivated" v-on:click="setActive(user, true)" v-if="!user.activated">
                  Deactivated
                </button>
                <button
                  class="btn btn-success btn-sm"
                  v-on:click="setActive(user, false)"
                  v-if="user.activated"
                  :disabled="username === user.login"
                >
                  Activated
                </button>
              </td>

              <td>
                <div v-for="authority of user.authorities" :key="authority">
                  <span class="badge badge-info">{{ authority }}</span>
                </div>
              </td>
              <td class="text-right">
                <div class="btn-group">
                  <router-link :to="{ name: 'JhiUserView', params: { userId: user.id } }" custom v-slot="{ navigate }">
                    <button @click="navigate" class="btn btn-info btn-sm details mr-1">
                      <font-awesome-icon icon="eye"></font-awesome-icon>
                      <span class="d-none d-md-inline">View</span>
                    </button>
                  </router-link>
                  <router-link :to="{ name: 'JhiUserEdit', params: { userId: user.id } }" custom v-slot="{ navigate }">
                    <button @click="navigate" class="btn btn-primary btn-sm edit mr-1">
                      <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                      <span class="d-none d-md-inline">Edit</span>
                    </button>
                  </router-link>
                  <b-button v-on:click="prepareRemove(user)" variant="danger" class="btn btn-sm delete" :disabled="username === user.login">
                    <font-awesome-icon icon="times"></font-awesome-icon>
                    <span class="d-none d-md-inline">Delete</span>
                  </b-button>
                </div>
              </td>
            </tr>
          </tbody>

          <tbody v-if="users && isSecretaire()">
            <tr v-for="user in filteredUsersPatient" :key="user.id" :id="user.login">
              <td>{{ user.login }}</td>
              <td class="jhi-user-email">{{ user.email }}</td>
              <td>
                <button class="btn btn-danger btn-sm deactivated" v-on:click="setActive(user, true)" v-if="!user.activated">
                  Deactivated
                </button>
                <button
                  class="btn btn-success btn-sm"
                  v-on:click="setActive(user, false)"
                  v-if="user.activated"
                  :disabled="username === user.login"
                >
                  Activated
                </button>
              </td>

              <td>PATIENT</td>
              <td class="text-right">
                <div class="btn-group">
                  <router-link :to="{ name: 'JhiUserView', params: { userId: user.id } }" custom v-slot="{ navigate }">
                    <button @click="navigate" class="btn btn-info btn-sm details mr-1">
                      <font-awesome-icon icon="eye"></font-awesome-icon>
                      <span class="d-none d-md-inline">View</span>
                    </button>
                  </router-link>
                  <router-link :to="{ name: 'JhiUserEdit', params: { userId: user.id } }" custom v-slot="{ navigate }">
                    <button @click="navigate" class="btn btn-primary btn-sm edit mr-1">
                      <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                      <span class="d-none d-md-inline">Edit</span>
                    </button>
                  </router-link>
                  <b-button v-on:click="prepareRemove(user)" variant="danger" class="btn btn-sm delete" :disabled="username === user.login">
                    <font-awesome-icon icon="times"></font-awesome-icon>
                    <span class="d-none d-md-inline">Delete</span>
                  </b-button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <b-modal ref="removeUser" id="removeUser" @ok="deleteUser()">
          <div class="modal-body">
            <p id="jhi-delete-user-heading">Are you sure you want to delete this user?</p>
          </div>
          <div slot="modal-footer">
            <button type="button" class="btn btn-secondary" v-on:click="closeDialog()">Cancel</button>
            <button type="button" class="btn btn-primary" id="confirm-delete-user" v-on:click="deleteUser()">Delete</button>
          </div>
        </b-modal>
      </div>
      <div v-show="users && users.length > 0">
        <div class="row justify-content-center">
          <jhi-item-count :page="page" :total="queryCount" :itemsPerPage="itemsPerPage"></jhi-item-count>
        </div>
        <div class="row justify-content-center">
          <b-pagination size="md" :total-rows="totalItems" v-model="page" :per-page="itemsPerPage" :change="loadPage(page)"></b-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./user-management.component.ts"></script>
