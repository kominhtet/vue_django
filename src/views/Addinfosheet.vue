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
        <div class="col-md-1">
          <button @click="searchByDateRange" class="btn btn-primary w-100">Search</button>
        </div>
        <div class="col-md-1">
          <button @click="refreshPage" class="btn btn-secondary">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
        <div class="col-md-2">
          <p class="alert alert-success col-md-8">{{ infosheets.length }} founds</p>
        </div>
        <div class="col-md-auto text-md-end mt-2 mt-md-0"> <!-- Adjust margin-top for spacing -->
          <a href="/category" class="btn btn-primary">Add Category</a>
        </div>
      </div>
      <div class="row">
        <div class="col-md-10">
          <h2 class="alert alert-success">Info_sheet</h2>
          <table class="table table-bordered mt-4">
            <thead>
              <tr>
                <th scope="col">စဉ်</th>
                <th scope="col">ရက်စွဲ</th>
                <th scope="col">သတင်းခေါင်းစဉ်</th>
                <th scope="col">သတင်းအကြောင်းအရာ</th>
                <th scope="col">MainCategory</th>
                <th scope="col">SubCategory</th>
                <th scope="col">ဓာတ်ပုံများ</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(info, index) in infosheets" :key="info.id">
                <td>{{ index + 1 }}</td>
                <td>{{ info.date }}</td>
                <td>{{ info.headtitle }}</td>
                <td style="text-align:left">{{ info.description }}</td>
                <td>{{ getMainCategoryName(info.maincategory)  }}</td>
                <td>{{ getSubCategoryName(info.subcategory) }}</td>
                <td><img :src="info.photo" alt="Info Photo" width="100" @click="openModal(info.photo)" /></td>
                <td>
                  <button class="btn btn-warning btn-sm" @click="editBtn(info.id)">Edit</button>
                </td>
                <td>
                  <button class="btn btn-danger btn-sm" @click="deleteBtn(info.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-md-2">
          <div v-if="Object.keys(this.currentInfosheet).length !== 0">
            <h2 class="alert alert-info">Edit News</h2>
            <form @submit.prevent="updateInfosheet(currentInfosheet.id)" enctype="multipart/form-data">
              <div class="form-group">
                <VueDatePicker v-model="currentInfosheet.date" :style="{ width: '100%' }" :enable-time="false" class="form-control custom-datepicker" placeholder="ရက်စွဲ"/>
              </div>
              <div class="form-group">
                <input v-model="currentInfosheet.headtitle" type="text" class="form-control" placeholder="ခေါင်းစီး" />
              </div>
              <div class="form-group">
                <textarea v-model="currentInfosheet.description" class="form-control" rows="8" placeholder="စာကိုယ်"></textarea>
              </div>
              <div class="form-group">
                <label class="form-label float-left ml-2">Main Category</label>
                <select v-model="currentInfosheet.maincategory" multiple class="form-control">
                  <option v-for="category in mainCategories" :key="category.id" :value="category.id">{{ category.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label float-left ml-2">Subcategory</label>
                <select v-model="currentInfosheet.subcategory" multiple class="form-control">
                  <option v-for="subcategory in subCategories" :key="subcategory.id" :value="subcategory.id">{{ subcategory.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <input type="file" @change="onFileChangeEdit" class="form-control" placeholder="ဓာတ်ပုံ" />
              </div>
              <button type="submit" class="btn btn-primary float-left ml-2">ထည့်မည်</button>
            </form>
          </div>
          <div v-else>
            <h2 class="alert alert-info">Add News</h2>
            <form @submit.prevent="addInfosheet" enctype="multipart/form-data">
              <div class="form-group">
                <VueDatePicker v-model="newInfosheet.date" :style="{ width: '100%' }" :enable-time="false" class="form-control custom-datepicker" placeholder="ရက်စွဲ"/>
              </div>
              <div class="form-group">
                <input v-model="newInfosheet.headtitle" type="text" class="form-control" placeholder="ခေါင်းစီး" />
              </div>
              <div class="form-group">
                <textarea v-model="newInfosheet.description" class="form-control" rows="8" placeholder="စာကိုယ်"></textarea>
              </div>
              <div class="form-group">
                <label class="form-label float-left ml-2">Main Category</label>
                <select v-model="newInfosheet.maincategory" multiple class="form-control">
                  <option v-for="category in mainCategories" :key="category.id" :value="category.id">{{ category.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label float-left ml-2">Subcategory</label>
                <select v-model="newInfosheet.subcategory" multiple class="form-control">
                  <option v-for="subcategory in subCategories" :key="subcategory.id" :value="subcategory.id">{{ subcategory.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <input type="file" @change="onFileChange" class="form-control" placeholder="ဓာတ်ပုံ" />
              </div>
              <button type="submit" class="btn btn-primary float-left ml-2">ထည့်မည်</button>
            </form>
          </div>
        </div>
      </div>
      <Modal v-if="isModalVisible" :isVisible="isModalVisible" :photoSrc="modalPhoto" @close="closeModal"/>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';
  import Modal from './Modal.vue'; // Import the modal component
  
  export default {
    components: {
      VueDatePicker,
      Modal
    },
    data() {
      return {
        infosheets: [],
        startDate: null,
        endDate: null,
        keyword: '',
        isModalVisible: false,
        modalPhoto: '',
        mainCategories: [], // To store main categories
        subCategories: [], // To store all subcategories
        newInfosheet: {
          date: null,
          headtitle: '',
          description: '',
          photo: null, // Will hold the file object
          subcategory: [],
          maincategory: []
        },
        currentInfosheet: {} // To store the infosheet being edited
      };
    },
    computed: {
    mainCategoryMap() {
      const map = {};
      this.mainCategories.forEach(category => {
        map[category.id] = category.name;
      });
      return map;
    },
    subCategoryMap() {
      const map = {};
      this.subCategories.forEach(subcategory => {
        map[subcategory.id] = subcategory.name;
      });
      return map;
    }
  },
    created() {
      this.fetchInfosheets();
      this.fetchMainCategories(); // Fetch main categories on component creation
      this.fetchSubCategories(); // Fetch subcategories on component creation
    },
    methods: {
      async fetchInfosheets(startDate = null, endDate = null, keyword = null) {
        let url = 'http://127.0.0.1:8000/api/infosheet/';
        const params = new URLSearchParams();
  
        if (startDate) {
          params.append('start_date', startDate);
        }
        if (endDate) {
          params.append('end_date', endDate);
        }
        if (keyword) {
          params.append('keyword', keyword);
        }
  
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
  
        try {
          const response = await axios.get(url);
          this.infosheets = response.data;

          // Map maincategory IDs to their names
          // this.infosheets.forEach(info => {
          //   info.maincategory_name = this.getMainCategoryName(info.maincategory);
          // }
          // );
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
    //   getMainCategoryName(mainCategoryId) {
    //   const category = this.mainCategories.find(cat => cat.id === mainCategoryId);
    //   return category ? category.name : '';
    // },
      getMainCategoryName(ids) {
        if (!ids || ids.length === 0) {
          return 'Unknown';
        }
        return ids.map(id => this.mainCategoryMap[id] || 'Unknown').join(', ');
      },
      getSubCategoryName(ids) {
        if (!ids || ids.length === 0) {
          return 'Unknown';
        }
        return ids.map(id => this.subCategoryMap[id] || 'Unknown').join(', ');
      },
      searchByDateRange() {
        if (this.startDate && this.endDate) {
          const startDateFormat = this.startDate.toISOString().split('T')[0];
          const endDateFormat = this.endDate.toISOString().split('T')[0];
          this.fetchInfosheets(startDateFormat, endDateFormat, this.keyword);
        }
      },
      refreshPage() {
        this.startDate = null;
        this.endDate = null;
        this.keyword = '';
        this.fetchInfosheets();
      },
      onFileChange(event) {
        this.newInfosheet.photo = event.target.files[0];
      },
      onFileChangeEdit(event) {
        this.currentInfosheet.photo = event.target.files[0];
      },
      // addInfosheet
      async addInfosheet() {
  const formData = new FormData();
  
  const formattedDate = this.newInfosheet.date ? this.newInfosheet.date.toISOString().split('T')[0] : null;
  formData.append('date', formattedDate);
  formData.append('headtitle', this.newInfosheet.headtitle);
  formData.append('description', this.newInfosheet.description);
  formData.append('photo', this.newInfosheet.photo);
  // formData.append('maincategory', this.newInfosheet.maincategory);
  for (let maincategoryId of this.newInfosheet.maincategory) {
    formData.append('maincategory', maincategoryId);
  }

  // Append each selected subcategory ID
  for (let subcategoryId of this.newInfosheet.subcategory) {
    formData.append('subcategory', subcategoryId);
  }

  try {
    await axios.post('http://127.0.0.1:8000/api/infosheet/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    this.fetchInfosheets();
    this.newInfosheet = {
      date: null,
      headtitle: '',
      description: '',
      photo: null,
      maincategory: [],
      subcategory: [] // Reset to empty array after submission
    };
  } catch (error) {
    console.error('Error adding info sheet:', error);
  }
},
      async editBtn(id) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/infosheet/${id}/`);
          this.currentInfosheet = response.data;
          this.currentInfosheet.maincategory = [this.currentInfosheet.maincategory.id];
        this.currentInfosheet.subcategory = this.currentInfosheet.subcategory.map(subcat => subcat.id);
        } catch (error) {
          console.error('Error fetching info sheet for editing:', error);
        }
      },
      // updateInfosheet
      async updateInfosheet(id) {
    const formData = new FormData();
    
    let formattedDate = null;
    if (this.currentInfosheet.date) {
      if (this.currentInfosheet.date instanceof Date) {
        formattedDate = this.currentInfosheet.date.toISOString().split('T')[0];
      } else {
        formattedDate = new Date(this.currentInfosheet.date).toISOString().split('T')[0];
      }
    }
    
    formData.append('date', formattedDate);
    formData.append('headtitle', this.currentInfosheet.headtitle);
    formData.append('description', this.currentInfosheet.description);
    // formData.append('maincategory', this.currentInfosheet.maincategory);
    // formData.append('subcategory', this.currentInfosheet.subcategory);
    // Append each selected subcategory ID
    for (let maincategoryId of this.currentInfosheet.maincategory) {
        formData.append('maincategory', maincategoryId);
      }
    for (let subcategoryId of this.currentInfosheet.subcategory) {
        formData.append('subcategory', subcategoryId);
      }

    if (this.currentInfosheet.photo instanceof File) {
      formData.append('photo', this.currentInfosheet.photo);
    }

    try {
      await axios.put(`http://127.0.0.1:8000/api/infosheet/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      this.fetchInfosheets();
      this.currentInfosheet = {};
    } catch (error) {
      console.error('Error updating info sheet:', error);
    }
  },

      async deleteBtn(id) {
        if (confirm('Are you sure you want to delete this info sheet?')) {
          try {
            await axios.delete(`http://127.0.0.1:8000/api/infosheet/${id}/`);
            this.fetchInfosheets();
          } catch (error) {
            console.error('Error deleting info sheet:', error);
          }
        }
      },
      async fetchMainCategories() {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/maincategory/');
          this.mainCategories = response.data;
        } catch (error) {
          console.error('Error fetching main categories:', error);
        }
      },
      async fetchSubCategories() {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/subcategory/');
          this.subCategories = response.data;
        } catch (error) {
          console.error('Error fetching subcategories:', error);
        }
      },
      openModal(photo) {
        this.modalPhoto = photo;
        this.isModalVisible = true;
      },
      closeModal() {
        this.isModalVisible = false;
        this.modalPhoto = '';
      }
    }
  };
  </script>
  
  <style scoped>
  .container-fluid {
    padding: 2rem;
  }
  .form-container {
    margin-bottom: 1rem;
  }
  </style>
  