import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import Date from '../views/DateView.vue';
import Student from '../views/StudentView.vue';
import DateRangePicker from '../views/DateRangePicker.vue';
import Factcheck from '../views/Factcheck.vue';
import Infosheet from '../views/Infosheet.vue';
import Homepage from '../views/Homepage.vue';
import Allsearch from '../views/Allsearch.vue';
import Combatnews from '../views/Combatnews.vue';
import CombatnewsAdd from '../views/CombatnewsAdd.vue';
import Infohome from '../views/Infohome.vue';
import CategoryNews from '../views/CategoryNews.vue';
import Login from '../views/Login.vue';
import Logout from '../views/Logout.vue';
import Register from '../views/Register.vue';
import Addcategory from '../views/Addcategory.vue';
import Addinfosheet from '../views/Addinfosheet.vue';
import Sample from '../views/Sample.vue';
import BarChart from '../views/BarChart.vue';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/barchart',
    name: 'barchart',
    component: BarChart,
  },
  {
    path: '/combatnewsadd',
    name: 'combatnewsadd',
    component: CombatnewsAdd,
  },
  {
    path: '/combat_news',
    name: 'student',
    component: Student,
    meta: { requiresAuth: true } // Requires authentication to access
  },
  {
    path: '/date',
    name: 'date',
    component: Date,
    meta: { requiresAuth: true }
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/find',
    name: 'find',
    component: DateRangePicker,
    meta: { requiresAuth: true }
  },
  {
    path: '/factcheck',
    name: 'factcheck',
    component: Factcheck,
    meta: { requiresAuth: true }
  },
  {
    path: '/infosheet',
    name: 'infosheet',
    component: Infosheet,
    meta: { requiresAuth: true }
  },
  {
    path: '/infohome',
    name: 'infohome',
    component: Infohome,
    children: [
      {
        path: 'category/:category',
        name: 'categoryNews',
        component: CategoryNews,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/homepage',
    name: 'homepage',
    component: Homepage,
    meta: { requiresAuth: true }
  },
  {
    path: '/allsearch',
    name: 'allsearch',
    component: Allsearch,
    meta: { requiresAuth: true }
  },
  {
    path: '/combatnews',
    name: 'combatnews',
    component: Combatnews,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/logout',
    name: 'logout',
    component: Logout
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/category',
    name: 'category',
    component: Addcategory
  },
  {
    path: '/addinfosheet',
    name: 'addinfosheet',
    component: Addinfosheet
  },
  {
    path: '/sample',
    name: 'sample',
    component: Sample
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Navigation guard to check for authentication before each route navigation
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication and if the user is authenticated
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    // Redirect to login if not authenticated
    next('/login');
  } else {
    // Continue to the route
    next();
  }
});

export default router;
