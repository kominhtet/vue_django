<template>
  <div class="login-container">
    <div class="login-form card">
      <div class="card-body">
        <form @submit.prevent="login">
          <h3 class="text-center mb-4">Login</h3>
          <div class="mb-3">
            <input type="text" id="username" v-model="username" class="form-control" placeholder="Username" required>
          </div>
          <div class="mb-3">
            <input type="password" id="password" v-model="password" class="form-control" placeholder="Password" required>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Login</button>
        </form>
        <p v-if="error" class="error-message mt-3">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      error: ''
    };
  },
  methods: {
    login() {
      // Check hardcoded credentials
      if (this.username === 'admin' && this.password === 'admin!@#') {
        // Mocking a successful login scenario
        // Simulate storing token or session (you can use localStorage or Vuex)
        localStorage.setItem('token', 'mocked_token');

        // Redirect to home page or other route
        this.$router.push('/homepage');
      } else {
        // Handle incorrect credentials scenario
        this.error = 'Invalid username or password';
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0; /* Light background color */
  background-image: url('@/assets/bg.jpg');
  background-size: cover;
}

.login-form {
  max-width: 400px;
  width: 90%; /* Adjust width as needed */
  border: none; /* Remove border for cleaner appearance */
  border-radius: 10px;
  background-color: #ffffff; /* White background */
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.card-body {
  padding: 30px; /* Increased padding for better spacing */
}

.btn-primary {
  background-color: #007bff; /* Blue primary button color */
  border-color: #007bff; /* Blue border color */
}

.btn-primary:hover {
  background-color: #0069d9; /* Darker blue on hover */
  border-color: #0062cc; /* Darker border on hover */
}

.btn-block {
  display: block;
  width: 100%; /* Full-width button */
}

.error-message {
  text-align: center;
  color: #dc3545; /* Red error message color */
  margin-top: 10px;
}
</style>
