<template>
  <b-navbar data-cy="navbar" toggleable="md" type="dark" class="jh-navbar">
    <b-navbar-brand class="logo" b-link to="/">
      <span class="navbar-title">DLDiagnosis</span>
    </b-navbar-brand>
    <b-navbar-toggle
      right
      class="jh-navbar-toggler d-lg-none"
      href="javascript:void(0);"
      data-toggle="collapse"
      target="header-tabs"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <font-awesome-icon icon="bars" />
    </b-navbar-toggle>

    <b-collapse is-nav id="header-tabs">
      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/" exact>
          <span>
            <font-awesome-icon icon="home" />
            <span v-text="$t('global.menu.home')">Home</span>
          </span>
        </b-nav-item>
        <b-nav-item to="/admin/user-management" v-if="(hasAnyAuthority('ROLE_ADMIN') || hasAnyAuthority('SECRETAIRE')) && authenticated"
          >Accounts</b-nav-item
        >
        <b-nav-item to="/doctor" v-if="hasAnyAuthority('ROLE_ADMIN') && authenticated">Doctors</b-nav-item>
        <b-nav-item to="/patient/doctors" v-if="hasAnyAuthority('PATIENT') && authenticated">My Doctors</b-nav-item>
        <b-nav-item to="/doctor/patients" v-if="hasAnyAuthority('MEDECIN') && authenticated">My Patients</b-nav-item>
        <b-nav-item to="/patient" v-if="hasAnyAuthority('SECRETAIRE') && authenticated">Patients</b-nav-item>
        <b-nav-item to="/secretary" v-if="hasAnyAuthority('ROLE_ADMIN') && authenticated">Secretaries</b-nav-item>
        <b-nav-item
          to="/appointment"
          v-if="(hasAnyAuthority('PATIENT') || hasAnyAuthority('SECRETAIRE') || hasAnyAuthority('MEDECIN')) && authenticated"
          >Appointments</b-nav-item
        >
        <b-nav-item
          to="/visit"
          v-if="(hasAnyAuthority('PATIENT') || hasAnyAuthority('SECRETAIRE') || hasAnyAuthority('MEDECIN')) && authenticated"
          >Visits</b-nav-item
        >
        <b-nav-item to="/detection" v-if="(hasAnyAuthority('MEDECIN') || hasAnyAuthority('PATIENT')) && authenticated"
          >Detections</b-nav-item
        >
        <b-nav-item
          to="/disease"
          v-if="(hasAnyAuthority('MEDECIN') || hasAnyAuthority('PATIENT') || hasAnyAuthority('ROLE_ADMIN')) && authenticated"
          >Diseases</b-nav-item
        >
        <b-nav-item v-on:click="openLogin()" v-if="!authenticated">Sign in</b-nav-item>
        <b-nav-item to="/register" v-if="!authenticated">Register</b-nav-item>
        <b-nav-item
          href="javascript:void(0);"
          :class="{ 'router-link-active': subIsActive('/account') }"
          v-on:click="logout()"
          v-if="authenticated"
          >Sign out</b-nav-item
        >
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts" src="./jhi-navbar.component.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* ==========================================================================
    Navbar
    ========================================================================== */
.navbar-version {
  font-size: 10px;
}

.navbar {
  font-size: 0.95rem;
  text-transform: none;
  padding: 0.7rem 1rem;
  background-color: #106eea;
}

span.navbar-title {
  font-size: 1.4rem;
}

@media screen and (min-width: 768px) {
  .jh-navbar-toggler {
    display: none;
  }
}

@media screen and (min-width: 768px) and (max-width: 1150px) {
  span span {
    display: none;
  }
}

.navbar-title {
  display: inline-block;
  vertical-align: middle;
}

/* ==========================================================================
    Logo styles
    ========================================================================== */
.navbar-brand.logo {
  padding: 5px 15px;
}

.logo .logo-img {
  height: 45px;
  display: inline-block;
  vertical-align: middle;
  width: 70px;
}

.logo-img {
  height: 100%;
  background: url('../../../content/images/logo-jhipster.png') no-repeat center center;
  background-size: contain;
  width: 100%;
  filter: drop-shadow(0 0 0.05rem white);
}
</style>
