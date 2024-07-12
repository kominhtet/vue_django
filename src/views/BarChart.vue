<template>
  <div>
    <canvas ref="barChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'BarChart',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.renderChart();
  },
  watch: {
    data() {
      this.renderChart();
    }
  },
  methods: {
    renderChart() {
      const ctx = this.$refs.barChart.getContext('2d');

      if (this.chart) {
        this.chart.destroy();
      }

      const headqLabels = Object.keys(this.data);
      const datasetFields = ['dead', 'live', 'alinn', 'small', 'big', 'bullet', 'bomb', 'mine', 'accessory'];
      const fieldLabels = ['သေ', 'ရှင်', 'အလင်းဝင်', 'လက်နက်ငယ်', 'လက်နက်ကြီး', 'ကျည်မျိုးစုံ', 'ဗုံးသီး', 'မိုင်း', 'ဆက်စပ်'];
      const backgroundColors = ['#42A5F5', '#FF6384', '#FFCD56', '#4BC0C0', '#36A2EB', '#9966FF', '#FF9F40', '#C9CBCF', '#FF6384'];

      const datasets = headqLabels.map((label, index) => {
        return {
          label: label,
          data: datasetFields.map(field => this.data[label][field] || 0),
          backgroundColor: backgroundColors[index % backgroundColors.length]
        };
      });

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: fieldLabels,
          datasets: datasets
        },
        options: {
          responsive: true,
          scales: {
            x: {
              stacked: false,
              ticks: {
                maxRotation: 0,
                minRotation: 0
              }
            },
            y: {
              stacked: false,
              beginAtZero: true
            }
          },
          plugins: {
            title: {
              display: true,
              // text: 'Combat News'
            },
            legend: {
              position: 'top',
              align: 'start'
            }
          }
        }
      });
    }
  }
};
</script>

<style scoped>
canvas {
  max-width: 100%;
  max-height: 600px;
}
</style>
