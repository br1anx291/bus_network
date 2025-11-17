// src/services/authService.js

// (Chúng ta sẽ tạo file này ở bước 4, nhưng ta import trước)
// File này sẽ chứa các action `login()` và `logout()`
import { useAuthStore } from '../store/authStore'; 

// === CÔNG TẮC BẬT/TẮT API ===
// Khi backend có, bạn chỉ cần đổi thành 'false'
const USE_MOCK_API = true; 

// --- 1. "ĐẠN GIẢ" (MOCK API) ---
const mockLogin = (email, password) => {
  console.log('--- ĐANG DÙNG MOCK API (ĐĂNG NHẬP) ---', { email, password });

  return new Promise((resolve, reject) => {
    // Giả lập độ trễ mạng
    setTimeout(() => {
      // Dữ liệu đăng nhập giả lập
      if (email === 'admin@bus.com' && password === 'admin123') {
        const mockUser = {
          id: 'u1',
          name: 'Tuyết My (Admin)',
          email: 'admin@bus.com',
          role: 'admin',
          avatar: 'https://i.pravatar.cc/150?img=32' // Avatar giả
        };
        const mockToken = 'fake-jwt-token-admin-12345';

        // Trả về response thành công
        resolve({ user: mockUser, token: mockToken });
      } else {
        // Giả lập sai mật khẩu
        reject(new Error('Tên tài khoản hoặc mật khẩu không chính xác'));
      }
    }, 1000); // Chờ 1 giây
  });
};

// (Bạn có thể làm tương tự cho mockRegister)
// const mockRegister = (data) => { ... }

// --- "ĐẠN GIẢ" (MOCK API - REGISTER) ---
const mockRegister = (data) => {
  console.log('--- ĐANG DÙNG MOCK API (ĐĂNG KÝ) ---', data);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Giả lập email đã tồn tại
      if (data.email === 'admin@bus.com') {
        reject(new Error('Email này đã được đăng ký!'));
        return;
      }

      // Giả lập đăng ký thành công
      const mockUser = {
        id: 'u2',
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        role: 'user', // Mặc định là user
      };

      // Trả về response thành công
      resolve({ user: mockUser, message: 'Đăng ký thành công!' });

    }, 1000); // Chờ 1 giây
  });
};

// --- 2. "ĐẠN THẬT" (REAL API - CHỜ SẴN) ---
const realLogin = async (email, password) => {
  console.log('--- ĐANG DÙNG REAL API (ĐĂNG NHẬP) ---');
  // import axios from 'axios';
  // const API_URL = import.meta.env.VITE_API_URL;

  // try {
  //   const response = await axios.post(`${API_URL}/login`, { email, password });
  //   return response.data; // { user: {...}, token: '...' }
  // } catch (error) {
  //   throw new Error(error.response?.data?.message || 'Lỗi từ server');
  // }

  return Promise.reject(new Error('API thật (Login) chưa được kết nối!'));
};

// --- "ĐẠN THẬT" (REAL API - REGISTER - CHỜ SẴN) ---
const realRegister = async (data) => {
  console.log('--- ĐANG DÙNG REAL API (ĐĂNG KÝ) ---');
  // try {
  //   const response = await axios.post(`${API_URL}/register`, data);
  //   return response.data; // { user: {...}, message: '...' }
  // } catch (error) {
  //   throw new Error(error.response?.data?.message || 'Lỗi từ server');
  // }

  return Promise.reject(new Error('API thật (Register) chưa được kết nối!'));
};

// --- 3. "NÒNG SÚNG" (HÀM MÀ UI SẼ GỌI) ---

/**
 * Xử lý logic đăng nhập, bất kể là mock hay thật
 */
const login = async (email, password) => {
  try {
    // "Nòng súng" quyết định dùng đạn thật hay giả
    const data = USE_MOCK_API
      ? await mockLogin(email, password)
      : await realLogin(email, password);

    // SAU KHI THÀNH CÔNG:
    // Gọi action 'login' từ authStore (sẽ tạo ở Bước 4)
    useAuthStore.getState().login(data.user, data.token);

    return data;

  } catch (error) {
    // Ném lỗi ra để UI (Form) bắt và hiển thị
    throw error;
  }
};

/**
 * Xử lý logic đăng ký
 */
const register = async (data) => {
  // 'data' là object: { firstName, lastName, email, password }
  try {
    const responseData = USE_MOCK_API
      ? await mockRegister(data)
      : await realRegister(data);

    // Đăng ký không tự động đăng nhập, chỉ trả về message
    return responseData;

  } catch (error) {
    // Ném lỗi ra để UI (Form) bắt và hiển thị
    throw error;
  }
};

/**
 * Xử lý logic đăng xuất
 */
const logout = () => {
  // Gọi action 'logout' từ authStore (sẽ tạo ở Bước 4)
  useAuthStore.getState().logout();
  // (Có thể gọi API /logout ở đây nếu cần)
  console.log('Đã đăng xuất!');
};


// Xuất ra cho các component khác dùng
export const authService = {
  login,
  logout,
  register,
};

