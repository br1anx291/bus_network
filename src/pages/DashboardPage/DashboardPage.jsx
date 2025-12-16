// src/pages/DashboardPage.jsx
import React, { useState, useCallback } from 'react';
import { Col, Row, Flex, Typography, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

import StatCardsGroup from '../../features/dashboard/components/StatCardsGroup';
import VehicleStatusPieChart from '../../features/dashboard/components/VehicleStatusPieChart';
import RecentIncidentsTable from '../../features/dashboard/components/RecentIncidentsTable';
import OnlineVehiclesMap from '../../features/dashboard/components/OnlineVehiclesMap';

const { Title } = Typography;

const DashboardPage = () => {
  // State dùng để kích hoạt reload cho các component con
  // Khi bấm nút "Làm mới", ta thay đổi giá trị này -> Các con sẽ useEffect theo nó để fetch lại
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <Flex vertical gap="large">
      {/* HEADER CÓ NÚT REFRESH */}
      <Flex justify="space-between" align="center">
        <Title level={3} style={{ margin: 0 }}>
          Tổng quan hệ thống
        </Title>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
        >
          Làm mới dữ liệu
        </Button>
      </Flex>

      {/* 1. CỤM THẺ THỐNG KÊ */}
      <StatCardsGroup refreshKey={refreshKey} />

      {/* 2. CỤM BẢN ĐỒ & BIỂU ĐỒ */}
      <Row gutter={16} style={{ minHeight: '400px' }}>
        <Col span={16}>
           {/* Map sẽ tự update mỗi 30s, nhưng cũng nhận refreshKey để reload ngay */}
           <OnlineVehiclesMap refreshKey={refreshKey} />
        </Col>

        <Col span={8}>
          <VehicleStatusPieChart refreshKey={refreshKey} />
        </Col>
      </Row>
      
      {/* 3. BẢNG SỰ CỐ & YÊU CẦU (TAB) */}
      <Row>
        <Col span={24}>
          <RecentIncidentsTable refreshKey={refreshKey} />
        </Col>
      </Row>
    </Flex>
  );
};

export default DashboardPage;