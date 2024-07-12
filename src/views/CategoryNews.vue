<template>
  <div class="container-fluid">
    <div class="row">
      <h3 class="alert alert-info">{{ subcategoryName }} နှင့်ဆိုင်သောသတင်းများ</h3>
      <div class="col-md-12">
        <div class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="thead-dark">
              <tr>
                <th scope="col">ရက်စွဲ</th>
                <th scope="col">သတင်းခေါင်းစဉ်</th>
                <th scope="col">သတင်းအကြောင်းအရာ</th>
                <th scope="col">ဓာတ်ပုံများ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="news in newsItems" :key="news.id">
                <td>{{ news.date }}</td>
                <td style="text-align:left">{{ news.headtitle }}</td>
                <td style="text-align:left">{{ news.description }}</td>
                <td>
                  <img v-if="news.photo" :src="news.photo" alt="Info Photo" width="100" @click="openModal(news.photo)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <Modal v-if="isModalVisible" :isVisible="isModalVisible" :photoSrc="modalPhoto" @close="closeModal"/>
  </div>
</template>
  
  <script>
  import axios from 'axios';
  import Modal from './Modal.vue';
  import api from './api';

  export default {
    components: {
      Modal
    },
    name: 'CategoryNews',
    data() {
      return {
        subcategoryName: '',
        newsItems: [],
        isModalVisible: false,
        modalPhoto: ''
      };
    },
    watch: {
      $route: {
        immediate: true,
        handler() {
          this.fetchNews();
        }
      }
    },
    methods: {
      openModal(photo) {
        this.modalPhoto = photo;
        this.isModalVisible = true;
      },
      closeModal() {
        this.isModalVisible = false;
      },
      async fetchNews() {
        const subcategoryId = this.$route.params.category;
        try {
          const subCategoryResponse = await axios.get(`${api.API_URL}api/subcategory/${subcategoryId}/`);
          this.subcategoryName = subCategoryResponse.data.name;
  
          const newsResponse = await axios.get(`${api.API_URL}api/infosheet/?subcategory=${subcategoryId}`);
          this.newsItems = newsResponse.data;
        } catch (error) {
          console.error('Error fetching news:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .container-fluid {
    background-color: #f9f9f9;
    padding: 30px;
  }
  
  .alert-info {
    margin-bottom: 20px;
  }
  
  .table {
    margin-top: 20px;
  }
  
  .table-responsive {
    overflow-x: auto;
  }
  
  .table-bordered {
    border: 1px solid #dee2e6;
  }
  
  .table-hover tbody tr:hover {
    background-color: #f5f5f5;
  }
  
  .table thead th {
    vertical-align: middle;
    text-align: center;
  }
  
  .table tbody td {
    vertical-align: middle;
  }
  </style>
  