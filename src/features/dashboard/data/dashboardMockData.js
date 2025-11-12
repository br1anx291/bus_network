// src/data/dashboardMockData.js

// --- DỮ LIỆU THẺ STATS (KHÔNG CÒN JSX) ---
export const statsData = [
  {
    title: 'Xe đang hoạt động',
    value: '42/50',
    icon: 'CarOutlined', // <-- Chỉ là một chuỗi
    bgColor: '#FFFBE6',
  },
  {
    title: 'Tài xế trực tuyến',
    value: '45/50',
    icon: 'UserOutlined', // <-- Chỉ là một chuỗi
    bgColor: '#E6F7FF',
  },
  {
    title: 'Sự cố mới',
    value: 3,
    icon: 'WarningOutlined', // <-- Chỉ là một chuỗi
    bgColor: '#FFF1F0',
  },
  {
    title: 'Yêu cầu đón',
    value: 12,
    icon: 'BellOutlined', // <-- Chỉ là một chuỗi
    bgColor: '#F6FFED',
  },
];

// --- DỮ LIỆU BIỂU ĐỒ (Không đổi) ---
export const donutData = [
  { type: 'Đang chạy', value: 42 },
  { type: 'Bảo trì', value: 5 },
  { type: 'Ngoại tuyến', value: 3 },
];

// --- BẢN ĐỒ MÀU (Không đổi) ---
export const STATUS_COLOR_MAP = {
  'Đang chạy': '#34C759',
  'Bảo trì': '#8E8E93',
  'Ngoại tuyến': '#FF3B30',
};

// --- DỮ LIỆU BẢNG (Không đổi) ---
export const tableData = [
  {
    key: '1',
    type: 'Sự cố',
    details: 'Xe 50H-123 báo hỏng phanh',
    driver: 'Nguyen Van A',
    time: '10:30 AM',
    status: 'Mới',
  },
  {
    key: '2',
    type: 'Yêu cầu',
    details: 'Yêu cầu đón tại trạm 5 (Le Duan)',
    driver: 'Tran Van B',
    time: '10:33 AM',
    status: 'Đang chờ',
  },
  {
    key: '3',
    type: 'Yêu Cầu',
    details: 'Yêu cầu đón tại trạm 1 (Ton Duc Thang)',
    driver: 'Huynh Van C',
    time: '10:35 AM',
    status: 'Hoàn thành',
  },
];

// --- DỮ LIỆU BẢN ĐỒ ---
export const BUS_LOCATIONS = [
  { id: 1, lat: 10.7769, lng: 106.7009, name: 'Bus 50H-123', driver: 'Nguyễn Văn A', route: 'Bến Thành - Suối Tiên', speed: 35 },
  { id: 2, lat: 10.7796, lng: 106.6990, name: 'Bus 51B-456', driver: 'Trần Thị B', route: 'Quận 1 - Quận 7', speed: 40 },
  { id: 3, lat: 10.7725, lng: 106.6980, name: 'Bus 59Z-789', driver: 'Lê Văn C', route: 'Sân bay - Bến xe Miền Đông', speed: 30 },
];

export const initialViewState = {
  latitude: 10.7760,
  longitude: 106.7000,
  zoom: 14,
};