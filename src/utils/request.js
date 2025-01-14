import axios from 'axios';
// import path from 'path';
// import fs from 'react-native-fs'
import {getToken, removeToken} from '@/utils/tokens';

// const configPath = path.join(__dirname, 'config.json');
// const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
import config from './config.json';

const request = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
});

// 添加请求拦截器
request.interceptors.request.use((config) => {
  const token = getToken();
  if (token){
    config.headers.Autorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use((response) => {
  return response;
}, (error) => {
  console.dir(error);
  if (error.response.status === 401) {
    removeToken();
    // navigation.navigate('Login');
  }
  return Promise.reject(error);
});

export { request };

