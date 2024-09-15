// frontend/src/api/axiosConfig.js
import axios from 'axios';

axios.defaults.baseURL = 'http://ah-kunliu-m:3000';  // 你的API地址
axios.defaults.withCredentials = true;

export default axios;
