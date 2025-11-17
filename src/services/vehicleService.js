// src/services/vehicleService.js
import { rawVehicleData } from '../features/vehicles/data/vehicleMockData';

// --- Giả lập Database (Lưu trong bộ nhớ) ---
// Chúng ta dùng 'let' để có thể thay đổi (thêm/sửa/xóa)
let vehicles = [...rawVehicleData];

// Giả lập độ trễ mạng (miligiây)
const MOCK_DELAY = 500;

// --- Hàm Helper (Giả lập Promise) ---
const mockApi = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

// --- Các hàm CRUD ---

/**
 * Lấy danh sách xe (có phân trang giả lập)
 */
const getVehicles = (page = 1, pageSize = 7) => {
  console.log('--- MOCK SERVICE: getVehicles ---', { page, pageSize });

  const start = (page - 1) * pageSize;
  const end = page * pageSize;

  const paginatedData = vehicles.slice(start, end);

  return mockApi({
    data: paginatedData, // Dữ liệu của trang hiện tại
    total: vehicles.length, // Tổng số lượng xe
  });
};

/**
 * Xóa một xe dựa trên ID
 */
const deleteVehicle = (id) => {
  console.log('--- MOCK SERVICE: deleteVehicle ---', { id });

  // Lọc ra xe không có id này
  vehicles = vehicles.filter((v) => v.id !== id);

  return mockApi({ success: true });
};

/**
 * Thêm một xe mới
 */
const createVehicle = (data) => {
  // data = { licensePlate, capacity, status, currentRoute }
  console.log('--- MOCK SERVICE: createVehicle ---', data);

  const newVehicle = {
    ...data,
    id: `v${new Date().getTime()}`, // Tạo ID giả
  };

  vehicles.unshift(newVehicle); // Thêm vào đầu mảng

  return mockApi({ success: true, vehicle: newVehicle });
};

/**
 * Cập nhật một xe dựa trên ID
 */
const updateVehicle = (id, data) => {
  // data = { licensePlate, capacity, status, currentRoute }
  console.log('--- MOCK SERVICE: updateVehicle ---', { id, data });

  let targetVehicle = null;

  vehicles = vehicles.map((v) => {
    if (v.id === id) {
      targetVehicle = { ...v, ...data }; // Cập nhật data
      return targetVehicle;
    }
    return v;
  });

  if (targetVehicle) {
    return mockApi({ success: true, vehicle: targetVehicle });
  } else {
    return Promise.reject(new Error('Không tìm thấy xe để cập nhật'));
  }
};

// --- Xuất ra service ---
export const vehicleService = {
  getVehicles,
  deleteVehicle,
  createVehicle, // <-- THÊM VÀO
  updateVehicle, // <-- THÊM VÀO
};