<template>
    <div>
      <h2>Logout</h2>
      <p>Are you sure you want to logout?</p>
      <button @click="logout">Logout</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      logout() {
        // Clear token from localStorage or Vuex store
        localStorage.removeItem('token');
  
        // Redirect to login page or other route
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your component-specific styles here */
  </style>
  