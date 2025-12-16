// src/components/layout/MainLayout/MainLayout.jsx
import React, { useState, useMemo } from 'react';
import {
  Layout, Menu, Input, Flex, Avatar, Dropdown, Badge, Popover, List, Typography, 
  AutoComplete, Tooltip, Empty // [UPDATE] 1. Thêm Tooltip
} from 'antd';
import {
  WarningOutlined, BarChartOutlined, TeamOutlined, SettingOutlined, LogoutOutlined,
  SearchOutlined, BellOutlined, UserOutlined, LineChartOutlined, EnvironmentOutlined,
  ControlOutlined, InfoCircleOutlined,
  CarOutlined, NodeIndexOutlined, HomeOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './MainLayout.module.css';
import { authService } from '~/services/authService'; 
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
// [UPDATE] 2. Import Context
import { useNotification } from '~/contexts/NotificationContext';

import logoImg from '~/assets/bus-logo.png';

// 3. IMPORT DATA ĐỂ TÌM KIẾM
import { rawVehicleData } from '~/features/vehicles/data/vehicleMockData';
import { rawRouteData } from '~/features/routes/data/routeMockData';
import { rawStationData } from '~/features/stations/data/stationMockData';

// Cấu hình dayjs
dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Header, Content, Sider } = Layout;
const { Text } = Typography;


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

  // [UPDATE] 3. Sử dụng Context thay vì State cục bộ
  const { settings, unreadCount, notifications, markAsRead } = useNotification();
  
  // State mở/đóng popover
  const [openNotif, setOpenNotif] = useState(false);
  
  // 4. STATE CHO TÌM KIẾM
  const [searchOptions, setSearchOptions] = useState([]);

  // --- 5. XỬ LÝ DỮ LIỆU TÌM KIẾM (GỘP 3 NGUỒN) ---
  const searchDataSource = useMemo(() => {
    const vehicles = rawVehicleData.map(v => ({
      value: v.plate, 
      label: ( 
        <Flex justify="space-between">
          <span><CarOutlined style={{ marginRight: 8, color: '#1890ff' }} /> {v.plate}</span>
          <Text type="secondary" style={{ fontSize: 12 }}>Xe {v.capacity} chỗ</Text>
        </Flex>
      ),
      type: 'vehicle',
      link: '/van-hanh/quan-ly-xe', 
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
    const filtered = searchDataSource.filter(item => 
      item.value.toLowerCase().includes(searchText.toLowerCase())
    );
    setSearchOptions(filtered.slice(0, 5));
  };

  const handleSelect = (value, option) => {
    navigate(option.link);
  };

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
  const handleItemClick = (item) => {
    if (!item.is_read) {
      markAsRead(item.id); // Gọi API đánh dấu đã đọc
    }
    // Có thể navigate tới đâu đó tùy nội dung tin nhắn
    // navigate('/su-co'); 
  };

  const handleNotifOpenChange = (newOpen) => {
    setOpenNotif(newOpen);
    // Nếu muốn khi mở ra thì reset count, bạn có thể gọi hàm markAsRead từ Context ở đây
  };

  // [UPDATE] Logic kiểm tra xem người dùng có bật thông báo không
  // Mặc định là true nếu settings chưa tải xong
  const isNotificationEnabled = settings?.app_notification ?? true;

const notificationContent = (
    <div style={{ width: 320, maxHeight: 400, overflowY: 'auto' }}>
      {notifications && notifications.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item 
                onClick={() => handleItemClick(item)}
                style={{ 
                    cursor: 'pointer', 
                    padding: '10px',
                    // Nếu chưa đọc thì nền hơi xanh nhạt, đã đọc thì trắng
                    background: item.is_read ? 'transparent' : '#e6f7ff',
                    transition: 'background 0.3s'
                }}
            >
              <List.Item.Meta
                avatar={
                    // Nếu chưa đọc hiện icon ! xanh, đã đọc hiện icon check xám
                    !item.is_read 
                    ? <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 20 }} />
                    : <CheckCircleOutlined style={{ color: '#ccc', fontSize: 20 }} />
                }
                title={
                    <Text strong={!item.is_read} style={{ fontSize: 13 }}>
                        {item.message}
                    </Text>
                }
                description={
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        {/* Dùng dayjs để hiện "5 phút trước" từ field 'time' hoặc 'created' */}
                        {dayjs(item.time || item.created).fromNow()}
                    </Text>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty description="Không có thông báo mới" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      
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
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '10px'
              }}
            >
              <img src={logoImg} alt="BusNetwork Logo" style={{ height: '28px', width: 'auto' }} 
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
            
            {/* --- THANH TÌM KIẾM THÔNG MINH --- */}
            <AutoComplete
              popupClassName="search-popup"
              style={{ width: 400 }}
              options={searchOptions}
              onSelect={handleSelect}
              onSearch={handleSearch}
            >
              <Input.Search 
                placeholder="Tìm biển số xe, tuyến, trạm..." 
                className={styles.headerSearch}
                enterButton
                allowClear
              />
            </AutoComplete>

            <Flex align="center" gap="middle">
              
              {/* [UPDATE] 4. Khu vực Chuông Thông Báo */}
              {isNotificationEnabled ? (
                // TRƯỜNG HỢP BẬT THÔNG BÁO: Hiển thị Badge + Popover
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
                    <Badge count={unreadCount}> {/* Dùng số liệu từ Context */}
                        <BellOutlined className={styles.notificationIcon} />
                    </Badge>
                    </div>
                </Popover>
              ) : (
                // TRƯỜNG HỢP TẮT THÔNG BÁO: Hiển thị icon mờ + Tooltip
                <Tooltip title="Bạn đã tắt thông báo trên Web trong phần Cài đặt">
                    <div style={{ cursor: 'not-allowed', display: 'flex', alignItems: 'center', opacity: 0.4 }}>
                    <Badge dot={false}> 
                        <BellOutlined style={{ fontSize: '20px', color: '#999' }} />
                    </Badge>
                    </div>
                </Tooltip>
              )}

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