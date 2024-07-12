<template>
  <div class="date container-fluid">
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
      <!-- <div class="col-md-2">
        <p>Results for {{ formattedDateRange }}:</p>
      </div> -->
    </div>
    <div v-if="combatNewsData && combatNewsData.length > 0" class="data-display">
      
      <!-- တိုင်းစစ်ဌာနချုပ်အလိုက် အကျိုးအမြတ်ရရှိမှုများ -->
      <div class="row mt-4">
        <div class="col-md-7">
          <h2 class="alert alert-success">တိုင်းစစ်ဌာနချုပ်အလိုက် အကျိုးအမြတ်ရရှိမှုများ</h2><br>
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
            </tbody>
          </table>
        </div>
        <!-- အကျိုးအမြတ်ရရှိမှုစုစုပေါင်း -->
        <div class="col-md-5">
          <h2 class="alert alert-success">အကျိုးအမြတ်ရရှိမှုစုစုပေါင်း</h2><br>
          <table class="table table-bordered">
            <thead>
              <tr>
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
              <tr>
                <td>{{ summary.dead }}</td>
                <td>{{ summary.live }}</td>
                <td>{{ summary.alinn }}</td>
                <td>{{ summary.small }}</td>
                <td>{{ summary.big }}</td>
                <td>{{ summary.bullet }}</td>
                <td>{{ summary.bomb }}</td>
                <td>{{ summary.mine }}</td>
                <td>{{ summary.accessory }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p class="alert alert-success">သတင်းပုဒ်ရေစုစုပေါင်း( {{ combatNewsData.length }} )ခုတွေ့ရှိပါသည်။</p>
      <div class="row">
        <!-- သတင်းအပြည့်အစုံ -->
        <div class="col-md-12">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ရက်စွဲ</th>
                <th>သတင်း</th>
                <th>မြို့နယ်</th>
                <th>တိုင်း</th>
                <th>သေ</th>
                <th>ရှင်</th>
                <th>အလင်းဝင်</th>
                <th>ငယ်</th>
                <th>ကြီး</th>
                <th>ကျည်</th>
                <th>ဗုံး</th>
                <th>မိုင်း</th>
                <th>ဆက်စပ်</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="news in combatNewsData" :key="news.id">
                <td>{{ news.date }}</td>
                <td>{{ news.description }}</td>
                <td>{{ news.township }}</td>
                <td>{{ news.headq }}</td>
                <td>{{ news.dead }}</td>
                <td>{{ news.live }}</td>
                <td>{{ news.alinn }}</td>
                <td>{{ news.small }}</td>
                <td>{{ news.big }}</td>
                <td>{{ news.bullet }}</td>
                <td>{{ news.bomb }}</td>
                <td>{{ news.mine }}</td>
                <td>{{ news.accessory }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-else-if="combatNewsData && combatNewsData.length === 0" class="alert alert-warning">
      No results found for {{ formattedDateRange }}.
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
  components: {
    VueDatePicker,
  },
  setup() {
    const startDate = ref(null);
    const endDate = ref(null);
    const combatNewsData = ref(null);
    const formattedDateRange = ref('');

    const searchByDateRange = async () => {
      if (startDate.value && endDate.value) {
        const startDateFormat = startDate.value.toISOString().split('T')[0];
        const endDateFormat = endDate.value.toISOString().split('T')[0];
        formattedDateRange.value = `${startDate.value.toLocaleDateString()} to ${endDate.value.toLocaleDateString()}`;

        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/combat_news/?start_date=${startDateFormat}&end_date=${endDateFormat}`);
          combatNewsData.value = response.data;
        } catch (error) {
          console.error('Error fetching data:', error);
          combatNewsData.value = [];
        }
      } else {
        formattedDateRange.value = 'Please select valid start and end dates.';
        combatNewsData.value = [];
      }
    };

    const summary = computed(() => {
      if (!combatNewsData.value || combatNewsData.value.length === 0) {
        return {
          dead: 0,
          live: 0,
          alinn: 0,
          small: 0,
          big: 0,
          bullet: 0,
          bomb: 0,
          mine: 0,
          accessory: 0,
        };
      }
      return combatNewsData.value.reduce(
        (acc, news) => {
          acc.dead += news.dead || 0;
          acc.live += news.live || 0;
          acc.alinn += news.alinn || 0;
          acc.small += news.small || 0;
          acc.big += news.big || 0;
          acc.bullet += news.bullet || 0;
          acc.bomb += news.bomb || 0;
          acc.mine += news.mine || 0;
          acc.accessory += news.accessory || 0;
          return acc;
        },
        {
          dead: 0,
          live: 0,
          alinn: 0,
          small: 0,
          big: 0,
          bullet: 0,
          bomb: 0,
          mine: 0,
          accessory: 0,
        }
      );
    });

    const summaryByHeadq = computed(() => {
      if (!combatNewsData.value || combatNewsData.value.length === 0) {
        return {};
      }
      return combatNewsData.value.reduce((acc, news) => {
        if (!acc[news.headq]) {
          acc[news.headq] = {
            dead: 0,
            live: 0,
            alinn: 0,
            small: 0,
            big: 0,
            bullet: 0,
            bomb: 0,
            mine: 0,
            accessory: 0,
          };
        }
        acc[news.headq].dead += news.dead || 0;
        acc[news.headq].live += news.live || 0;
        acc[news.headq].alinn += news.alinn || 0;
        acc[news.headq].small += news.small || 0;
        acc[news.headq].big += news.big || 0;
        acc[news.headq].bullet += news.bullet || 0;
        acc[news.headq].bomb += news.bomb || 0;
        acc[news.headq].mine += news.mine || 0;
        acc[news.headq].accessory += news.accessory || 0;
        return acc;
      }, {});
    });

    return {
      startDate,
      endDate,
      combatNewsData,
      formattedDateRange,
      searchByDateRange,
      summary,
      summaryByHeadq,
    };
  },
};
</script>

<style scoped>
.date {
  background-color: #f9f9f9;
  padding: 5px;
}

.form-container {
  display: flex;
  align-items: center;
}

.data-display {
  width: 100%;
}

.alert {
  margin-top: 20px;
}
</style>
