// src/services/driverService.js
import { rawDriverData } from '~/features/drivers/data/driverMockData'; // <-- 1. SỬA IMPORT

// --- Giả lập Database ---
let drivers = [...rawDriverData]; // <-- 2. SỬA TÊN BIẾN

const MOCK_DELAY = 500;

const mockApi = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

// --- Các hàm CRUD ---

const getDrivers = (page = 1, pageSize = 7) => { // <-- 3. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: getDrivers ---', { page, pageSize });
  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  const paginatedData = drivers.slice(start, end); // <-- 4. SỬA TÊN BIẾN
  return mockApi({
    data: paginatedData,
    total: drivers.length, // <-- 5. SỬA TÊN BIẾN
  });
};

const deleteDriver = (id) => { // <-- 6. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: deleteDriver ---', { id });
  drivers = drivers.filter((d) => d.id !== id); // <-- 7. SỬA TÊN BIẾN
  return mockApi({ success: true });
};

const createDriver = (data) => { // <-- 8. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: createDriver ---', data);
  const newDriver = {
    ...data,
    id: `d${new Date().getTime()}`,
  };
  drivers.unshift(newDriver); // <-- 9. SỬA TÊN BIẾN
  return mockApi({ success: true, driver: newDriver });
};

const updateDriver = (id, data) => { // <-- 10. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: updateDriver ---', { id, data });
  let targetDriver = null;
  drivers = drivers.map((d) => { // <-- 11. SỬA TÊN BIẾN
    if (d.id === id) {
      targetDriver = { ...d, ...data };
      return targetDriver;
    }
    return d;
  });
  if (targetDriver) {
    return mockApi({ success: true, driver: targetDriver });
  } else {
    return Promise.reject(new Error('Không tìm thấy tài xế để cập nhật'));
  }
};

// --- Xuất ra service ---
export const driverService = { // <-- 12. SỬA TÊN EXPORT
  getDrivers,
  deleteDriver,
  createDriver,
  updateDriver,
};