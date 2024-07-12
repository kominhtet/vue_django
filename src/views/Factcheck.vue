<template>
    <div class="container-fluid"> 
        <!-- Date Range Search Form -->
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
            <div class="col-md-2">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#factCheckModal">
                    Add New Fact Check
                </button> 
            </div>
        </div>  
        <!-- Summary Tables -->
        <div class="row mt-4">
            <div class="col-md-12">
                <h3>သတင်းမီဒီယာအလိုက်အနှစ်ချုပ်များ</h3>
                <table class="table table-bordered">
                    <thead>
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
                        <tr>
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
        <!-- Fact Check Table -->
        <div class="row">
            <div class="col-lg-12 col-md-12 mb-4">
                <h5 class="alert alert-success">Fact Check</h5>
                <table class="table table-bordered mt-4">
                    <thead>
                        <tr>
                            <th scope="col">စဉ်</th>
                            <th scope="col">ရက်စွဲ</th>
                            <th scope="col">Source</th>
                            <th scope="col">သတင်းခေါင်းစဉ်</th>
                            <th scope="col">သတင်းအမှား</th>
                            <th scope="col">တစ်ဝက် မှား/မှန်</th>
                            <th scope="col">သတင်းအမှန်</th>
                            <th scope="col">မှတ်ချက်</th>
                            <th scope="col">Photos</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(fact, index) in factChecks" :key="fact.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ fact.date }}</td>
                            <td style="text-align:left">{{ fact.source }}</td>
                            <td style="text-align:left">{{ fact.description }}</td>
                            <td>{{ fact.false_news ? '✔' : '' }}</td>
                            <td>{{ fact.half_news ? '✔' : '' }}</td>
                            <td>{{ fact.true_news ? '✔' : '' }}</td>
                            <td>{{ fact.note }}</td>
                            <td>
                                <div v-for="photo in fact.photos" :key="photo.id">
                                    <img :src="photo.photo" alt="Fact Check Photo" style="max-width: 100px; max-height: 100px;"/>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>    
        </div>  
        <!-- Modal -->
        <div class="modal fade" id="factCheckModal" tabindex="-1" aria-labelledby="factCheckModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="factCheckModalLabel">Add/Edit Fact Check</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Add/Edit Fact Check Form --> 
                        <form @submit.prevent="submitForm" ref="factCheckForm">
                            <div class="form-group">
                                <label class="form-label float-left ml-2">ရက်စွဲ</label><br>                       
                                <input type="date" v-model="factCheck.date" class="form-control" id="date" required />
                            </div>
                            <div class="form-group">
                                <input type="text" v-model="factCheck.source" class="form-control" id="source" placeholder="Source" required />
                            </div>
                            <div class="form-group">
                                <textarea v-model="factCheck.description" class="form-control" id="description" placeholder="သတင်းအကြောင်းအရာ" required></textarea>
                            </div>

                            <div class="form-row">
                                <div class="form-check form-group col-md-4">
                                    <input type="checkbox" v-model="factCheck.false_news" class="form-check-input" id="false_news" />
                                    <label for="false_news" class="form-check-label ml-1">&#10007; </label>
                                </div>
                                <div class="form-check form-group col-md-4">
                                    <input type="checkbox" v-model="factCheck.half_news" class="form-check-input" id="half_news" />
                                    <label for="half_news" class="form-check-label ml-2">&#10004; &#10007; </label>
                                </div>
                                <div class="form-check form-group col-md-4 mb-3">
                                    <input type="checkbox" v-model="factCheck.true_news" class="form-check-input" id="true_news" />
                                    <label for="true_news" class="form-check-label ml-2">&#10004; </label>
                                </div>
                            </div>

                            <div class="form-group">
                                <textarea v-model="factCheck.note" class="form-control" id="note" placeholder="Note"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="photos" class="form-label float-left ml-2">Upload Photos</label>
                                <input type="file" id="photos" @change="onFileChange" multiple class="form-control" />
                            </div>
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
    <Modal v-if="isModalVisible" :isVisible="isModalVisible" :photoSrc="modalPhoto" @close="closeModal" />
</template>


<script>
import axios from 'axios';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import api from './api';
import Modal from './Modal.vue';

export default {
    components: {
        VueDatePicker,
        Modal
    },
    data() {
        return {
            factChecks: [],
            startDate: null,
            endDate: null,
            counts: {
                false_news: 0,
                half_news: 0,
                true_news: 0
            },
            sourceCounts: {},
            totalSum: 0,
            formData: new FormData(),
            factCheck: {
                date: '',
                source: '',
                description: '',
                false_news: false,
                half_news: false,
                true_news: false,
                note: ''
            },
            photoPreview: null,
            modalTitle: ''
        };
    },
    created() {
        this.fetchFactChecks();
    },
    methods: {
        async fetchFactChecks(startDate = null, endDate = null) {
            let url = `${api.API_URL}api/fact_check/`;
            if (startDate && endDate) {
                url += `?start_date=${startDate}&end_date=${endDate}`;
            }
            try {
                const response = await axios.get(url);
                this.factChecks = response.data;
                this.factChecks.sort((a, b) => new Date(b.id) - new Date(a.id));
                this.calculateCounts();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        searchByDateRange() {
            if (this.startDate && this.endDate) {
                const startDateFormat = this.startDate.toISOString().split('T')[0];
                const endDateFormat = this.endDate.toISOString().split('T')[0];
                this.fetchFactChecks(startDateFormat, endDateFormat);
            } else {
                alert('Please select both start and end dates.');
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
        onFileChange(event) {
            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                this.formData.append('photos', files[i]);
            }
        },
        async submitForm() {
            // Append fact check details to form data
            for (const key in this.factCheck) {
                this.formData.append(key, this.factCheck[key]);
            }
            
            try {
                const response = await axios.post(`${api.API_URL}api/fact_check/`, this.formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                this.factChecks.push(response.data);
                this.formData = new FormData(); // Reset form data
                this.resetForm(); // Reset form fields
                this.calculateCounts(); // Recalculate counts after submission
            } catch (error) {
                console.error(error);
            }
        },
        resetForm() {
            this.factCheck = {
                date: '',
                source: '',
                description: '',
                false_news: false,
                half_news: false,
                true_news: false,
                note: ''
            };
            this.$refs.photos.value = ''; // Reset file input
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

<style scoped>
.container-fluid {
    background-color: #f9f9f9;
    padding: 30px;
}

.table {
    margin-top: 20px;
}

img {
    margin-right: 10px;
    margin-bottom: 10px;
}
</style>
