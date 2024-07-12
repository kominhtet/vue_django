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
              <select v-model="currentInfosheet.maincategory" class="form-control" @change="onEditMainCategoryChange">
                <option v-for="category in mainCategories" :key="category.id" :value="category.id">{{ category.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label float-left ml-2">Subcategory</label>
              <select v-model="currentInfosheet.subcategory" class="form-control">
                <option v-for="subcategory in filteredEditSubCategories" :key="subcategory.id" :value="subcategory.id">{{ subcategory.name }}</option>
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
              <select v-model="newInfosheet.maincategory" class="form-control" @change="onMainCategoryChange">
                <option v-for="category in mainCategories" :key="category.id" :value="category.id">{{ category.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label float-left ml-2">Subcategory</label>
              <select v-model="newInfosheet.subcategory" class="form-control">
                <option v-for="subcategory in filteredSubCategories" :key="subcategory.id" :value="subcategory.id">{{ subcategory.name }}</option>
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
      filteredSubCategories: [], // To store filtered subcategories based on selected main category
      filteredEditSubCategories: [], // To store filtered subcategories for edit form
      newInfosheet: {
        date: null,
        headtitle: '',
        description: '',
        photo: null, // Will hold the file object
        subcategory: null,
        maincategory: null
      },
      currentInfosheet: {} // To store the infosheet being edited
    };
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
    url += `?${params.toString()}`; // <-- Fix syntax here
  }

  try {
    const response = await axios.get(url);
    this.infosheets = response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
},
    searchByDateRange() {
      if (this.startDate && this.endDate) {
        const startDateFormat = this.startDate.toISOString().split('T')[0];
        const endDateFormat = this.endDate.toISOString().split('T')[0];
        this.fetchInfosheets(startDateFormat, endDateFormat, this.keyword);
      } else {
        alert('Please select both start and end dates.');
      }
    },
    refreshPage() {
      this.startDate = null;
      this.endDate = null;
      this.keyword = '';
      this.results = [];
      this.searchClicked = false; // Reset flag when refresh is clicked
    },
    openModal(photo) {
      this.modalPhoto = photo;
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    onMainCategoryChange() {
      this.filteredSubCategories = this.subCategories.filter(subCategory => subCategory.maincategory === this.newInfosheet.maincategory);
    },
    onEditMainCategoryChange() {
      this.filteredEditSubCategories = this.subCategories.filter(subCategory => subCategory.maincategory === this.currentInfosheet.maincategory);
    },
    onFileChange(event) {
      const file = event.target.files[0];
      this.newInfosheet.photo = file;
    },
    onFileChangeEdit(event) {
      const file = event.target.files[0];
      this.currentInfosheet.photo = file;
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
    async addInfosheet() {
  const formData = new FormData();

  // Validate required fields before proceeding
  if (!this.newInfosheet.maincategory || !this.newInfosheet.subcategory || !this.newInfosheet.photo) {
    console.error('Main category, subcategory, or photo is not set.');
    return; // Exit function if any required fields are missing
  }

  const formattedDate = this.newInfosheet.date.toISOString().split('T')[0];
  const mainCategoryId = parseInt(this.newInfosheet.maincategory);
  const subCategoryId = parseInt(this.newInfosheet.subcategory);

  console.log('Date:', formattedDate);
  console.log('Main Category ID:', mainCategoryId);
  console.log('Subcategory ID:', subCategoryId);

  formData.append('date', formattedDate);
  formData.append('headtitle', this.newInfosheet.headtitle);
  formData.append('description', this.newInfosheet.description);
  formData.append('photo', this.newInfosheet.photo);
  formData.append('maincategory', mainCategoryId); // Ensure integer value
  formData.append('subcategory', subCategoryId); // Ensure integer value

  try {
    await axios.post('http://127.0.0.1:8000/api/infosheet/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    this.fetchInfosheets(); // Refresh infosheets after successful addition
    this.newInfosheet = {  // Clear form fields after successful addition
      date: null,
      headtitle: '',
      description: '',
      photo: null,
      subcategory: null,
      maincategory: null
    };
  } catch (error) {
    console.error('Error adding infosheet:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    // Handle error gracefully (e.g., show an alert)
  }
},
    editBtn(infoId) {
      const infosheet = this.infosheets.find(info => info.id === infoId);
      if (infosheet) {
        this.currentInfosheet = { ...infosheet };
        this.onEditMainCategoryChange(); // Update the filtered subcategories when editing an infosheet
      }
    },
    async updateInfosheet(id) {
  const formData = new FormData();
  formData.append('date', this.currentInfosheet.date);
  formData.append('headtitle', this.currentInfosheet.headtitle);
  formData.append('description', this.currentInfosheet.description);
  if (this.currentInfosheet.photo) {
    formData.append('photo', this.currentInfosheet.photo);
  }
  formData.append('subcategory', this.currentInfosheet.subcategory);
  formData.append('maincategory', this.currentInfosheet.maincategory); // Add maincategory to form data

  try {
    await axios.put(`http://127.0.0.1:8000/api/infosheet/${id}/`, formData, { // Corrected interpolation here
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    this.fetchInfosheets();
    this.currentInfosheet = {};
  } catch (error) {
    console.error('Error updating infosheet:', error);
  }
},

async deleteBtn(id) {
  if (confirm('Are you sure you want to delete this infosheet?')) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/infosheet/${id}/`);
      this.fetchInfosheets();
    } catch (error) {
      console.error('Error deleting infosheet:', error);
    }
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

.table {
  margin-top: 20px;
}

.alert-info {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}
</style>

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
      <div class="col-md-auto text-md-end mt-2 mt-md-0">
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
              <th scope="col">Main Category</th>
              <th scope="col">Sub Category</th>
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
              <td>{{ getMainCategoryName(info.maincategory) }}</td>
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
        <div v-if="Object.keys(currentInfosheet).length !== 0">
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
              <select v-model="currentInfosheet.maincategory" class="form-control">
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
      mainCategories: [],
      subCategories: [],
      newInfosheet: {
        date: null,
        headtitle: '',
        description: '',
        photo: null,
        subcategory: [],
        maincategory: [],
        subCategoryMap: {}
      },
      currentInfosheet: {}
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
    this.fetchMainCategories();
    this.fetchSubCategories();
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
      } catch (error) {
        console.error(error);
      }
    },
    async fetchMainCategories() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/maincategory/');
        this.mainCategories = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchSubCategories() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/subcategory/');
        this.subCategories = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    getMainCategoryName(id) {
      return this.mainCategoryMap[id] || 'Unknown';
    },
    getSubCategoryName(ids) {
  if (!ids || ids.length === 0) {
    return 'Unknown';
  }
  return ids.map(id => this.subCategoryMap[id] || 'Unknown').join(', ');
},
    async addInfosheet() {
      const formData = new FormData();
      formData.append('date', this.newInfosheet.date);
      formData.append('headtitle', this.newInfosheet.headtitle);
      formData.append('description', this.newInfosheet.description);
      formData.append('photo', this.newInfosheet.photo);
      formData.append('subcategory', this.newInfosheet.subcategory);
      formData.append('maincategory', this.newInfosheet.maincategory);

      try {
        await axios.post('http://127.0.0.1:8000/api/infosheet/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.fetchInfosheets();
        this.resetForm();
      } catch (error) {
        console.error(error);
      }
    },
    resetForm() {
      this.newInfosheet = {
        date: null,
        headtitle: '',
        description: '',
        photo: null,
        subcategory: [],
        maincategory: []
      };
    },
    onFileChange(event) {
      this.newInfosheet.photo = event.target.files[0];
    },
    async editBtn(id) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/infosheet/${id}/`);
        this.currentInfosheet = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async updateInfosheet(id) {
  const formData = new FormData();
  formData.append('date', this.currentInfosheet.date);
  formData.append('headtitle', this.currentInfosheet.headtitle);
  formData.append('description', this.currentInfosheet.description);
  // Append photo if it exists
  if (this.currentInfosheet.photo) {
    formData.append('photo', this.currentInfosheet.photo);
  }
  
  // Append maincategory as single value
  formData.append('maincategory', this.currentInfosheet.maincategory);
  
  // Append subcategory as an array of IDs
  this.currentInfosheet.subcategory.forEach(subcategoryId => {
    formData.append('subcategory', subcategoryId);
  });

  try {
    await axios.put(`http://127.0.0.1:8000/api/infosheet/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    this.fetchInfosheets();
    this.currentInfosheet = {}; // Clear currentInfosheet after update
  } catch (error) {
    console.error(error);
  }
}
,
    onFileChangeEdit(event) {
      this.currentInfosheet.photo = event.target.files[0];
    },
    async deleteBtn(id) {
      if (confirm('Are you sure you want to delete this infosheet?')) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/infosheet/${id}/`);
          this.fetchInfosheets();
        } catch (error) {
          console.error(error);
        }
      }
    },
    openModal(photoSrc) {
      this.modalPhoto = photoSrc;
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.modalPhoto = '';
    },
    async searchByDateRange() {
      const formattedStartDate = this.startDate ? this.startDate.toISOString().split('T')[0] : null;
      const formattedEndDate = this.endDate ? this.endDate.toISOString().split('T')[0] : null;
      this.fetchInfosheets(formattedStartDate, formattedEndDate, this.keyword);
    },
    refreshPage() {
      this.startDate = null;
      this.endDate = null;
      this.keyword = '';
      this.fetchInfosheets();
    }
  }
};
</script>

<style scoped>
  .custom-datepicker input {
    width: 100%;
  }
</style>
