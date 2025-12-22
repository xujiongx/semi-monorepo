import axios from 'axios';
import { Toast } from '@douyinfe/semi-ui';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401 && !error.config.url.includes('/auth/login')) {
        Toast.error('登录已过期，请重新登录');
        localStorage.removeItem('access_token');
        // Redirect to login
        window.location.href = '/login';
      } else {
        Toast.error(data?.message || '请求失败');
      }
    } else {
      Toast.error('网络错误');
    }
    return Promise.reject(error);
  }
);

export default request;
