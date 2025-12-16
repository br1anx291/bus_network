// src/services/authService.js

import { useAuthStore } from '../store/authStore';
import pb from '~/api/pocketbase'; // <--- MỚI: Import "cầu nối" PocketBase

// === CÔNG TẮC BẬT/TẮT API ===
// Đã chuyển sang FALSE để bắt đầu tích hợp thật
const USE_MOCK_API = false; 

// --- 1. "ĐẠN GIẢ" (MOCK API - GIỮ NGUYÊN ĐỂ BACKUP) ---
const mockLogin = (email, password) => {
  console.log('--- ĐANG DÙNG MOCK API (ĐĂNG NHẬP) ---', { email, password });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'admin@bus.com' && password === 'admin123') {
        const mockUser = {
          id: 'u1',
          name: 'Tuyết My (Admin)',
          email: 'admin@bus.com',
          role: 'admin',
          avatar: 'https://i.pravatar.cc/150?img=32'
        };
        const mockToken = 'fake-jwt-token-admin-12345';
        resolve({ user: mockUser, token: mockToken });
      } else {
        reject(new Error('Tên tài khoản hoặc mật khẩu không chính xác'));
      }
    }, 1000);
  });
};

const mockRegister = (data) => {
  console.log('--- ĐANG DÙNG MOCK API (ĐĂNG KÝ) ---', data);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email === 'admin@bus.com') {
        reject(new Error('Email này đã được đăng ký!'));
        return;
      }
      const mockUser = {
        id: 'u2',
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        role: 'user',
      };
      resolve({ user: mockUser, message: 'Đăng ký thành công!' });
    }, 1000);
  });
};

// --- 2. "ĐẠN THẬT" (REAL API - POCKETBASE INTEGRATION) ---

const realLogin = async (email, password) => {
  console.log('--- ĐANG DÙNG POCKETBASE (ĐĂNG NHẬP) ---');
  try {
    // Gọi SDK của PocketBase
    const authData = await pb.collection('users').authWithPassword(email, password);

    // PocketBase trả về: { token: "...", record: { ... } }
    // Ta cần map lại thành cấu trúc { user, token } mà App đang hiểu
    const userMap = {
      id: authData.record.id,
      name: authData.record.username || authData.record.email, // Ưu tiên username
      email: authData.record.email,
      role: authData.record.role || 'user', // Lấy role từ DB
      // Nếu user có avatar thì lấy, không thì null (hoặc xử lý url đầy đủ sau)
      avatar: authData.record.avatar 
    };

    return { user: userMap, token: authData.token };

  } catch (error) {
    // Log lỗi để debug
    console.error("PocketBase Login Error:", error);
    // Ném lỗi ra chuỗi đơn giản để UI hiển thị
    throw new Error('Email hoặc mật khẩu không chính xác!');
  }
};

const realRegister = async (data) => {
  console.log('--- ĐANG DÙNG POCKETBASE (ĐĂNG KÝ) ---');
  try {
    // PocketBase yêu cầu passwordConfirm
    const payload = {
      email: data.email,
      password: data.password,
      passwordConfirm: data.password, // UI của bạn có thể chưa có field này, nên ta gán bằng password luôn
      username: `${data.firstName}_${data.lastName}`.toLowerCase().replace(/\s/g, ''), // Tạo username tự động
      name: `${data.firstName} ${data.lastName}`,
      role: 'user', // Mặc định user thường
      emailVisibility: true,
    };

    const record = await pb.collection('users').create(payload);

    // Map dữ liệu trả về
    const userMap = {
      id: record.id,
      name: record.name,
      email: record.email,
      role: record.role
    };

    return { user: userMap, message: 'Đăng ký thành công! Vui lòng đăng nhập.' };

  } catch (error) {
    console.error("PocketBase Register Error:", error);
    // Xử lý lỗi trùng email (PocketBase thường trả về status 400)
    if (error.data?.data?.email) {
      throw new Error('Email này đã được sử dụng.');
    }
    throw new Error('Đăng ký thất bại. Vui lòng thử lại.');
  }
};

// --- 3. "NÒNG SÚNG" (LOGIC CHUNG) ---

/**
 * Xử lý logic đăng nhập
 */
const login = async (email, password) => {
  try {
    // Quyết định dùng Mock hay Real dựa trên biến cờ
    const data = USE_MOCK_API
      ? await mockLogin(email, password)
      : await realLogin(email, password);

    // Cập nhật vào Global Store (Zustand)
    // Lưu ý: data.user và data.token đã được chuẩn hóa ở trên
    useAuthStore.getState().login(data.user, data.token);

    return data;

  } catch (error) {
    throw error;
  }
};

/**
 * Xử lý logic đăng ký
 */
const register = async (data) => {
  try {
    const responseData = USE_MOCK_API
      ? await mockRegister(data)
      : await realRegister(data);

    return responseData;
  } catch (error) {
    throw error;
  }
};

/**
 * Xử lý logic đăng xuất
 */
const logout = () => {
  // 1. Xóa token trong PocketBase (QUAN TRỌNG)
  pb.authStore.clear();

  // 2. Xóa state trong Store React
  useAuthStore.getState().logout();
  
  console.log('Đã đăng xuất khỏi hệ thống!');
};

// Xuất ra
export const authService = {
  login,
  logout,
  register,
};