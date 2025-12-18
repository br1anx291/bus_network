import { useAuthStore } from '../store/authStore';
import pb from '~/api/pocketbase'; 

const USE_MOCK_API = false; 

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


const realLogin = async (email, password) => {
  console.log('--- ĐANG DÙNG POCKETBASE (ĐĂNG NHẬP) ---');
  try {

    const authData = await pb.collection('users').authWithPassword(email, password);
    const userMap = {
      id: authData.record.id,
      name: authData.record.username || authData.record.email, 
      email: authData.record.email,
      role: authData.record.role || 'user', 
      avatar: authData.record.avatar 
    };

    return { user: userMap, token: authData.token };

  } catch (error) {
    console.error("PocketBase Login Error:", error);
    throw new Error('Email hoặc mật khẩu không chính xác!');
  }
};

const realRegister = async (data) => {
  console.log('--- ĐANG DÙNG POCKETBASE (ĐĂNG KÝ) ---');
  try {
    const payload = {
      email: data.email,
      password: data.password,
      passwordConfirm: data.password, 
      username: `${data.firstName}_${data.lastName}`.toLowerCase().replace(/\s/g, ''), 
      name: `${data.firstName} ${data.lastName}`,
      role: 'user', 
      emailVisibility: true,
    };

    const record = await pb.collection('users').create(payload);


    const userMap = {
      id: record.id,
      name: record.name,
      email: record.email,
      role: record.role
    };

    return { user: userMap, message: 'Đăng ký thành công! Vui lòng đăng nhập.' };

  } catch (error) {
    console.error("PocketBase Register Error:", error);

    if (error.data?.data?.email) {
      throw new Error('Email này đã được sử dụng.');
    }
    throw new Error('Đăng ký thất bại. Vui lòng thử lại.');
  }
};

const login = async (email, password) => {
  try {
    const data = USE_MOCK_API
      ? await mockLogin(email, password)
      : await realLogin(email, password);
    useAuthStore.getState().login(data.user, data.token);

    return data;

  } catch (error) {
    throw error;
  }
};

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

const logout = () => {
  pb.authStore.clear();
  useAuthStore.getState().logout();
  console.log('Đã đăng xuất khỏi hệ thống!');
};
const getCurrentUser = () => {
  if (USE_MOCK_API) {
    return {
       id: 'u1',
       name: 'Tuyết My (Admin)',
       email: 'admin@bus.com',
       role: 'admin',
       avatar: 'https://i.pravatar.cc/150?img=32'
    };
  }

  const model = pb.authStore.model;
  
  if (!model) return null;

  return {
    id: model.id,
    name: model.name || model.username || model.email, 
    email: model.email,
    role: model.role || 'user',
    avatar: model.avatar 
      ? `${pb.baseUrl}/api/files/${model.collectionId}/${model.id}/${model.avatar}` 
      : null
  };
};

export const authService = {
  login,
  logout,
  register,
  getCurrentUser
};