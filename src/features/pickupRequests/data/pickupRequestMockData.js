// src/features/pickupRequests/data/pickupRequestMockData.js

// Dữ liệu thô - Giả lập database (MASTER VERSION - DA NANG)
export const rawPickupRequestData = [
  { 
    id: 'pr1', 
    userName: 'Lý Thị M', 
    stationName: 'Trạm Cầu Rồng', 
    tripName: 'Tuyến 01', 
    requestTime: '10:30 AM 18/11/2025', 
    status: 'Đang chờ' 
  },
  { 
    id: 'pr2', 
    userName: 'Hoàng Văn K', 
    stationName: 'ĐH Bách Khoa - ĐHĐN', 
    tripName: 'Tuyến 05', 
    requestTime: '10:32 AM 18/11/2025', 
    status: 'Đang chờ' 
  },
  { 
    id: 'pr3', 
    userName: 'Đỗ Thị N', 
    stationName: 'Trạm Chợ Hàn', 
    tripName: 'Tuyến 05', 
    requestTime: '10:35 AM 18/11/2025', 
    status: 'Đã duyệt' 
  },
  { 
    id: 'pr4', 
    userName: 'Phạm Văn H', 
    stationName: 'Trạm Ngũ Hành Sơn', 
    tripName: 'Tuyến 01', 
    requestTime: '10:40 AM 18/11/2025', 
    status: 'Đã hủy' 
  },
];

// Định nghĩa màu cho các Tag Trạng thái
export const STATUS_COLOR_MAP = {
  'Đang chờ': 'processing',
  'Đã duyệt': 'success',
  'Đã hủy': 'error',
};