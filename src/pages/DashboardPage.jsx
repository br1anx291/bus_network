// src/pages/DashboardPage.jsx
import React from 'react';
// 1. IMPORT THÊM "Typography" TỪ ANTD
import { Col, Row, Flex, Card, Typography } from 'antd';

// Import 3 component con
import StatCardsGroup from '../components/Dashboard/StatCardsGroup';
import VehicleStatusPieChart from '../components/Dashboard/VehicleStatusPieChart';
import RecentIncidentsTable from '../components/Dashboard/RecentIncidentsTable';

// 2. LẤY COMPONENT "Title" RA
const { Title } = Typography;

const DashboardPage = () => {
  return (
    <Flex vertical gap="large">
      {/* 3. THÊM TIÊU ĐỀ "TỔNG QUAN" Ở ĐÂY */}
      <Title level={3} style={{ margin: 0,  }}>
        Tổng quan
      </Title>

      {/* ----- 1. CỤM THẺ THỐNG KÊ ----- */}
      <StatCardsGroup />

      {/* ----- 2. CỤM BẢN ĐỒ & BIỂU ĐỒ ----- */}
      <Row gutter={16}>
        <Col span={16}>
          {/* (Phần bản đồ vẫn là placeholder) */}
          <Card title="Tổng quan xe trực tuyến" style={{ height: '100%' }}>
            <div
              style={{
                height: '100%',
                minHeight: 350,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fafafa',
              }}
            >
              Đây là nơi chứa bản đồ nhỏ...
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <VehicleStatusPieChart />
        </Col>
      </Row>
      
      {/* ----- 3. BẢNG SỰ CỐ & YÊU CẦU GẦN ĐÂY ----- */}
      <Row>
        <Col span={24}>
          <RecentIncidentsTable />
        </Col>
      </Row>
    </Flex>
  );
};

export default DashboardPage;