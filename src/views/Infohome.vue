<template>
  <div class="info-home">
    <div class="container"
      :style="{ 
        backgroundImage: 'url(' + require('@/assets/bg.png') + ')', 
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '200px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }">  
    </div>

    <nav class="navbar navbar-expand-md navbar-light bg-light mb-3">
      <div class="container">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mx-auto">
            <li v-for="category in categories" :key="category.id" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ category.name }} ({{ category.infosheetCount }})
              </a>
              <ul class="dropdown-menu">
                <li v-for="subcategory in category.subcategories" :key="subcategory.id">
                  <router-link :to="'/infohome/category/' + subcategory.id" class="dropdown-item">
                    {{ subcategory.name }} ({{ subcategory.infosheetCount }})
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="text-end">
          <router-link to="/infosheet" class="btn btn-primary">Search</router-link>
        </div>
      </div>
    </nav>

    <div class="container mt-3">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import api from './api';
export default {
  name: 'InfoHome',
  data() {
    return {
      categories: [],
    };
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const mainCategoriesResponse = await axios.get(`${api.API_URL}api/maincategory/`);
        const subCategoriesResponse = await axios.get(`${api.API_URL}api/subcategory/`);
        
        const mainCategories = mainCategoriesResponse.data;
        const subCategories = subCategoriesResponse.data;

        for (const category of mainCategories) {
          const countResponse = await axios.get(`${api.API_URL}api/infosheet/count/?maincategory=${category.id}`);
          category.infosheetCount = countResponse.data.count;
          category.subcategories = subCategories.filter(sub => sub.maincategory === category.id);
          
          for (const subcategory of category.subcategories) {
            const subCountResponse = await axios.get(`${api.API_URL}api/infosheet/count/?subcategory=${subcategory.id}`);
            subcategory.infosheetCount = subCountResponse.data.count;
          }
        }

        this.categories = mainCategories;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
  }
};
</script>

<style scoped>
.info-home {
  padding: 30px 0;
}

.navbar {
  border-bottom: 1px solid #eee;
  margin: 0 auto;
}

.navbar-nav .nav-item .dropdown-menu {
  position: absolute;
}

.dropdown-menu {
  min-width: 200px;
  border: none;
  box-shadow: 0px 8px 16px rgba(0,0,0,0.1);
}

.nav-link {
  cursor: pointer;
}

.dropdown-toggle::after {
  display: none;
}

.dropdown-item {
  color: #333;
}

@media (min-width: 768px) {
  .navbar-nav {
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 767px) {
  .text-end {
    text-align: center;
    margin-top: 10px;
  }

  .navbar-collapse {
    justify-content: center;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  transition: background-color 0.3s, border-color 0.3s;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}
</style>
