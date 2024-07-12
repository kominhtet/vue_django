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

      const labels = Object.keys(this.data);
      const dead = labels.map(label => this.data[label].dead);
      const live = labels.map(label => this.data[label].live);
      const alinn = labels.map(label => this.data[label].alinn);
      const small = labels.map(label => this.data[label].small);
      const big = labels.map(label => this.data[label].big);
      const bullet = labels.map(label => this.data[label].bullet);
      const bomb = labels.map(label => this.data[label].bomb);
      const mine = labels.map(label => this.data[label].mine);
      const accessory = labels.map(label => this.data[label].accessory);

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            { label: 'Dead', data: dead, backgroundColor: 'red' },
            { label: 'Live', data: live, backgroundColor: 'green' },
            { label: 'Alinn', <template>
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
      const backgroundColors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'grey'];

      const datasets = headqLabels.map((label, index) => {
        return {
          label: label,
          data: datasetFields.map(field => this.data[label][field]),
          backgroundColor: backgroundColors[index % backgroundColors.length]
        };
      });

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: datasetFields.map(field => field.charAt(0).toUpperCase() + field.slice(1)),
          datasets: datasets
        },
        options: {
          responsive: true,
          scales: {
            x: {
              stacked: true,
              ticks: {
                maxRotation: 90,
                minRotation: 45
              }
            },
            y: {
              stacked: true
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Combat News'
            },
            legend: {
              position: 'bottom'
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
  max-height: 400px;
}
</style>
data: alinn, backgroundColor: 'blue' },
            { label: 'Small', data: small, backgroundColor: 'yellow' },
            { label: 'Big', data: big, backgroundColor: 'purple' },
            { label: 'Bullet', data: bullet, backgroundColor: 'orange' },
            { label: 'Bomb', data: bomb, backgroundColor: 'pink' },
            { label: 'Mine', data: mine, backgroundColor: 'brown' },
            { label: 'Accessory', data: accessory, backgroundColor: 'grey' }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              stacked: true
            },
            y: {
              stacked: true
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
  max-height: 400px;
}
</style>
