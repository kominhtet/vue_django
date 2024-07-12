import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '../src/resources/css/bootstrap.css'
import '../src/resources/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import 'popper.js';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.css';
createApp(App).use(router).mount('#app')
