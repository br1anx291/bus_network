// src/components/layout/MainLayout/MainLayout.jsx
import React, { useState, useMemo } from 'react';
import {
  Layout, Menu, Input, Flex, Avatar, Dropdown, Badge, Popover, List, Typography, 
  AutoComplete // 1. IMPORT AutoComplete
} from 'antd';
import {
  WarningOutlined, BarChartOutlined, TeamOutlined, SettingOutlined, LogoutOutlined,
  SearchOutlined, BellOutlined, UserOutlined, LineChartOutlined, EnvironmentOutlined,
  ControlOutlined, InfoCircleOutlined,
  CarOutlined, NodeIndexOutlined, HomeOutlined // 2. IMPORT ICON MỚI
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './MainLayout.module.css';
import { authService } from '~/services/authService'; 

import logoImg from '~/assets/bus-logo.png';

// 3. IMPORT DATA ĐỂ TÌM KIẾM
import { rawVehicleData } from '~/features/vehicles/data/vehicleMockData';
import { rawRouteData } from '~/features/routes/data/routeMockData';
import { rawStationData } from '~/features/stations/data/stationMockData';

const { Header, Content, Sider } = Layout;
// const { Search } = Input; // <-- KHÔNG DÙNG CÁI NÀY NỮA
const { Text } = Typography;

// --- DATA THÔNG BÁO (Giữ nguyên) ---
const notificationsData = [
  { title: 'Xe 50H-12345 rời khỏi lộ trình', time: '5 phút trước', type: 'danger' },
  { title: 'Tài xế Nguyễn Văn A báo cáo sự cố', time: '10 phút trước', type: 'warning' },
  { title: 'Hệ thống bảo trì định kỳ', time: '1 giờ trước', type: 'info' },
];

// --- MENU CHÍNH (Giữ nguyên) ---
const mainMenuItems = [
  { key: '/', icon: <BarChartOutlined />, label: 'Tổng Quan' },
  { key: '/ban-do', icon: <EnvironmentOutlined />, label: 'Bản Đồ' },
  {
    key: '/van-hanh', icon: <ControlOutlined />, label: 'Vận Hành',
    children: [
      { key: '/van-hanh/quan-ly-xe', label: 'Quản lý xe' },
      { key: '/van-hanh/quan-ly-tuyen', label: 'Quản lý tuyến' },
      { key: '/van-hanh/quan-ly-tram', label: 'Quản lý trạm' },
      { key: '/van-hanh/quan-ly-chuyen', label: 'Quản lý chuyến' },
      { key: '/van-hanh/yeu-cau-don', label: 'Yêu cầu đón' },
    ],
  },
  { key: '/su-co', icon: <WarningOutlined />, label: 'Sự Cố' },
  { key: '/phan-tich', icon: <LineChartOutlined />, label: 'Phân Tích' },
  {
    key: '/quan-ly-nguoi-dung', icon: <TeamOutlined />, label: 'Quản lý Người dùng',
    children: [
      { key: '/quan-ly-nguoi-dung/tai-xe', label: 'Tài xế' },
      { key: '/quan-ly-nguoi-dung/hanh-khach', label: 'Hành khách' },
      { key: '/quan-ly-nguoi-dung/admin', label: 'Admin' },
    ],
  },
];

const otherMenuItems = [
  { key: '/cai-dat', icon: <SettingOutlined />, label: 'Cài Đặt' },
  { key: '/dang-xuat', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
];

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const [notifCount, setNotifCount] = useState(5);
  const [openNotif, setOpenNotif] = useState(false);
  
  // 4. STATE CHO TÌM KIẾM
  const [searchOptions, setSearchOptions] = useState([]);

  // --- 5. XỬ LÝ DỮ LIỆU TÌM KIẾM (GỘP 3 NGUỒN) ---
  // Tạo danh sách tìm kiếm tổng hợp từ MockData
  const searchDataSource = useMemo(() => {
    const vehicles = rawVehicleData.map(v => ({
      value: v.plate, // Cái hiển thị khi tìm
      label: ( // Giao diện hiển thị trong dropdown
        <Flex justify="space-between">
          <span><CarOutlined style={{ marginRight: 8, color: '#1890ff' }} /> {v.plate}</span>
          <Text type="secondary" style={{ fontSize: 12 }}>Xe {v.capacity} chỗ</Text>
        </Flex>
      ),
      type: 'vehicle',
      link: '/van-hanh/quan-ly-xe', // Link đích
    }));

    const routes = rawRouteData.map(r => ({
      value: r.name,
      label: (
        <Flex justify="space-between">
          <span><NodeIndexOutlined style={{ marginRight: 8, color: '#52c41a' }} /> {r.name}</span>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.startPoint} - {r.endPoint}</Text>
        </Flex>
      ),
      type: 'route',
      link: '/van-hanh/quan-ly-tuyen',
    }));

    const stations = rawStationData.map(s => ({
      value: s.name,
      label: (
        <Flex justify="space-between">
          <span><HomeOutlined style={{ marginRight: 8, color: '#faad14' }} /> {s.name}</span>
          <Text type="secondary" style={{ fontSize: 12 }}>{s.address}</Text>
        </Flex>
      ),
      type: 'station',
      link: '/van-hanh/quan-ly-tram',
    }));

    return [...vehicles, ...routes, ...stations];
  }, []);

  // --- 6. HÀM TÌM KIẾM (AUTOCOMPLETE) ---
  const handleSearch = (searchText) => {
    if (!searchText) {
      setSearchOptions([]);
      return;
    }
    // Lọc dữ liệu (Case insensitive)
    const filtered = searchDataSource.filter(item => 
      item.value.toLowerCase().includes(searchText.toLowerCase())
    );
    // Giới hạn hiển thị 5 kết quả đầu tiên cho gọn
    setSearchOptions(filtered.slice(0, 5));
  };

  const handleSelect = (value, option) => {
    console.log('Đã chọn:', option);
    // Điều hướng đến trang tương ứng
    // (Có thể nâng cao: Truyền thêm state để trang đích tự filter)
    navigate(option.link);
  };

  // (Các hàm xử lý cũ giữ nguyên)
  const selectedKeys = [location.pathname];
  const openKeys = [`/${location.pathname.split('/')[1]}`];

  const handleMenuClick = (e) => {
    if (e.key === '/dang-xuat') {
      authService.logout();
      return;
    }
    navigate(e.key);
  };

  const userMenuItems = [
    { key: 'profile', label: 'Thông tin cá nhân' },
    { key: 'security', label: 'Đổi mật khẩu' },
    { type: 'divider' },
    { key: 'logout', label: 'Đăng xuất', danger: true },
  ];

  const handleUserMenuClick = (e) => {
    if (e.key === 'logout') {
      authService.logout();
    } else if (e.key === 'profile') {
      navigate('/cai-dat', { state: { activeTab: 'profile' } });
    } else if (e.key === 'security') {
      navigate('/cai-dat', { state: { activeTab: 'security' } });
    }
  };

  const handleNotifOpenChange = (newOpen) => {
    setOpenNotif(newOpen);
    if (newOpen) setNotifCount(0);
  };

  const notificationContent = (
    <div style={{ width: 300 }}>
      <List
        itemLayout="horizontal"
        dataSource={notificationsData}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<InfoCircleOutlined style={{ color: item.type === 'danger' ? 'red' : '#1890ff' }} />}
              title={<span style={{ fontSize: 13 }}>{item.title}</span>}
              description={<span style={{ fontSize: 11 }}>{item.time}</span>}
            />
          </List.Item>
        )}
      />
      <div style={{ textAlign: 'center', marginTop: 8, borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
        <a style={{ fontSize: 12 }} onClick={() => setOpenNotif(false)}>Đóng</a>
      </div>
    </div>
  );

  return (
    <Layout className={styles.layoutRoot}>
      <Sider width={240} className={styles.sidebar}>
        <div>
          <Link to="/" style={{ textDecoration: 'none', display: 'block' }}>
            <div 
              className={styles.logo} 
              style={{ 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <img 
                src={logoImg}
                alt="BusNetwork Logo" 
                style={{ height: '28px', width: 'auto' }} 
              />
              <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#000000ff' }}>
                BusNetwork
              </span>
            </div>
          </Link>

          <div className={styles.menuTitle}>DANH MỤC</div>
          <Menu
            onClick={handleMenuClick}
            selectedKeys={selectedKeys}
            defaultOpenKeys={openKeys}
            mode="inline"
            theme="light"
            items={mainMenuItems} 
            className={styles.sidebarMenu}
          />
        </div>
        <div>
          <div className={styles.menuTitle}>KHÁC</div>
          <Menu
            onClick={handleMenuClick}
            selectedKeys={selectedKeys}
            mode="inline"
            theme="light"
            items={otherMenuItems}
            className={styles.sidebarMenu}
          />
        </div>
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <Flex justify="space-between" align="center" className={styles.headerFlex}>
            
            {/* --- 7. THANH TÌM KIẾM THÔNG MINH (AUTOCOMPLETE) --- */}
            <AutoComplete
              popupClassName="search-popup" // Class tùy chọn
              style={{ width: 400 }}        // Tăng độ rộng cho đẹp
              options={searchOptions}       // Danh sách kết quả
              onSelect={handleSelect}       // Xử lý khi chọn
              onSearch={handleSearch}       // Xử lý khi gõ
            >
              <Input.Search 
                placeholder="Tìm biển số xe, tuyến, trạm..." 
                className={styles.headerSearch}
                enterButton // Giữ nút kính lúp cho đẹp
                allowClear
              />
            </AutoComplete>
            {/* --- HẾT PHẦN TÌM KIẾM --- */}

            <Flex align="center" gap="middle">
              <Popover
                content={notificationContent}
                title="Thông báo mới"
                trigger="click"
                open={openNotif}
                onOpenChange={handleNotifOpenChange}
                placement="bottomRight"
                overlayStyle={{ zIndex: 2000 }}
              >
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Badge count={notifCount}>
                    <BellOutlined className={styles.notificationIcon} />
                  </Badge>
                </div>
              </Popover>

              <span className={styles.userName}>Chào, Tuyết My</span>
              
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleUserMenuClick }} 
                trigger={['click']}
              >
                <Avatar className={styles.userAvatar} icon={<UserOutlined />} style={{cursor: 'pointer'}}/>
              </Dropdown>
            </Flex>
          </Flex>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;