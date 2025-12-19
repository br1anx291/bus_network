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

const removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Kết hợp các dấu thanh (nếu có tổ hợp)
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); 
    return str;
}

const realRegister = async (data) => {
  console.log('--- ĐANG DÙNG POCKETBASE (ĐĂNG KÝ) ---');
  try {
    const cleanName = removeVietnameseTones(`${data.firstName} ${data.lastName}`);
    const randomSuffix = Math.floor(Math.random() * 1000); // Thêm số đuôi (ví dụ: 123) để tránh trùng tên
    const generatedUsername = `${cleanName}`.toLowerCase().replace(/[^a-z0-9]/g, '') + randomSuffix;
    
    const payload = {
      email: data.email,
      password: data.password,
      passwordConfirm: data.password, 
      username: generatedUsername,
      name: `${data.firstName} ${data.lastName}`,
      role: 'staff', 
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