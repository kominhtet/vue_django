<template>
  <div class="container-fluid">
    <h3 class="alert alert-success">Info_sheet</h3>
    <div class="form-container mb-3 row">
      <div class="col-md-2">
        <VueDatePicker v-model="startDate" :style="{ width: '100%' }" :enable-time="false" class="form-control" placeholder="Start Date" />
      </div>
      <div class="col-md-2">
        <VueDatePicker v-model="endDate" :style="{ width: '100%' }" :enable-time="false" class="form-control" placeholder="End Date" />
      </div>
      <div class="col-md-2">
        <input v-model="keyword" type="text" class="form-control" placeholder="Keyword" />
      </div>
      <div class="col-md-1">
        <button @click="searchByDateRange" class="btn btn-primary w-100">Search</button>
      </div>
      <div class="col-md-1">
        <button @click="refreshPage" class="btn btn-secondary">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
      <div class="col-md-1">
        <a href="/category" class="btn btn-primary">Add Category</a>
      </div>
      <div class="col-md-1">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" @click="addClick">Add News</button>
      </div>
      <div class="col-md-2">
        <p class="alert alert-success col-md-8">{{ infosheets.length }} founds</p>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <table class="table table-bordered mt-4">
          <thead>
            <tr>
              <th scope="col">စဉ်</th>
              <th scope="col">ရက်စွဲ</th>
              <th scope="col">သတင်းခေါင်းစဉ်</th>
              <th scope="col">သတင်းအကြောင်းအရာ</th>
              <th scope="col">သတင်းစာရက်စွဲ</th>
              <th scope="col">အနှစ်ချုပ်</th>
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
              <td style="text-align:left">{{ info.headtitle }}</td>
              <td style="text-align:left">{{ info.description }}</td>
              <td>{{ info.newsdate }}</td>
              <td style="text-align:left">{{ info.summary }}</td>
              <td>{{ getMainCategoryName(info.maincategory) }}</td>
              <td>{{ getSubCategoryName(info.subcategory) }}</td>
              <td><img :src="info.photo" alt="Info Photo" width="100" @click="openModal(info.photo)" /></td>
              <td>
                <button class="btn btn-warning btn-sm" @click="editBtn(info)">Edit</button>
              </td>
              <td>
                <button class="btn btn-danger btn-sm" @click="deleteBtn(info.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Modal v-if="isModalVisible" :isVisible="isModalVisible" :photoSrc="modalPhoto" @close="closeModal" />
  </div>

  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ modalTitle }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveInfosheet">
            <div class="row mb-3">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="date" class="form-label">Date</label>
                  <input type="date" class="form-control" id="date" v-model="currentInfosheet.date" required />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="newsdate" class="form-label">သတင်းစာရက်စွဲ</label>
                  <input type="date" class="form-control" id="newsdate" v-model="currentInfosheet.newsdate" required />
                </div>
              </div>
            </div>
            <div class="mb-3">
              <div class="form-group">
                <!-- <label for="headtitle" class="form-label">ခေါင်းစီး</label> -->
                <textarea id="headtitle" class="form-control" v-model="currentInfosheet.headtitle" rows="3" placeholder="သတင်းစာခေါင်းစဉ်" required></textarea>
              </div>
            </div>
            <div class="mb-3">
              <div class="form-group">
                <!-- <label for="description" class="form-label">အကြောင်းအရာ</label> -->
                <textarea id="description" class="form-control" v-model="currentInfosheet.description" rows="3" placeholder="သတင်းအကြောင်းအရာ" required></textarea>
              </div>
            </div>
            <div class="mb-3">
              <div class="form-group">
                <!-- <label for="summary" class="form-label">အနှစ်ချုပ်</label> -->
                <textarea id="summary" class="form-control" v-model="currentInfosheet.summary" rows="3" placeholder="အနှစ်ချုပ်" required></textarea>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="maincategory" class="form-label">Main Category</label>
                  <select id="maincategory" class="form-select" v-model="currentInfosheet.maincategory" multiple required>
                    <option v-for="category in mainCategories" :key="category.id" :value="category.id">{{ category.name }}</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="subcategory" class="form-label">Sub Category</label>
                  <select id="subcategory" class="form-select" v-model="currentInfosheet.subcategory" multiple required>
                    <option v-for="subcategory in subCategories" :key="subcategory.id" :value="subcategory.id">{{ subcategory.name }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="mb-3 text-center">
              <div class="form-group">
                <img v-if="currentInfosheet.photo" :src="photoPreview" alt="Preview" class="img-thumbnail mb-3" width="250" height="250" />
                <input type="file" class="form-control" id="photo" @change="onFileChange" />
              </div>
            </div>
            <div class="text-end">
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
</div>

</template>

<script>
import axios from 'axios';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import Modal from './Modal.vue'; // Import the modal component
import { Modal as BootstrapModal } from 'bootstrap'; // Import Bootstrap Modal
import api from './api';

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
      currentInfosheet: {
        id: null,
        date: null,
        headtitle: '',
        description: '',
        newsdate: '',
        summary: '',
        photo: null,
        subcategory: [], // Array to store selected subcategory IDs
        maincategory: [] // Array to store selected maincategory IDs
      },
      photoPreview: null, // For previewing selected photos
      mainCategoryMap: {}, // Map to store category names
      subCategoryMap: {}, // Map to store subcategory names
      modalTitle: ''
    };
  },
  async created() {
    await this.fetchInfosheets();
    await this.fetchMainCategories(); // Fetch main categories
    await this.fetchSubCategories(); // Fetch subcategories

    // Initialize mainCategoryMap and subCategoryMap
    this.mainCategories.forEach(category => {
      this.mainCategoryMap[category.id] = category.name;
    });

    this.subCategories.forEach(subcategory => {
      this.subCategoryMap[subcategory.id] = subcategory.name;
    });
  },
  methods: {
    async fetchInfosheets(startDate = null, endDate = null, keyword = '') {
      let url = `${api.API_URL}api/infosheet/`;
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (keyword) params.append('keyword', keyword);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      this.infosheets = response.data;
      this.infosheets.sort((a, b) => new Date(b.id) - new Date(a.id));
    },
    async fetchMainCategories() {
      const response = await axios.get(`${api.API_URL}api/maincategory/`);
      this.mainCategories = response.data;
    },
    async fetchSubCategories() {
      const response = await axios.get(`${api.API_URL}api/subcategory/`);
      this.subCategories = response.data;
    },
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
    addClick() {
      this.modalTitle = 'Add New Infosheet';
      this.currentInfosheet = {
        id: null,
        date: null,
        headtitle: '',
        description: '',
        newsdate: '',
        summary: '',
        photo: null,
        subcategory: [],
        maincategory: []
      };
      this.photoPreview = null;
    },
    editBtn(info) {
      this.modalTitle = 'Edit Infosheet';
      this.currentInfosheet = { ...info }; // Copy info to currentInfosheet
      this.photoPreview = info.photo; // Set photo preview
      const modalElement = document.getElementById('exampleModal');
      const modal = new BootstrapModal(modalElement); // Use Bootstrap Modal
      modal.show();
    },
    async saveInfosheet() {
      // Prepare FormData to handle file upload
      const formData = new FormData();
      formData.append('date', this.currentInfosheet.date);
      formData.append('headtitle', this.currentInfosheet.headtitle);
      formData.append('description', this.currentInfosheet.description);
      formData.append('newsdate', this.currentInfosheet.newsdate);
      formData.append('summary', this.currentInfosheet.summary);
      // Append maincategory IDs
      this.currentInfosheet.maincategory.forEach(id => {
        formData.append('maincategory', id);
      });

      // Append subcategory IDs
      this.currentInfosheet.subcategory.forEach(id => {
        formData.append('subcategory', id);
      });
      formData.append('photo', this.currentInfosheet.photo);
      // Check if photo exists before appending
      // if (this.currentInfosheet.photo) {
      //   formData.append('photo', this.currentInfosheet.photo);
      // }

      // Determine whether to add or update based on the presence of ID
      let method = 'post';
      let url = `${api.API_URL}api/infosheet/`;
      if (this.currentInfosheet.id) {
        method = 'patch'; // Use 'patch' for partial updates
        url += `${this.currentInfosheet.id}/`;
      }

      try {
        // Make the request
        await axios({
          method: method,
          url: url,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Fetch updated infosheets after successful save/update
        await this.fetchInfosheets();
        
        // Close the modal
        this.closeModal();
      } catch (error) {
        console.error('Error saving infosheet:', error);
      }
    },
    async addInfosheet() {
      const formData = new FormData();
      for (const key in this.currentInfosheet) {
        if (key === 'photo' && this.currentInfosheet.photo) {
          formData.append(key, this.currentInfosheet.photo);
        } else if (key === 'maincategory' || key === 'subcategory') {
          // Handle array fields like maincategory and subcategory
          this.currentInfosheet[key].forEach(item => {
            formData.append(`${key}`, item); // Assuming item is an ID
          });
        } else {
          formData.append(key, this.currentInfosheet[key]);
        }
      }

      try {
        const response = await axios.post(`${api.API_URL}api/infosheet/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.infosheets.push(response.data);
        const modalElement = document.getElementById('exampleModal');
        const modal = new BootstrapModal(modalElement);
        modal.hide();
        this.fetchInfosheets();
      } catch (error) {
        console.error('Error adding infosheet:', error);
      }
    },
    async editInfosheet() {
      try {
        const formData = new FormData();

        // Append all fields to FormData
        for (const key in this.currentInfosheet) {
          if (key === 'maincategory' || key === 'subcategory') {
            // Handle array fields like maincategory and subcategory
            this.currentInfosheet[key].forEach(item => {
              formData.append(`${key}`, item.id); // Append only the ID
            });
          } else if (key === 'photo' && !(this.currentInfosheet.photo instanceof File)) {
            // Skip appending photo if it's not a File (i.e., it's a string or null)
            continue;
          } else {
            formData.append(key, this.currentInfosheet[key]);
          }
        }

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
        formData.append('newsdate', this.currentInfosheet.newsdate);
        formData.append('summary', this.currentInfosheet.summary);
        // Append each selected maincategory ID
        for (let maincategoryId of this.currentInfosheet.maincategory) {
          formData.append('maincategory', maincategoryId);
        }

        // Append each selected subcategory ID
        for (let subcategoryId of this.currentInfosheet.subcategory) {
          formData.append('subcategory', subcategoryId);
        }
        formData.append('photo', this.currentInfosheet.photo);
        // Append photo if it's a File
        // if (this.currentInfosheet.photo instanceof File) {
        //   formData.append('photo', this.currentInfosheet.photo);
        // }

        // Make the PUT request
        const response = await axios.put(`${api.API_URL}api/infosheet/${this.currentInfosheet.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'  // Ensure the header is set correctly
          }
        });

        // Handle successful response
        const modalElement = document.getElementById('exampleModal');
        const modal = new BootstrapModal(modalElement);
        modal.hide();
        this.fetchInfosheets();
      } catch (error) {
        console.error('Error editing infosheet:', error.response ? error.response.data : error.message);
        // Optionally handle specific server response errors here
      }
    },
    async deleteBtn(id) {
      if (confirm('Are you sure you want to delete this infosheet?')) {
        await axios.delete(`${api.API_URL}api/infosheet/${id}/`);
        this.fetchInfosheets();
      }
    },
    async searchByDateRange() {
      const startDate = this.startDate ? this.startDate.toISOString().split('T')[0] : null;
      const endDate = this.endDate ? this.endDate.toISOString().split('T')[0] : null;
      await this.fetchInfosheets(startDate, endDate, this.keyword);
    },
    async refreshPage() {
      this.startDate = null;
      this.endDate = null;
      this.keyword = '';
      await this.fetchInfosheets();
    },
    onFileChange(event) {      
      const file = event.target.files[0];
      if (file) {
        this.currentInfosheet.photo = file;
        this.photoPreview = URL.createObjectURL(file);
      }
    },
    openModal(photoSrc) {
      this.modalPhoto = photoSrc;
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    }
  }
};
</script>


<style>
.container-fluid {
  margin-top: 20px;
}

.table {
  margin-top: 20px;
}

.img-thumbnail {
  display: block;
  margin: 0 auto;
}

.modal-dialog-centered {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
