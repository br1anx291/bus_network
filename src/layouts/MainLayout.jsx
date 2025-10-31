// src/layouts/MainLayout.jsx
import React from 'react';
import {
  Layout,
  Menu,
  // Button, // <-- 1. Xóa Button
  Input,
  Flex,
  Avatar,
  Dropdown,
  Badge,
} from 'antd';
import {
  WarningOutlined,
  BarChartOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined, // <-- Vẫn cần icon này
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  LineChartOutlined,
  EnvironmentOutlined,
  ControlOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './MainLayout.module.css';

const { Header, Content, Sider } = Layout;
const { Search } = Input;

// 2. TÁCH MENU THÀNH 2 NHÓM (dựa trên code mới của bạn)

// NHÓM 1: DANH MỤC
const mainMenuItems = [
  { key: '/', icon: <BarChartOutlined />, label: 'Tổng Quan' },
  { key: '/ban-do', icon: <EnvironmentOutlined />, label: 'Bản Đồ' },
  { key: '/van-hanh', icon: <ControlOutlined />, label: 'Vận Hành' },
  { key: '/su-co', icon: <WarningOutlined />, label: 'Sự Cố' },
  { key: '/phan-tich', icon: <LineChartOutlined />, label: 'Phân Tích' },
  { key: '/quan-ly', icon: <TeamOutlined />, label: 'Quản Lý' },
];

// NHÓM 2: KHÁC
const otherMenuItems = [
  { key: '/cai-dat', icon: <SettingOutlined />, label: 'Cài Đặt' },
  // 3. Thêm "Đăng xuất" vào đây
  {
    key: '/dang-xuat',
    icon: <LogoutOutlined />,
    label: 'Đăng xuất',
    danger: true,
  },
];

// Menu User (không đổi)
const userMenuItems = [
  { key: '1', label: 'Thông tin cá nhân' },
  { key: '2', label: 'Đổi mật khẩu' },
  { type: 'divider' },
  { key: '3', label: 'Đăng xuất', danger: true },
];

// --- COMPONENT LAYOUT (ĐÃ TÁI CẤU TRÚC) ---
const MainLayout = () => {
  const navigate = useNavigate();
  const handleMenuClick = (e) => {
    navigate(e.key);
  };
  const onSearch = (value) => {
    console.log('Bạn đang tìm kiếm:', value);
  };

  return (
    <Layout className={styles.layoutRoot}>
      {/* ----- SIDEBAR (ĐÃ TÁI CẤU TRÚC) ----- */}
      <Sider
        width={240}
        className={styles.sidebar} // CSS module sẽ lo `justify-content`
      >
        {/* 4. Nhóm trên */}
        <div>
          <div className={styles.logo}>
            BusNetwork
          </div>

          <div className={styles.menuTitle}>DANH MỤC</div>
          <Menu
            onClick={handleMenuClick}
            defaultSelectedKeys={['/']}
            mode="inline"
            theme="light"
            items={mainMenuItems} // <-- Dùng mảng 1
            className={styles.sidebarMenu}
          />
        </div>

        {/* 5. Nhóm dưới */}
        <div>
          <div className={styles.menuTitle}>KHÁC</div>
          <Menu
            onClick={handleMenuClick}
            mode="inline"
            theme="light"
            items={otherMenuItems} // <-- Dùng mảng 2
            className={styles.sidebarMenu}
          />
        </div>
        
        {/* 6. Xóa <Button> "Đăng xuất" ở đây */}
        
      </Sider>

      {/* ----- PHẦN BÊN PHẢI (Không đổi) ----- */}
      <Layout>
        <Header className={styles.header}>
          <Flex justify="space-between" align="center" style={{ height: '100%' }}>
            <Search
              placeholder="Tìm kiếm..."
              onSearch={onSearch}
              style={{ width: 625 }}
            />
            <Flex align="center" gap="middle">
              <Badge count={3}>
                <BellOutlined style={{ fontSize: '20px' }} />
              </Badge>
              <span style={{ fontWeight: 'bold' }}>Chào, Tuyết My</span>
              <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
                <Avatar
                  style={{ cursor: 'pointer', backgroundColor: '#87d068' }}
                  icon={<UserOutlined />}
                />
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