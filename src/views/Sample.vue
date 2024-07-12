<template>
  <div class="form-container mb-3 row">
    <div class="col-md-2">
      <VueDatePicker v-model="startDate" :style="{ width: '100%' }" :enable-time="false" class="form-control" placeholder="Start Date"/>
    </div>
    <div class="col-md-2">
      <VueDatePicker v-model="endDate" :style="{ width: '100%' }" :enable-time="false" class="form-control" placeholder="End Date"/>
    </div>
    <div class="col-md-2">
      <button @click="searchByDateRange" class="btn btn-primary w-100">Search</button>
    </div>
  </div>
  <div>
    <h3 class="alert alert-info text-center">တိုင်းစစ်ဌာနချုပ်အလိုက်အကျိုးအမြတ်ရရှိမှုများ</h3>
    <div class="charts">
      <Bar v-if="isDataLoaded && chartData && chartData.labels.length" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import VueDatePicker from '@vuepic/vue-datepicker';
Chart.register(...registerables);

export default {
  components: {
    Bar,
    VueDatePicker
  },
  setup(props) {
    const isDataLoaded = ref(false);
    const chartData = reactive({
      labels: [
        'သေ',
        'ရှင်',
        'အလင်းဝင်',
        'လက်နက်ငယ်',
        'လက်နက်ကြီး',
        'ကျည်မျိုးစုံ',
        'ဗုံးသီး',
        'မိုင်း',
        'ဆက်စပ်'
      ],
      datasets: []
    });

    const chartOptions = reactive({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: false,
          ticks: {
            autoSkip: false
          }
        },
        y: {
          stacked: false
        }
      }
    });

    const startDate = ref(null);
    const endDate = ref(null);

    const fetchData = async (start, end) => {
      try {
        const formattedStartDate = start ? start.toISOString().split('T')[0] : null;
        const formattedEndDate = end ? end.toISOString().split('T')[0] : null;

        console.log('Fetching data with dates:', formattedStartDate, formattedEndDate);

        const response = await axios.get('http://127.0.0.1:8000/api/combat_news/', {
          params: {
            start_date: formattedStartDate,
            end_date: formattedEndDate
          }
        });

        const data = response.data;
        console.log('Response data:', data);

        // Process data to format it for the chart using processDataForChart
        const updatedData = processDataForChart(data);

        // Assign updatedData to chartData.datasets
        chartData.datasets = updatedData;

        console.log('Updated chartData:', chartData);

        isDataLoaded.value = true;
      } catch (error) {
        console.error('Error fetching data:', error);
        console.error('Response:', error.response);
      }
    };

    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    const searchByDateRange = () => {
      fetchData(startDate.value, endDate.value);
    };

    const processDataForChart = (data) => {
      // Initialize an object to store sums for each headq
      const sums = {};

      // Iterate over data and sum values for each headq
      data.forEach(item => {
        const headq = item.headq;
        if (!sums[headq]) {
          sums[headq] = Array(chartData.labels.length).fill(0); // Initialize array with zeroes for each headq
        }
        sums[headq][0] += item.dead;
        sums[headq][1] += item.live;
        sums[headq][2] += item.alinn;
        sums[headq][3] += item.small;
        sums[headq][4] += item.big;
        sums[headq][5] += item.bullet;
        sums[headq][6] += item.bomb;
        sums[headq][7] += item.mine;
        sums[headq][8] += item.accessory;
      });

      // Convert sums object to dataset format for chart.js
      const datasets = Object.keys(sums).map(headq => ({
        label: headq,
        data: sums[headq]
      }));

      return datasets;
    };

    return {
      startDate,
      endDate,
      isDataLoaded,
      chartData,
      chartOptions,
      searchByDateRange
    };
  },
};
</script>


<style scoped>
.form-container {
  background-color: #f9f9f9;
  padding: 30px;
}
.charts {
  position: relative;
  margin: auto;
  height: 40vh;
  width: 80vw;
}
</style>
