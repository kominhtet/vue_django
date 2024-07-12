<template>
  <div class="info-home container-fluid">
    <div class="row mt-4">
      <div class="col-lg-6 col-md-12">
        <h2 class="alert alert-success text-center">တိုင်းစစ်ဌာနချုပ်အလိုက် အကျိုးအမြတ်ရရှိမှုများ</h2>
        <div class="table-responsive">
          <table class="table table-bordered table-striped">
            <thead class="thead-dark">
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
              <tr class="font-weight-bold">
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
      <div class="col-lg-6 col-md-12">
        <h2 class="alert alert-success text-center">သတင်းမီဒီယာအလိုက်အနှစ်ချုပ်များ</h2>
        <div class="table-responsive">
          <table class="table table-bordered table-striped">
            <thead class="thead-dark">
              <tr>
                <th>Source</th>
                <th>သတင်းအမှား</th>
                <th>တစ်ဝက် မှား/မှန်</th>
                <th>သတင်းအမှန်</th>
                <th>စုစုပေါင်း</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(summary, source) in sourceCounts" :key="source">
                <td>{{ source }}</td>
                <td>{{ summary.false_news }}</td>
                <td>{{ summary.half_news }}</td>
                <td>{{ summary.true_news }}</td>
                <td class="table-primary">{{ summary.total }}</td>
              </tr>
              <tr class="font-weight-bold">
                <td></td>
                <td class="table-secondary">{{ counts.false_news }}</td>
                <td class="table-secondary">{{ counts.half_news }}</td>
                <td class="table-secondary">{{ counts.true_news }}</td>
                <td class="table-danger">{{ totalSum }}</td>
              </tr>
            </tbody>
          </table>
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
      factChecks: [],
      counts: {
        false_news: 0,
        half_news: 0,
        true_news: 0
      },
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
    this.fetchFactChecks();
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
    async fetchFactChecks(startDate = null, endDate = null) {
      `${api.API_URL}api/combat_news/`
      let url = 'http://127.0.0.1:8000/api/fact_check/';
      if (startDate && endDate) {
        url += `?start_date=${startDate}&end_date=${endDate}`;
      }
      try {
        const response = await axios.get(url);
        this.factChecks = response.data;
        this.calculateCounts();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    calculateCounts() {
      this.counts.false_news = this.factChecks.filter(fact => fact.false_news).length;
      this.counts.half_news = this.factChecks.filter(fact => fact.half_news).length;
      this.counts.true_news = this.factChecks.filter(fact => fact.true_news).length;

      const sourceCounts = {};
      let totalSum = 0;

      this.factChecks.forEach(fact => {
        if (!sourceCounts[fact.source]) {
          sourceCounts[fact.source] = {
            false_news: 0,
            half_news: 0,
            true_news: 0,
            total: 0
          };
        }
        if (fact.false_news) sourceCounts[fact.source].false_news++;
        if (fact.half_news) sourceCounts[fact.source].half_news++;
        if (fact.true_news) sourceCounts[fact.source].true_news++;
        sourceCounts[fact.source].total++;
        totalSum++;
      });

      this.sourceCounts = sourceCounts;
      this.totalSum = totalSum;
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

.alert {
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
}

.table-responsive {
  margin-bottom: 20px;
}

.table th, .table td {
  text-align: center;
  vertical-align: middle;
}

.table-secondary {
  font-weight: bold;
}

.table-primary {
  background-color: #cce5ff;
}

.table-danger {
  background-color: #f8d7da;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
  }

  .table th, .table td {
    white-space: nowrap;
  }
}
</style>
