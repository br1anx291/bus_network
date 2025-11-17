// src/services/routeService.js

import { rawRouteData } from '../features/routes/data/routeMockData'; // <-- 1. SỬA IMPORT

// --- Giả lập Database (Lưu trong bộ nhớ) ---
let routes = [...rawRouteData]; // <-- 2. SỬA TÊN BIẾN

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
 * Lấy danh sách tuyến (có phân trang giả lập)
 */
const getRoutes = (page = 1, pageSize = 7) => { // <-- 3. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: getRoutes ---', { page, pageSize });

  const start = (page - 1) * pageSize;
  const end = page * pageSize;

  const paginatedData = routes.slice(start, end); // <-- 4. SỬA TÊN BIẾN

  return mockApi({
    data: paginatedData,
    total: routes.length, // <-- 5. SỬA TÊN BIẾN
  });
};

/**
 * Xóa một tuyến dựa trên ID
 */
const deleteRoute = (id) => { // <-- 6. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: deleteRoute ---', { id });

  routes = routes.filter((r) => r.id !== id); // <-- 7. SỬA TÊN BIẾN

  return mockApi({ success: true });
};

/**
 * Thêm một tuyến mới
 */
const createRoute = (data) => { // <-- 8. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: createRoute ---', data);

  const newRoute = {
    ...data,
    id: `r${new Date().getTime()}`, // Tạo ID giả
  };

  routes.unshift(newRoute); // <-- 9. SỬA TÊN BIẾN

  return mockApi({ success: true, route: newRoute });
};

/**
 * Cập nhật một tuyến dựa trên ID
 */
const updateRoute = (id, data) => { // <-- 10. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: updateRoute ---', { id, data });

  let targetRoute = null;

  routes = routes.map((r) => { // <-- 11. SỬA TÊN BIẾN
    if (r.id === id) {
      targetRoute = { ...r, ...data }; // Cập nhật data
      return targetRoute;
    }
    return r;
  });

  if (targetRoute) {
    return mockApi({ success: true, route: targetRoute });
  } else {
    return Promise.reject(new Error('Không tìm thấy tuyến để cập nhật'));
  }
};


// --- Xuất ra service ---
export const routeService = { // <-- 12. SỬA TÊN EXPORT
  getRoutes,
  deleteRoute,
  createRoute,
  updateRoute,
};