<template>
    <div class="form-container mb-3 row d-flex justify-content-around">
      <div class="col-md-4">
        <div v-if="currentMainCategory.id">
          <h2 class="alert alert-info">Main Category ပြင်ရန်</h2>
          <form @submit.prevent="updateMainCategory" class="form">
            <div class="form-group">
              <input v-model="currentMainCategory.name" type="text" class="form-control" placeholder="Main Category" required />
            </div>
            <button type="submit" class="btn btn-primary float-left ml-2">Update</button>
          </form>
        </div>
        <div v-else>
          <h4 class="alert alert-info">Main Category အသစ်ထည့်ရန်</h4>
          <form @submit.prevent="addMainCategory" class="form row">
            <div class="form-group col">
              <input v-model="newMainCategory.name" type="text" class="form-control" placeholder="Main Category" required />
            </div>
            <div class="form-group col">
              <button type="submit" class="btn btn-primary float-left ml-2">Add Main Category</button>
            </div>
          </form>
        </div>
      </div>
      <div class="col-md-4">
        <div v-if="currentSubCategory.id">
          <h2 class="alert alert-info">Sub Category ပြင်ရန်</h2>
          <form @submit.prevent="updateSubCategory" class="form">
            <div class="form-group">
              <input v-model="currentSubCategory.name" type="text" class="form-control" placeholder="Sub Category" required />
            </div>
            <div class="form-group">
              <select v-model="currentSubCategory.maincategory" class="form-control" required>
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary float-left ml-2">Update</button>
          </form>
        </div>
        <div v-else>
          <h4 class="alert alert-info">Sub Category အသစ်ထည့်ရန်</h4>
          <form @submit.prevent="addSubCategory" class="form row">
            <div class="form-group col">
              <input v-model="newSubCategory.name" type="text" class="form-control" placeholder="Sub Category" required />
            </div>
            <div class="form-group col">
              <select v-model="newSubCategory.maincategory" class="form-control" required>
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
              </select>
            </div>
            <div class="form-group col">
              <button type="submit" class="btn btn-primary float-left ml-2">Add Sub Category</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <table class="table table-bordered table-hover mt-4" v-if="categories.length">
          <thead class="thead-dark">
            <tr>
              <th scope="col">စဉ်</th>
              <th scope="col">Main Category</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(category, index) in categories" :key="category.id">
              <td>{{ index + 1 }}</td>
              <td style="text-align:left">{{ category.name }}</td>
              <td>
                <button class="btn btn-warning btn-sm" @click="editMainCategoryBtn(category)">Edit</button>
              </td>
              <td>
                <button class="btn btn-danger btn-sm" @click="confirmDeleteMainCategory(category.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="text-center">No categories found.</p>
      </div>
      <div class="col-md-6">
        <table class="table table-bordered table-hover mt-4" v-if="subcategories.length">
          <thead class="thead-dark">
            <tr>
              <th scope="col">စဉ်</th>
              <th scope="col">Sub Category</th>
              <th scope="col">Main Category</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(subcategory, index) in subcategories" :key="subcategory.id">
              <td>{{ index + 1 }}</td>
              <td style="text-align:left">{{ subcategory.name }}</td>
              <td style="text-align:left">{{ getMainCategoryName(subcategory.maincategory) }}</td>
              <td>
                <button class="btn btn-warning btn-sm" @click="editSubCategoryBtn(subcategory)">Edit</button>
              </td>
              <td>
                <button class="btn btn-danger btn-sm" @click="confirmDeleteSubCategory(subcategory.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="text-center">No subcategories found.</p>
      </div>
    </div>
  </template>
  
  <script>
import axios from 'axios';
import api from './api';

export default {
  data() {
    return {
      categories: [],
      subcategories: [],
      newMainCategory: {
        name: ''
      },
      newSubCategory: {
        name: '',
        maincategory: null
      },
      currentMainCategory: {
        id: null,
        name: ''
      },
      currentSubCategory: {
        id: null,
        name: '',
        maincategory: null
      }
    };
  },
  mounted() {
    this.fetchCategories();
    this.fetchSubcategories();
  },
  methods: {
    fetchCategories() {
      axios.get(`${api.API_URL}api/maincategory/`)
        .then(response => {
          this.categories = response.data;
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });
    },
    fetchSubcategories() {
      axios.get(`${api.API_URL}api/subcategory/`)
        .then(response => {
          this.subcategories = response.data;
        })
        .catch(error => {
          console.error('Error fetching subcategories:', error);
        });
    },
    addMainCategory() {
      axios.post(`${api.API_URL}api/maincategory/`, this.newMainCategory)
        .then(response => {
          this.categories.push(response.data);
          this.newMainCategory.name = '';
        })
        .catch(error => {
          console.error('Error adding category:', error);
        });
    },
    addSubCategory() {
      axios.post(`${api.API_URL}api/subcategory/`, this.newSubCategory)
        .then(response => {
          this.subcategories.push(response.data);
          this.newSubCategory.name = '';
          this.newSubCategory.maincategory = null;
        })
        .catch(error => {
          console.error('Error adding subcategory:', error);
        });
    },
    editMainCategoryBtn(category) {
      this.currentMainCategory = { ...category };
    },
    editSubCategoryBtn(subcategory) {
      this.currentSubCategory = { ...subcategory };
    },
    updateMainCategory() {
      axios.put(`${api.API_URL}api/maincategory/${this.currentMainCategory.id}/`, this.currentMainCategory)
        .then(response => {
          const index = this.categories.findIndex(cat => cat.id === response.data.id);
          this.categories.splice(index, 1, response.data);
          this.currentMainCategory = { id: null, name: '' };
        })
        .catch(error => {
          console.error('Error updating category:', error);
        });
    },
    updateSubCategory() {
      axios.put(`${api.API_URL}api/subcategory/${this.currentSubCategory.id}/`, this.currentSubCategory)
        .then(response => {
          const index = this.subcategories.findIndex(sub => sub.id === response.data.id);
          this.subcategories.splice(index, 1, response.data);
          this.currentSubCategory = { id: null, name: '', maincategory: null };
        })
        .catch(error => {
          console.error('Error updating subcategory:', error);
        });
    },
    confirmDeleteMainCategory(id) {
      if (confirm('Are you sure you want to delete this main category?')) {
        this.deleteMainCategory(id);
      }
    },
    confirmDeleteSubCategory(id) {
      if (confirm('Are you sure you want to delete this subcategory?')) {
        this.deleteSubCategory(id);
      }
    },
    deleteMainCategory(id) {
      axios.delete(`${api.API_URL}api/maincategory/${id}/`)
        .then(response => {
          this.categories = this.categories.filter(cat => cat.id !== id);
        })
        .catch(error => {
          console.error('Error deleting category:', error);
        });
    },
    deleteSubCategory(id) {
      axios.delete(`${api.API_URL}api/subcategory/${id}/`)
        .then(response => {
          this.subcategories = this.subcategories.filter(sub => sub.id !== id);
        })
        .catch(error => {
          console.error('Error deleting subcategory:', error);
        });
    },
    getMainCategoryName(id) {
      const category = this.categories.find(cat => cat.id === id);
      return category ? category.name : 'Unknown';
    }
  }
};
</script>

  
  <style scoped>
  .form-container {
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .table {
    background-color: #ffffff;
  }
  
  .table th, .table td {
    vertical-align: middle;
  }
  
  .btn {
    width: 100%;
  }
  
  .form {
    margin-top: 10px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  </style>
