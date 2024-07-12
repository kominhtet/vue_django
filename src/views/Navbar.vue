<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link to="/homepage" class="navbar-brand">Home</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/combatnews" class="nav-link">တိုက်ပွဲသတင်းများ</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/factcheck" class="nav-link">FACTCHECK</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/infohome" class="nav-link">INFOSHEET</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/allsearch" class="nav-link">ရှာဖွေရန်</router-link>
          </li>
          <!-- <li class="nav-item">
            <router-link to="/barchart" class="nav-link">barchart</router-link>
          </li> -->
          <!-- <li class="nav-item">
            <router-link to="/combatnews_chart" class="nav-link">combatnews_chart</router-link>
          </li>  -->
          <!-- <li class="nav-item">
            <router-link to="/sample" class="nav-link">sample</router-link>
          </li>         -->
        </ul>
        <ul class="navbar-nav ms-auto">
          <li v-if="!loggedIn" class="nav-item">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li> 
          <li v-if="loggedIn" class="nav-item">
            <router-link to="/logout" class="nav-link">Logout</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  computed: {
    loggedIn() {
      // Check if user is logged in based on your application's logic
      return localStorage.getItem('token') !== null; // Example using localStorage for token
    }
  }
};
</script>

<style scoped>
.navbar-brand {
  font-weight: bold;
}

.navbar-nav .nav-link {
  color: #fff;
}

.navbar-nav .nav-link:hover {
  color: #f8f9fa;
}

.navbar-nav .nav-link.router-link-exact-active {
  color: #42b983 !important;
}
</style>
