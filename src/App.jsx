// src/App.jsx
import React from 'react';
// 1. IMPORT THÊM <App> VÀ <ConfigProvider>
import { Layout, ConfigProvider, App } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from '~/components/Sidebar';
import Header from '~/components/Header';
import viVN from 'antd/locale/vi_VN'; // Import ngôn ngữ Tiếng Việt

const { Content, Footer } = Layout;

const AppLayout = () => {
  return (
    // 2. BỌC MỌI THỨ TRONG <ConfigProvider> ĐỂ CÓ TIẾNG VIỆT
    <ConfigProvider locale={viVN}>
      {/* 3. BỌC MỌI THỨ TRONG <App> ĐỂ MODAL/MESSAGE HOẠT ĐỘNG */}
      <App> 
        <Layout style={{ minHeight: '100vh' }}>
          <Sidebar />
          <Layout>
            <Header />
            <Content style={{ margin: '24px 16px', padding: 24, background: '#f5f5f5', borderRadius: '8px' }}>
              <Outlet /> {/* Các trang con sẽ render ở đây */}
            </Content>
            <Footer style={{ textAlign: 'center', background: 'none' }}>
              Bus Management System ©2025 Created by You
            </Footer>
          </Layout>
        </Layout>
      </App>
    </ConfigProvider>
  );
};

export default AppLayout;