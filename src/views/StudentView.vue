<template>
    <div class="container-fluid"> 
        <br>
        <div class="row">
            <div class="col-md-10">
                <h2 class="alert alert-success">တိုက်ပွဲသတင်းများ</h2>
                <table class="table table-bordered mt-4">
                    <thead>
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
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="student in students" :key="student.id">
                            <td>{{student.id}}</td>
                            <td>{{student.date}}</td>
                            <td style="text-align:left">{{student.description}}</td>
                            <td>{{student.township}}</td>
                            <td>{{student.headq}}</td>
                            <td>{{student.dead}}</td>
                            <td>{{student.live}}</td>
                            <td>{{student.alinn}}</td>
                            <td>{{student.small}}</td>
                            <td>{{student.big}}</td>
                            <td>{{student.bullet}}</td>
                            <td>{{student.bomb}}</td>
                            <td>{{student.mine}}</td>
                            <td>{{student.accessory}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-md-2">
                <h2 class="alert alert-info">သတင်းအသစ်ထည့်ရန်</h2>
                <form @submit.prevent="saveStudent()">
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label float-left ml-2">Date</label>
                                <input type="date" class="form-control" v-model="student.date">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label float-left ml-2">description</label>
                                <input type="text" class="form-control" v-model="student.description">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label float-left ml-2">township</label>
                                <input type="text" class="form-control" v-model="student.township">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label float-left ml-2">headq</label>
                                <input type="text" class="form-control" v-model="student.headq">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label float-left ml-2">dead</label>
                                <input type="text" class="form-control" v-model="student.dead">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label float-left ml-2">live</label>
                                <input type="text" class="form-control" v-model="student.live">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label float-left ml-2">alinn</label>
                                <input type="text" class="form-control" v-model="student.alinn">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label float-left ml-2">small</label>
                                <input type="text" class="form-control" v-model="student.small">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label float-left ml-2">big</label>
                                <input type="text" class="form-control" v-model="student.big">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label float-left ml-2">bullet</label>
                                <input type="text" class="form-control" v-model="student.bullet">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label float-left ml-2">bomb</label>
                                <input type="text" class="form-control" v-model="student.bomb">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label float-left ml-2">mine</label>
                                <input type="text" class="form-control" v-model="student.mine">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label class="form-label float-left ml-2">accessory</label>
                                <input type="text" class="form-control" v-model="student.accessory">
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary float-left ml-2">Save</button>
                    <br>   
                    <br> 
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <h2 class="alert alert-info">Upload Excel File</h2>                                   
                                <input type="file" class="form-control-file" id="xlsxFile" @change="onFileChange">
                                <button class="btn btn-primary mt-2" @click="uploadFile">Upload</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import * as XLSX from 'xlsx';

export default {
    data() {
        return {
            students: [],
            student: {
                date: '',
                description: '',
                township: '',
                headq: '',
                dead: '',
                live: '',
                alinn: '',
                small: '',
                big: '',
                bullet: '',
                bomb: '',
                mine: '',
                accessory: '',
            },
            xlsxFile: null,
            api: 'http://127.0.0.1:8000/api'
        }
    },
    mounted() {
        this.getStudents();
    },
    methods: {
        getStudents() {
            axios.get(this.api + '/students/')
                .then(response => {
                    this.students = response.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        saveStudent() {
            axios.post(this.api + '/students/', this.student)
                .then(response => {
                    this.getStudents();
                    this.student = {};
                    alert("Student saved successfully!");
                })
                .catch(error => {
                    console.log(error);
                });
        },
        onFileChange(event) {
            this.xlsxFile = event.target.files[0];
        },
        uploadFile() {
            if (!this.xlsxFile) {
                alert("Please select a file first.");
                return;
            }

            let reader = new FileReader();
            reader.onload = (e) => {
                let data = new Uint8Array(e.target.result);
                let workbook = XLSX.read(data, { type: 'array' });
                let firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                let excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                let students = excelData.slice(1).map(row => ({
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
                    accessory: parseInt(row[12]) || 0
                }));

                console.log(students);  // Debugging line

                axios.post(this.api + '/bulk-upload/', students)
                    .then(response => {
                        console.log(response.data);
                        this.getStudents(); // Refresh the student list after upload
                        alert("Upload successful!");
                    })
                    .catch(error => {
                        console.error("There was an error uploading the file!", error);
                        alert("There was an error uploading the file. Please check the console for details.");
                    });
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
    }
}
</script>

<style>
.container-fluid {
    margin-top: 20px;
}
</style>
