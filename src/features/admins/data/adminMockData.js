// src/features/admins/data/adminMockData.js

// Dữ liệu thô - Giả lập database
export const rawAdminData = [
  { id: 'a1', name: 'Tuyết My', email: 'my.tuyet@bus.com', role: 'Super Admin', status: 'Đang hoạt động' },
  { id: 'a2', name: 'Hoàng Long', email: 'long.hoang@bus.com', role: 'Quản lý vận hành', status: 'Đang hoạt động' },
  { id: 'a3', name: 'Minh Khang', email: 'khang.minh@bus.com', role: 'Quản lý người dùng', status: 'Tạm khóa' },
];

// Định nghĩa màu cho các Tag Trạng thái
export const STATUS_COLOR_MAP = {
  'Đang hoạt động': 'success',
  'Tạm khóa': 'error',
};

// Định nghĩa màu cho các Tag Vai trò
export const ROLE_COLOR_MAP = {
  'Super Admin': 'purple',
  'Quản lý vận hành': 'blue',
  'Quản lý người dùng': 'geekblue',
};