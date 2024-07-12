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
      သတင်းပုဒ်ရေစုစုပေါင်း ({{ infosheets.length }}) ခုတွေ့ရှိပါသည်။
    </p>
    <!-- <div v-if="searchClicked" class="data-display">
      <div class="row mt-4">
          <div class="col-md-6" v-if="!keyword">
            <h4 class="alert alert-success">တိုင်းစစ်ဌာနချုပ်အလိုက် အကျိုးအမြတ်ရရှိမှုများ</h4>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>တိုင်း</th>
                  <th>သေ</th>
                  <th>ရှင်</th>
                  <th>အလင်းဝင်</th>
                  <th>လက်နက်ငယ်</th>
                  <th>လက်နက်ကြီး</th>
                  <th>ကျည်မျိုးစုံ</th>
                  <th>ဗုံးသီး</th>
                  <th>မိုင်း</th>
                  <th>ဆက်စပ်</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, headq) in summaryByHeadq" :key="headq">
                  <td>{{ headq }}</td>
                  <td>{{ data.dead }}</td>
                  <td>{{ data.live }}</td>
                  <td>{{ data.alinn }}</td>
                  <td>{{ data.small }}</td>
                  <td>{{ data.big }}</td>
                  <td>{{ data.bullet }}</td>
                  <td>{{ data.bomb }}</td>
                  <td>{{ data.mine }}</td>
                  <td>{{ data.accessory }}</td>
                </tr>
                <tr>
                  <td class="table-secondary">စုစုပေါင်း</td>
                  <td class="table-secondary">{{ summary.dead }}</td>
                  <td class="table-secondary">{{ summary.live }}</td>
                  <td class="table-secondary">{{ summary.alinn }}</td>
                  <td class="table-secondary">{{ summary.small }}</td>
                  <td class="table-secondary">{{ summary.big }}</td>
                  <td class="table-secondary">{{ summary.bullet }}</td>
                  <td class="table-secondary">{{ summary.bomb }}</td>
                  <td class="table-secondary">{{ summary.mine }}</td>
                  <td class="table-secondary">{{ summary.accessory }}</td>
                </tr>
              </tbody>
            </table>
          </div>
      </div>
    </div> -->
    <div class="row">
      <!-- Combat News Table -->
      <div class="col-lg-8 col-md-12 mb-4">
        <h4 class="alert alert-success text-center">တိုက်ပွဲသတင်းများ</h4>
        <table class="table table-bordered table-striped table-hover mt-4">
          <thead class="thead-dark">
            <tr>
              <th scope="col">စဉ်</th>
              <th scope="col">ရက်စွဲ</th>
              <th scope="col">သတင်းခေါင်းစဉ်</th>
              <th scope="col">မြို့နယ်</th>
              <th scope="col">တိုင်းစစ်ဌာနချုပ်</th>
              <th scope="col">သေ</th>
              <th scope="col">ရှင်</th>
              <th scope="col">အလင်းဝင်</th>
              <th scope="col">လက်နက်ငယ်</th>
              <th scope="col">လက်နက်ကြီး</th>
              <th scope="col">ကျည်မျိုးစုံ</th>
              <th scope="col">ဗုံးသီး</th>
              <th scope="col">မိုင်း</th>
              <th scope="col">ဆက်စပ်ပစ္စည်း</th>
              <th scope="col">ဓာတ်ပုံများ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(info, index) in infosheets" :key="info.id">
              <td>{{ index + 1 }}</td>
              <td>{{ info.date }}</td>
              <td class="text-left">{{ info.description }}</td>
              <td>{{ info.township }}</td>
              <td>{{ info.headq }}</td>
              <td>{{ info.dead }}</td>
              <td>{{ info.live }}</td>
              <td>{{ info.alinn }}</td>
              <td>{{ info.small }}</td>
              <td>{{ info.big }}</td>
              <td>{{ info.bullet }}</td>
              <td>{{ info.bomb }}</td>
              <td>{{ info.mine }}</td>
              <td>{{ info.accessory }}</td>
              <td>
                <img :src="info.photo" alt="Info Photo" class="img-thumbnail" width="100" @click="openModal(info.photo)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add New Combat News Form -->
      <div class="col-lg-4 col-md-12 mb-4">
        <h4 class="alert alert-info text-center">သတင်းအသစ်ထည့်ရန်</h4>
        <form @submit.prevent="addCombatnews" enctype="multipart/form-data">
          <div class="form-group">
            <!-- <label for="date" class="form-label">ရက်စွဲ</label> -->
            <VueDatePicker v-model="newCombatnews.date" class="form-control" placeholder="Enter Date" />
          </div>
          <div class="form-group">
            <!-- <label for="description" class="form-label">အကြောင်းအရာ</label> -->
            <textarea v-model="newCombatnews.description" class="form-control" name="" id="" placeholder="အကြောင်းအရာ" required></textarea>
            <!-- <input v-model="newCombatnews.description" type="text" class="form-control" placeholder="အကြောင်းအရာ" /> -->
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <!-- <label for="township" class="form-label">မြို့နယ်</label> -->
              <input v-model="newCombatnews.township" type="text" class="form-control" placeholder="မြို့နယ်" />
            </div>
            <div class="form-group col-md-6">
              <!-- <label for="headq" class="form-label">တိုင်းစစ်ဌာနချုပ်</label> -->
              <input v-model="newCombatnews.headq" type="text" class="form-control" placeholder="တိုင်းစစ်ဌာနချုပ်" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-4">
              <label for="dead" class="form-label">သေ</label>
              <input v-model="newCombatnews.dead" type="number" class="form-control" placeholder="Dead" />
            </div>
            <div class="form-group col-md-4">
              <label for="live" class="form-label">ရှင်</label>
              <input v-model="newCombatnews.live" type="number" class="form-control" placeholder="Live" />
            </div>
            <div class="form-group col-md-4">
              <label for="alinn" class="form-label">အလင်းဝင်</label>
              <input v-model="newCombatnews.alinn" type="number" class="form-control" placeholder="Alinn" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-4">
              <label for="small" class="form-label">လက်နက်ငယ်</label>
              <input v-model="newCombatnews.small" type="number" class="form-control" placeholder="Small Weapons" />
            </div>
            <div class="form-group col-md-4">
              <label for="big" class="form-label">လက်နက်ကြီး</label>
              <input v-model="newCombatnews.big" type="number" class="form-control" placeholder="Big Weapons" />
            </div>
            <div class="form-group col-md-4">
              <label for="bullet" class="form-label">ကျည်မျိုးစုံ</label>
              <input v-model="newCombatnews.bullet" type="number" class="form-control" placeholder="Bullets" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-4">
              <label for="bomb" class="form-label">ဗုံးသီး</label>
              <input v-model="newCombatnews.bomb" type="number" class="form-control" placeholder="Bombs" />
            </div>
            <div class="form-group col-md-4">
              <label for="mine" class="form-label">မိုင်း</label>
              <input v-model="newCombatnews.mine" type="number" class="form-control" placeholder="Mines" />
            </div>
            <div class="form-group col-md-4">
            <label for="accessory" class="form-label">ဆက်စပ်ပစ္စည်း</label>
            <input v-model="newCombatnews.accessory" type="text" class="form-control" placeholder="Accessories" />
          </div>
          </div>
          <div class="form-group">
            <label for="photo" class="form-label">ဓာတ်ပုံများ</label>
            <input type="file" @change="onFileChange" class="form-control-file" />
          </div>
          <button type="submit" class="btn btn-primary btn-block">Add</button>
        </form>

        <!-- Upload Excel File -->
        <div class="form-group mt-4">
          <h4 class="alert alert-info text-center">Upload Excel File</h4>
          <input type="file" class="form-control-file" @change="onFileChange($event)" />
          <button class="btn btn-primary btn-block mt-2" @click="uploadFile">Upload</button>
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
import * as XLSX from 'xlsx';
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
      newCombatnews: {
        date: null,
        description: '',
        township: '',
        headq: '',
        dead: 0,
        live: 0,
        alinn: 0,
        small: 0,
        big: 0,
        bullet: 0,
        bomb: 0,
        mine: 0,
        accessory: 0,
        photo: null
      },
      xlsxFile: null,
      searchClicked: false  // Track if search button has been clicked
    };
  },
  created() {
    this.fetchInfosheets();
  },
  methods: {
    async fetchInfosheets(startDate = null, endDate = null, keyword = null) {
      let url = `${api.API_URL}api/combat_news/`;
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
        this.searchClicked = true;  // Set flag to true after search
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    searchByDateRange() {
      const startDateFormat = this.startDate ? this.startDate.toISOString().split('T')[0] : null;
      const endDateFormat = this.endDate ? this.endDate.toISOString().split('T')[0] : null;
      this.fetchInfosheets(startDateFormat, endDateFormat, this.keyword);
    },
    refreshPage() {
      this.startDate = null;
      this.endDate = null;
      this.keyword = '';
      this.infosheets = [];
      this.searchClicked = false;  // Reset flag when refresh is clicked
    },
    openModal(photo) {
      this.modalPhoto = photo;
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    onFileChange(event) {
      this.newCombatnews.photo = event.target.files[0];
      this.xlsxFile = event.target.files[0];
    },
    async addCombatnews() {
      const formData = new FormData();
      formData.append('date', this.newCombatnews.date ? this.newCombatnews.date.toISOString().split('T')[0] : '');
      formData.append('description', this.newCombatnews.description);
      formData.append('township', this.newCombatnews.township);
      formData.append('headq', this.newCombatnews.headq);
      formData.append('dead', this.newCombatnews.dead);
      formData.append('live', this.newCombatnews.live);
      formData.append('alinn', this.newCombatnews.alinn);
      formData.append('small', this.newCombatnews.small);
      formData.append('big', this.newCombatnews.big);
      formData.append('bullet', this.newCombatnews.bullet);
      formData.append('bomb', this.newCombatnews.bomb);
      formData.append('mine', this.newCombatnews.mine);
      formData.append('accessory', this.newCombatnews.accessory);
      formData.append('photo', this.newCombatnews.photo);
      try {
        const response = await axios.post(`${api.API_URL}api/combat_news/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.infosheets.push(response.data);
        this.newCombatnews = {
          date: null,
          description: '',
          township: '',
          headq: '',
          dead: 0,
          live: 0,
          alinn: 0,
          small: 0,
          big: 0,
          bullet: 0,
          bomb: 0,
          mine: 0,
          accessory: 0,
          photo : null
        };
      } catch (error) {
        console.error('Error adding combatnews:', error);
      }
    },
    uploadFile() {
    if (!this.xlsxFile) {
        alert("Please select a file first.");
        return;
    }

    let reader = new FileReader();
    reader.onload = async (e) => {
        try {
            let data = new Uint8Array(e.target.result);
            let workbook = XLSX.read(data, { type: 'array' });
            let firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            let excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            let combatNews = excelData.slice(1).map(row => ({
                date: this.formatDate(row[0]),
                description: row[1],
                township: row[2],
                headq: row[3],
                dead: parseInt(row[4]) || 0,
                live: parseInt(row[5]) || 0,
                alinn: parseInt(row[6]) || 0,
                small: parseInt(row[7]) || 0,
                big: parseInt(row[8]) || 0,
                bullet: parseInt(row[9]) || 0,
                bomb: parseInt(row[10]) || 0,
                mine: parseInt(row[11]) || 0,
                accessory: row[12] || 0,
            }));
            const response = await axios.post(`${api.API_URL}api/bulk-upload/`, combatNews);
            console.log(response.data);
            this.fetchInfosheets(); // Refresh the combat news list after upload
            alert("Upload successful!");
        } catch (error) {
            console.error("There was an error uploading the file!", error);
            alert("There was an error uploading the file. Please check the console for details.");
        }
    };
    reader.onerror = (error) => {
        console.error("There was an error reading the file!", error);
        alert("There was an error reading the file. Please check the console for details.");
    };
    reader.readAsArrayBuffer(this.xlsxFile);
},

    formatDate(dateStr) {
        const parts = dateStr.split('.');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        return dateStr; // return original if the format is unexpected
    }
  },
  computed: {
    summaryByHeadq() {
      return this.infosheets.reduce((acc, info) => {
        if (!acc[info.headq]) {
          acc[info.headq] = {
            dead: 0,
            live: 0,
            alinn: 0,
            small: 0,
            big: 0,
            bullet: 0,
            bomb: 0,
            mine: 0,
            accessory: 0
          };
        }
        acc[info.headq].dead += info.dead;
        acc[info.headq].live += info.live;
        acc[info.headq].alinn += info.alinn;
        acc[info.headq].small += info.small;
        acc[info.headq].big += info.big;
        acc[info.headq].bullet += info.bullet;
        acc[info.headq].bomb += info.bomb;
        acc[info.headq].mine += info.mine;
        acc[info.headq].accessory += info.accessory;
        return acc;
      }, {});
    },
    summary() {
      return this.infosheets.reduce((acc, info) => {
        acc.dead += info.dead;
        acc.live += info.live;
        acc.alinn += info.alinn;
        acc.small += info.small;
        acc.big += info.big;
        acc.bullet += info.bullet;
        acc.bomb += info.bomb;
        acc.mine += info.mine;
        acc.accessory += info.accessory;
        return acc;
      }, {
        dead: 0,
        live: 0,
        alinn: 0,
        small: 0,
        big: 0,
        bullet: 0,
        bomb: 0,
        mine: 0,
        accessory: 0
      });
    }
  },
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
