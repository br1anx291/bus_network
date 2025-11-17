// src/features/vehicles/data/vehicleMockData.js

// Dữ liệu thô - Giả lập database (MASTER VERSION)
export const rawVehicleData = [
  { 
    id: 'v1', 
    plate: '50H-12345', 
    model: 'Mercedes-Benz Sprinter', 
    type: 'Xe 29 chỗ', 
    capacity: 29, // <-- Thêm cho CRUD
    status: 'Đang chạy',
    routeId: 'r1', // <-- Thêm cho CRUD
    // Dữ liệu cho Bản đồ
    routeName: 'Tuyến 01',
    lat: 10.7769, 
    lon: 106.7009, 
    driverName: 'Nguyễn Văn A',
  },
  { 
    id: 'v2', 
    plate: '29A-98765', 
    model: 'Ford Transit', 
    type: 'Xe 16 chỗ', 
    capacity: 16, // <-- Thêm cho CRUD
    status: 'Đang chạy',
    routeId: 'r2', // <-- Thêm cho CRUD
    routeName: 'Tuyến 05',
    // Dữ liệu cho Bản đồ
    lat: 10.7796, 
    lon: 106.6990, 
    driverName: 'Trần Thị B',
  },
  { 
    id: 'v3', 
    plate: '51B-45678', 
    model: 'Hyundai County', 
    type: 'Xe 29 chỗ', 
    capacity: 29, // <-- Thêm cho CRUD
    status: 'Bảo trì',
    routeId: null, // <-- Thêm cho CRUD
    // Dữ liệu cho Bản đồ
    routeName: 'N/A',
    lat: null, 
    lon: null, 
    driverName: 'Lê Văn C',
  },
  { 
    id: 'v4', 
    plate: '92K-00123', 
    model: 'Ford Transit', 
    type: 'Xe 16 chỗ', 
    capacity: 16, // <-- Thêm cho CRUD
    status: 'Đang chạy',
    routeId: 'r1', // <-- Thêm cho CRUD
    // Dữ liệu cho Bản đồ
    routeName: 'Tuyến 03',
    lat: 10.7725, 
    lon: 106.6980, 
    driverName: 'Phạm Hữu D',
  },
  { 
    id: 'v5', 
    plate: '30N-55555', 
    model: 'Thaco Town', 
    type: 'Xe 45 chỗ', 
    capacity: 45, // <-- Thêm cho CRUD
    status: 'Không hoạt động',
    routeId: null, // <-- Thêm cho CRUD
    routeName: 'Tuyến 04',
    // Dữ liệu cho Bản đồ (không có)
    lat: null, 
    lon: null, 
    driverName: 'Chưa gán',
  },
];

// Định nghĩa màu cho các Tag Trạng thái (đầy đủ)
export const STATUS_COLOR_MAP = {
  'Đang chạy': 'success',
  'Không hoạt động': 'default',
  'Bảo trì': 'error',
};