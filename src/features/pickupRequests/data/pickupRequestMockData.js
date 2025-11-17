// src/features/pickupRequests/data/pickupRequestMockData.js

// Dữ liệu thô - Giả lập database
// Chúng ta sẽ "giả" luôn tên User/Trạm/Tuyến cho dễ nhìn
export const rawPickupRequestData = [
  { id: 'pr1', userName: 'Lý Thị M', stationName: 'Bến Thành', tripName: 'Tuyến 01', requestTime: '10:30 AM 25/10/2025', status: 'Đang chờ' },
  { id: 'pr2', userName: 'Hoàng Văn K', stationName: 'ĐH Bách Khoa', tripName: 'Tuyến 05', requestTime: '10:32 AM 25/10/2025', status: 'Đang chờ' },
  { id: 'pr3', userName: 'Đỗ Thị N', stationName: 'Chợ Lớn', tripName: 'Tuyến 01', requestTime: '10:35 AM 25/10/2025', status: 'Đã duyệt' },
  { id: 'pr4', userName: 'Lý Thị M', stationName: 'Bến xe Q.8', tripName: 'Tuyến 08', requestTime: '10:40 AM 25/10/2025', status: 'Đã hủy' },
];

// Định nghĩa màu cho các Tag Trạng thái
export const STATUS_COLOR_MAP = {
  'Đang chờ': 'processing',
  'Đã duyệt': 'success',
  'Đã hủy': 'error',
};