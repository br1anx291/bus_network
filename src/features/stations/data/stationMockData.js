// src/features/stations/data/stationMockData.js

// Dữ liệu thô - Giả lập database (MASTER VERSION - DA NANG)
export const rawStationData = [
  // Giả lập ID tuyến: Tuyến 01 (r1), Tuyến 05 (r2)
  { 
    id: 's1', 
    name: 'Bến xe Trung tâm Đà Nẵng', 
    address: 'Tôn Đức Thắng, Liên Chiểu, Đà Nẵng', 
    status: 'Hoạt động',
    // Dữ liệu Bản đồ
    lat: 16.054028, 
    lon: 108.171621, 
    routeIds: ['r1', 'r2'] 
  },
  { 
    id: 's2', 
    name: 'Trạm Cầu Rồng (Đuôi Cầu)', 
    address: 'Đường 2/9, Hải Châu, Đà Nẵng', 
    status: 'Hoạt động',
    // Dữ liệu Bản đồ
    lat: 16.060653, 
    lon: 108.219774, 
    routeIds: ['r1'] 
  },
  { 
    id: 's3', 
    name: 'Trạm Chợ Hàn', 
    address: 'Trần Phú, Hải Châu, Đà Nẵng', 
    status: 'Hoạt động',
    // Dữ liệu Bản đồ
    lat: 16.068526, 
    lon: 108.223848, 
    routeIds: ['r2'] 
  },
  { 
    id: 's4', 
    name: 'Trạm Biển Mỹ Khê', 
    address: 'Võ Nguyên Giáp, Sơn Trà, Đà Nẵng', 
    status: 'Hoạt động',
    // Dữ liệu Bản đồ
    lat: 16.064633, 
    lon: 108.245863, 
    routeIds: ['r1'] 
  },
  { 
    id: 's5', 
    name: 'Trạm Ngũ Hành Sơn', 
    address: 'Lê Văn Hiến, Ngũ Hành Sơn, Đà Nẵng', 
    status: 'Bảo trì', // <-- Dữ liệu cho CRUD
    // Dữ liệu Bản đồ
    lat: 16.006458, 
    lon: 108.263344, 
    routeIds: ['r1'] 
  },
  { 
    id: 's6', 
    name: 'ĐH Bách Khoa - ĐH Đà Nẵng', 
    address: 'Ngô Sĩ Liên, Liên Chiểu, Đà Nẵng', 
    status: 'Hoạt động',
    // Dữ liệu Bản đồ
    lat: 16.075631, 
    lon: 108.153226, 
    routeIds: ['r2'] 
  },
  { 
    id: 's7', 
    name: 'Sân bay Quốc tế Đà Nẵng', 
    address: 'Nguyễn Văn Linh, Thanh Khê, Đà Nẵng', 
    status: 'Hoạt động',
    // Dữ liệu Bản đồ
    lat: 16.043906, 
    lon: 108.199431, 
    routeIds: ['r1', 'r2'] 
  }
];

// Định nghĩa màu cho các Tag Trạng thái
export const STATUS_COLOR_MAP = {
  'Hoạt động': 'success',
  'Bảo trì': 'error',
  'Không hoạt động': 'default', // Thêm trạng thái này để dự phòng
};