<template>
  <div class="container-fluid">
    <h4 class="alert alert-success">တိုင်းစစ်ဌာနချုပ်အလိုက် အကျိုးအမြတ်ရရှိမှုများ</h4>
    <div class="form-container mb-3 row">
      <div class="col-md-2">
        <VueDatePicker v-model="startDate" :style="{ width: '100%' }" :enable-time="false" class="form-control" placeholder="Start Date"/>
      </div>
      <div class="col-md-2">
        <VueDatePicker v-model="endDate" :style="{ width: '100%' }" :enable-time="false" class="form-control" placeholder="End Date"/>
      </div>
      <div class="col-md-1">
        <button @click="searchByDateRange" class="btn btn-primary w-100">Search</button>
      </div>
      <div class="col-md-1">
        <button @click="refreshPage" class="btn btn-secondary">
          <i class="fas fa-sync-alt"></i> Refresh
        </button>
      </div>
    </div> 
    <div class="data-display" v-if="searchClicked">
      <!-- တိုင်းစစ်ဌာနချုပ်အလိုက် အကျိုးအမြတ်ရရှိမှုများ -->
      <div class="row mt-4">
        <div class="col-md-12">
          <BarChart :data="summaryByHeadq" />
        </div>  
      </div>
      <div class="row mt-4">
        <div class="col-md-12" v-if="!keyword">
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
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import VueDatePicker from '@vuepic/vue-datepicker';
import BarChart from './BarChart.vue';

export default {
  components: {
    VueDatePicker,
    BarChart
  },
  data() {
    return {
      startDate: '',
      endDate: '',
      keyword: '',
      summaryByHeadq: {},
      summary: {
        dead: 0,
        live: 0,
        alinn: 0,
        small: 0,
        big: 0,
        bullet: 0,
        bomb: 0,
        mine: 0,
        accessory: 0
      },
      searchClicked: false
    };
  },
  computed: {
    startDateFormat() {
      return this.startDate ? this.startDate.toISOString().split('T')[0] : '';
    },
    endDateFormat() {
      return this.endDate ? this.endDate.toISOString().split('T')[0] : '';
    }
  },
  methods: {
    async searchByDateRange() {
      this.searchClicked = false;
      try {
        const formattedStartDate = this.startDateFormat;
        const formattedEndDate = this.endDateFormat;

        const response = await axios.get('http://127.0.0.1:8000/api/combat_news/', {
          params: {
            start_date: formattedStartDate,
            end_date: formattedEndDate
          }
        });

        const data = response.data;

        // Reset summaries
        this.summaryByHeadq = {};
        this.resetSummary();

        data.forEach(item => {
          const headq = item.headq;
          if (!this.summaryByHeadq[headq]) {
            this.summaryByHeadq[headq] = {
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

          this.summaryByHeadq[headq].dead += item.dead;
          this.summaryByHeadq[headq].live += item.live;
          this.summaryByHeadq[headq].alinn += item.alinn;
          this.summaryByHeadq[headq].small += item.small;
          this.summaryByHeadq[headq].big += item.big;
          this.summaryByHeadq[headq].bullet += item.bullet;
          this.summaryByHeadq[headq].bomb += item.bomb;
          this.summaryByHeadq[headq].mine += item.mine;
          this.summaryByHeadq[headq].accessory += item.accessory;

          // Update overall summary
          this.summary.dead += item.dead;
          this.summary.live += item.live;
          this.summary.alinn += item.alinn;
          this.summary.small += item.small;
          this.summary.big += item.big;
          this.summary.bullet += item.bullet;
          this.summary.bomb += item.bomb;
          this.summary.mine += item.mine;
          this.summary.accessory += item.accessory;
        });

        this.searchClicked = true;
      } catch (error) {
        console.error('Error fetching data:', error);
        console.error('Response:', error.response);
      }
    },
    resetSummary() {
      this.summary = {
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
    },
    refreshPage() {
      this.startDate = null;
      this.endDate = null;
      this.keyword = '';
      this.summaryByHeadq = {};
      this.resetSummary();
      this.searchClicked = false;  // Reset flag when refresh is clicked
    },
  },
  
};
</script>

<style scoped>
.container-fluid {
  padding: 20px;
}

.form-container {
  margin-bottom: 20px;
}

.data-display {
  margin-top: 20px;
}

.table {
  margin-bottom: 20px;
}
</style>
