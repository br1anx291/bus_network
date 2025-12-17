
import React from 'react';
import { Layout, ConfigProvider, App } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from '~/components/Sidebar';
import Header from '~/components/Header';
import viVN from 'antd/locale/vi_VN'; 

const { Content, Footer } = Layout;

const AppLayout = () => {
  return (
    <ConfigProvider locale={viVN}>
      <App> 
        <Layout style={{ minHeight: '100vh' }}>
          <Sidebar />
          <Layout>
            <Header />
            <Content style={{ margin: '24px 16px', padding: 24, background: '#f5f5f5', borderRadius: '8px' }}>
              <Outlet /> 
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