// src/features/stations/data/stationMockData.js

// Dữ liệu thô - Giả lập database (MASTER VERSION)
export const rawStationData = [
  // Giả lập ID tuyến: Tuyến 01 (r1), Tuyến 05 (r2)
  { 
    id: 's1', 
    name: 'Bến Thành', 
    address: 'Quận 1, TP.HCM', 
    status: 'Hoạt động',
    // Dữ liệu Bản đồ
    lat: 10.7725, 
    lon: 106.6980, 
    routeIds: ['r1', 'r2'] 
  },
  { 
    id: 's2', 
    name: 'ĐH Bách Khoa', 
    address: 'Quận 10, TP.HCM', 
    status: 'Hoạt động',
    // Dữ liệu Bản đồ
    lat: 10.7751, 
    lon: 106.6575, 
    routeIds: ['r2'] 
  },
  { 
    id: 's3', 
    name: 'Chợ Lớn', 
    address: 'Quận 5, TP.HCM', 
    status: 'Hoạt động',
    // Dữ liệu Bản đồ
    lat: 10.7513, 
    lon: 106.6601, 
    routeIds: ['r1'] 
  },
  { 
    id: 's4', 
    name: 'Bến xe Miền Tây', 
    address: 'Bình Tân, TP.HCM', 
    status: 'Hoạt động',
    // Dữ liệu Bản đồ
    lat: 10.7380, 
    lon: 106.6210, 
    routeIds: ['r1'] 
  },
  { 
    id: 's5', 
    name: 'Đầm Sen', 
    address: 'Quận 11, TP.HCM', 
    status: 'Bảo trì', // <-- Dữ liệu cho CRUD
    // Dữ liệu Bản đồ
    lat: 10.7675, 
    lon: 106.6416, 
    routeIds: ['r2'] 
  },
];

// Định nghĩa màu cho các Tag Trạng thái
export const STATUS_COLOR_MAP = {
  'Hoạt động': 'success',
  'Bảo trì': 'error',
};