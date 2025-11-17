// src/services/adminService.js
import { rawAdminData } from '~/features/admins/data/adminMockData'; // <-- 1. SỬA IMPORT

// --- Giả lập Database ---
let admins = [...rawAdminData]; // <-- 2. SỬA TÊN BIẾN

const MOCK_DELAY = 500;

const mockApi = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

// --- Các hàm CRUD ---

const getAdmins = (page = 1, pageSize = 7) => { // <-- 3. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: getAdmins ---', { page, pageSize });
  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  const paginatedData = admins.slice(start, end); // <-- 4. SỬA TÊN BIẾN
  return mockApi({
    data: paginatedData,
    total: admins.length, // <-- 5. SỬA TÊN BIẾN
  });
};

const deleteAdmin = (id) => { // <-- 6. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: deleteAdmin ---', { id });
  admins = admins.filter((a) => a.id !== id); // <-- 7. SỬA TÊN BIẾN
  return mockApi({ success: true });
};

const createAdmin = (data) => { // <-- 8. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: createAdmin ---', data);
  const newAdmin = {
    ...data,
    id: `a${new Date().getTime()}`,
  };
  admins.unshift(newAdmin); // <-- 9. SỬA TÊN BIẾN
  return mockApi({ success: true, admin: newAdmin });
};

const updateAdmin = (id, data) => { // <-- 10. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: updateAdmin ---', { id, data });
  let targetAdmin = null;
  admins = admins.map((a) => { // <-- 11. SỬA TÊN BIẾN
    if (a.id === id) {
      targetAdmin = { ...a, ...data };
      return targetAdmin;
    }
    return a;
  });
  if (targetAdmin) {
    return mockApi({ success: true, admin: targetAdmin });
  } else {
    return Promise.reject(new Error('Không tìm thấy Admin để cập nhật'));
  }
};

// --- Xuất ra service ---
export const adminService = { // <-- 12. SỬA TÊN EXPORT
  getAdmins,
  deleteAdmin,
  createAdmin,
  updateAdmin,
};