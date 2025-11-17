// src/pages/DashboardPage.jsx
import React from 'react';
import { Col, Row, Flex, Typography } from 'antd'; // Bỏ import Card thừa ở đây

import StatCardsGroup from '../../features/dashboard/components/StatCardsGroup';
import VehicleStatusPieChart from '../../features/dashboard/components/VehicleStatusPieChart';
import RecentIncidentsTable from '../../features/dashboard/components/RecentIncidentsTable';
import OnlineVehiclesMap from '../../features/dashboard/components/OnlineVehiclesMap';

const { Title } = Typography;

const DashboardPage = () => {
  return (
    <Flex vertical gap="large">
      <Title level={3} style={{ margin: 0 }}>
        Tổng quan
      </Title>

      {/* ----- 1. CỤM THẺ THỐNG KÊ ----- */}
      <StatCardsGroup />

      {/* ----- 2. CỤM BẢN ĐỒ & BIỂU ĐỒ ----- */}
      <Row gutter={16}>
        <Col span={16}>
           <OnlineVehiclesMap />
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