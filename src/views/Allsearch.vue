<template>
    <div class="container-fluid">
      <div class="form-container mb-3 row">
        <div class="col-md-2">
          <VueDatePicker v-model="startDate" :style="{ width: '100%' }" :enable-time="false" class="form-control" placeholder="Start Date"/>
        </div>
        <div class="col-md-2">
          <VueDatePicker v-model="endDate" :style="{ width: '100%' }" :enable-time="false" class="form-control" placeholder="End Date"/>
        </div>
        <div class="col-md-2">
          <input v-model="keyword" type="text" class="form-control" placeholder="Keyword"/>
        </div>
        <div class="col-md-2">
          <button @click="searchByDateRange" class="btn btn-primary w-100">Search</button>
        </div>
        <div class="col-md-1">
          <button @click="refreshPage" class="btn btn-secondary">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>
      <p v-if="searchClicked" class="alert alert-success col-md-4">
        သတင်းပုဒ်ရေစုစုပေါင်း ({{ results.length }}) ခုတွေ့ရှိပါသည်။
      </p>
      <div class="row">
        <div class="col-md-12">
          <h2 class="alert alert-success">အချက်အလက်များရှာဖွေရန်</h2>
          <table class="table table-bordered mt-4">
            <thead>
              <tr>
                <th scope="col">စဉ်</th>
                <th scope="col">ရက်စွဲ</th>
                <th scope="col">သတင်းအကြောင်းအရာ</th>
                <th scope="col">အရင်းအမြစ်</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(data, index) in results" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ data.date }}</td>
                <td style="text-align:left">{{ data.description }}</td>
                <td>{{ data.source }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';
  import axios from 'axios';
  import api from './api';

  export default {
    components: {
      VueDatePicker,
    },
    data() {
      return {
        startDate: null,
        endDate: null,
        keyword: '',
        results: [],
        searchClicked: false,  // Track if search button has been clicked
      };
    },
    methods: {
      async searchByDateRange() {
        try {
          const params = {
            start_date: this.startDate ? this.startDate.toISOString().split('T')[0] : null,
            end_date: this.endDate ? this.endDate.toISOString().split('T')[0] : null,
            keyword: this.keyword || null,
          };
          const response = await axios.get(`${api.API_URL}api/all_data/`, { params });
          this.results = response.data;
          this.searchClicked = true;  // Set flag to true after search
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
      refreshPage() {
        this.startDate = null;
        this.endDate = null;
        this.keyword = '';
        this.results = [];
        this.searchClicked = false;  // Reset flag when refresh is clicked
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add any custom styles here */
  </style>
  