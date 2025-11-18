// src/data/dashboardMockData.js

// --- DỮ LIỆU THẺ STATS (Cập nhật theo dữ liệu mẫu 5 xe) ---
export const statsData = [
  {
    title: 'Xe đang hoạt động',
    value: '3/5', // Khớp với vehicleMockData (3 xe chạy, 1 bảo trì, 1 không hoạt động)
    icon: 'CarOutlined', 
    bgColor: '#FFFBE6',
  },
  {
    title: 'Tài xế trực tuyến',
    value: '4/5',
    icon: 'UserOutlined', 
    bgColor: '#E6F7FF',
  },
  {
    title: 'Sự cố mới',
    value: 1, // Xe 43B-099.99 đang bảo trì
    icon: 'WarningOutlined', 
    bgColor: '#FFF1F0',
  },
  {
    title: 'Yêu cầu đón',
    value: 4, // Khớp với pickupRequestMockData
    icon: 'BellOutlined', 
    bgColor: '#F6FFED',
  },
];

// --- DỮ LIỆU BIỂU ĐỒ (Cập nhật tỷ lệ) ---
export const donutData = [
  { type: 'Đang chạy', value: 3 },
  { type: 'Bảo trì', value: 1 },
  { type: 'Ngoại tuyến', value: 1 },
];

// --- BẢN ĐỒ MÀU (Không đổi) ---
export const STATUS_COLOR_MAP = {
  'Đang chạy': '#34C759',
  'Bảo trì': '#8E8E93',
  'Ngoại tuyến': '#FF3B30',
};

// --- DỮ LIỆU BẢNG (Hoạt động gần đây - Cập nhật địa danh Đà Nẵng) ---
export const tableData = [
  {
    key: '1',
    type: 'Sự cố',
    details: 'Xe 43B-099.99 báo hỏng lốp', // Xe đang bảo trì trong mock data
    driver: 'Lê Văn C',
    time: '10:30 AM',
    status: 'Mới',
  },
  {
    key: '2',
    type: 'Yêu cầu',
    details: 'Yêu cầu đón tại Trạm Chợ Hàn',
    driver: 'Trần Thị B',
    time: '10:33 AM',
    status: 'Đang chờ',
  },
  {
    key: '3',
    type: 'Yêu Cầu',
    details: 'Yêu cầu đón tại Trạm Cầu Rồng',
    driver: 'Nguyễn Văn A',
    time: '10:35 AM',
    status: 'Hoàn thành',
  },
];

// --- DỮ LIỆU BẢN ĐỒ MINI (Đồng bộ với VehicleMockData & Đà Nẵng) ---
export const BUS_LOCATIONS = [
  { 
    id: 1, 
    lat: 16.0612, 
    lng: 108.2205, 
    name: 'Bus 43B-012.34', // Xe v1
    driver: 'Nguyễn Văn A', 
    route: 'Tuyến 01: BX Trung Tâm - Hội An', 
    speed: 45 
  },
  { 
    id: 2, 
    lat: 16.0688, 
    lng: 108.2242, 
    name: 'Bus 43B-056.78', // Xe v2
    driver: 'Trần Thị B', 
    route: 'Tuyến 05: Nguyễn Tất Thành - Xuân Diệu', 
    speed: 35 
  },
  { 
    id: 3, 
    lat: 16.0065, 
    lng: 108.2635, 
    name: 'Bus 92K-001.23', // Xe v4 (Xe Quảng Nam)
    driver: 'Phạm Hữu D', 
    route: 'Tuyến 01: BX Trung Tâm - Hội An', 
    speed: 50 
  },
];

// Tọa độ trung tâm Đà Nẵng (Cầu Rồng)
export const initialViewState = {
  latitude: 16.0600,
  longitude: 108.2200,
  zoom: 12,
};