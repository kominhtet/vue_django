<template>
    <div>
      <h2>Register</h2>
      <form @submit.prevent="register">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required>
        <br>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
        <br>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
        <br>
        <button type="submit">Register</button>
      </form>
      <p v-if="error" style="color: red;">{{ error }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: '',
        error: ''
      };
    },
    methods: {
      async register() {
        try {
          // Call your API to register user
          const response = await this.$axios.post('/api/register', {
            username: this.username,
            email: this.email,
            password: this.password
          });
          
          // Optionally handle response data or feedback
          
          // Redirect to login page or other route after successful registration
          this.$router.push('/login');
        } catch (error) {
          this.error = 'Failed to register. Please try again.';
          console.error('Registration error:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your component-specific styles here */
  </style>
  