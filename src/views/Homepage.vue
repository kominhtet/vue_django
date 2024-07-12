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
      </div>
    </nav>

    <div class="container mt-3">
      <router-view></router-view>
    </div>

    <div class="container row" id="news">
      <div class="newsItem" v-for="news in newsData" :key="news.id">
        <div class="newsImage">
          <img :src="news.photos[0]?.photo" alt="News Image">
        </div>
        <div class="newsContent">
          <div class="info">
            <h5>{{ news.newsdate }}</h5>
          </div>
          <h2>{{ news.headtitle }}</h2>
          <!-- <p>{{ news.summary }}</p> -->
          <a href="" @click.prevent="openModal(news)">Read More</a>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="infosheetModal" tabindex="-1" aria-labelledby="infosheetModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="infosheetModalLabel">{{ selectedNews?.headtitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedNews">
              <img :src="selectedNews.photos[0]?.photo" alt="Infosheet Image" class="img-fluid mb-3">
              <p><strong>Date:</strong> {{ selectedNews.newsdate }}</p>
              <!-- <p>{{ selectedNews.headtitle }}</p> -->
              <p align="justify">{{ selectedNews.description }}</p>
              <!-- <p><strong>Summary:</strong> {{ selectedNews.summary }}</p> -->
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import api from './api';
import * as bootstrap from 'bootstrap';

export default {
  name: 'InfoHome',
  data() {
    return {
      categories: [],
      newsData: [],
      selectedNews: null,
    };
  },
  created() {
    this.fetchCategories();
    this.fetchNews();
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
    },
    async fetchNews() {
      try {
        const response = await axios.get(`${api.API_URL}api/infosheet/`);
        this.newsData = response.data.sort((a, b) => b.id - a.id);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    },
    openModal(news) {
      this.selectedNews = news;
      const modal = new bootstrap.Modal(document.getElementById('infosheetModal'), {
        keyboard: true
      });
      modal.show();
    }
  }
};
</script>

<style scoped>
.info-home {
  padding: 30px 0;
}
.newsItem {
  display: flex;
  align-items: center;
  margin-top: 40px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 20px;
}
.newsImage {
  flex: 1;
  max-width: 300px;
}

.newsImage img {
  max-width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
}
.newsContent {
  flex: 2;
  margin-left: 20px;
}

.newsContent .info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;
  margin-bottom: 12px;
}

.newsContent .info h5 {
  margin: 0;
  font-weight: 400;
}

.newsContent h2 {
  font-size: 18px;
  color: #444;
  margin-top: 0;
  max-height: 44px;
  overflow: hidden;
}

.newsContent p {
  color: #777;
  margin: 10px 0 20px;
  font-size: 14px;
  max-height: 33px;
  overflow: hidden;
}

.newsContent a {
  background-color: #000;
  color: #fff;
  padding: 8px 14px;
  font-size: 13px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
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
