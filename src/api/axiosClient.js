// src/api/axiosClient.js
import axios from 'axios';

// 1. Tạo instance của axios
const axiosClient = axios.create({
  // Lấy URL từ biến môi trường (hoặc dùng fallback localhost)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor Request: Tự động gắn Token trước khi gửi đi
axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 3. Interceptor Response: Xử lý dữ liệu trả về
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu API trả về có dạng { data: [...] }, ta chỉ lấy phần data
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Xử lý lỗi chung (ví dụ: Hết hạn token -> đá về login)
    if (error.response && error.response.status === 401) {
      console.log('Hết phiên đăng nhập, vui lòng đăng nhập lại.');
      // window.location.href = '/login'; // Mở dòng này khi muốn auto logout
    }
    throw error;
  }
);

export default axiosClient;