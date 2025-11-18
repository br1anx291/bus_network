// src/features/vehicles/data/vehicleMockData.js

// Dữ liệu thô - Giả lập database (MASTER VERSION - DA NANG)
export const rawVehicleData = [
  { 
    id: 'v1', 
    plate: '43B-012.34', 
    model: 'Thaco Bus', 
    type: 'Xe 45 chỗ', 
    capacity: 45, 
    status: 'Đang chạy',
    routeId: 'r1', // Tuyến 01
    // Dữ liệu cho Bản đồ
    routeName: 'Tuyến 01',
    driverName: 'Nguyễn Văn A',
    speed: 45,
    // Tọa độ: Đang chạy gần Cầu Rồng
    lat: 16.0612, 
    lon: 108.2205, 
  },
  { 
    id: 'v2', 
    plate: '43B-056.78', 
    model: 'Ford Transit', 
    type: 'Xe 16 chỗ', 
    capacity: 16, 
    status: 'Đang chạy',
    routeId: 'r2', // Tuyến 05
    routeName: 'Tuyến 05',
    driverName: 'Trần Thị B',
    speed: 35,
    // Tọa độ: Đang chạy gần Chợ Hàn (Đường Trần Phú)
    lat: 16.0688, 
    lon: 108.2242, 
  },
  { 
    id: 'v3', 
    plate: '43B-099.99', 
    model: 'Hyundai County', 
    type: 'Xe 29 chỗ', 
    capacity: 29, 
    status: 'Bảo trì',
    routeId: 'r3', // Tuyến R16
    // Dữ liệu cho Bản đồ
    routeName: 'Tuyến R16',
    driverName: 'Lê Văn C',
    speed: 0,
    // Tọa độ: Đang nằm tại Bến xe Trung tâm
    lat: 16.0540, 
    lon: 108.1716, 
  },
  { 
    id: 'v4', 
    plate: '92K-001.23', 
    model: 'Thaco Garden', 
    type: 'Xe 45 chỗ', 
    capacity: 45, 
    status: 'Đang chạy',
    routeId: 'r1', // Tuyến 01
    routeName: 'Tuyến 01',
    driverName: 'Phạm Hữu D',
    speed: 50,
    // Tọa độ: Đang chạy gần Ngũ Hành Sơn (Đường Lê Văn Hiến)
    lat: 16.0065, 
    lon: 108.2635, 
  },
  { 
    id: 'v5', 
    plate: '43B-555.55', 
    model: 'VinBus', 
    type: 'Xe điện', 
    capacity: 60, 
    status: 'Không hoạt động',
    routeId: null, 
    routeName: 'N/A',
    // Dữ liệu cho Bản đồ (Vẫn có tọa độ để biết xe đang đậu ở đâu)
    lat: 16.0439, // Đậu tại Sân bay
    lon: 108.1994, 
    driverName: 'Chưa gán',
    speed: 0,
  },
];

// Định nghĩa màu cho các Tag Trạng thái (đầy đủ)
export const STATUS_COLOR_MAP = {
  'Đang chạy': 'success',
  'Không hoạt động': 'default',
  'Bảo trì': 'error',
};