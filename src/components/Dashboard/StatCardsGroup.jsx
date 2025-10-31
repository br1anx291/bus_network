// src/components/Dashboard/StatCardsGroup.jsx
import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
// Import các Icon mà CHÚNG TA sẽ "vẽ"
import {
  CarOutlined,
  UserOutlined,
  WarningOutlined,
  BellOutlined,
} from '@ant-design/icons';
// Import data (giờ đã "sạch")
import { statsData } from '../../data/dashboardMockData';

// ----- THÊM MỚI Ở ĐÂY -----
// Hàm "Helper" để "vẽ" icon dựa trên chuỗi
// và gán màu sắc tương ứng
const renderIcon = (iconName, itemBgColor) => {
  // Định nghĩa màu sắc ở đây, tách biệt khỏi data
  const style = {
    CarOutlined: { color: '#FFC107' },
    UserOutlined: { color: '#1890FF' },
    WarningOutlined: { color: '#D32F2F' },
    BellOutlined: { color: '#52C41A' },
  };

  switch (iconName) {
    case 'CarOutlined':
      return <CarOutlined style={style.CarOutlined} />;
    case 'UserOutlined':
      return <UserOutlined style={style.UserOutlined} />;
    case 'WarningOutlined':
      return <WarningOutlined style={style.WarningOutlined} />;
    case 'BellOutlined':
      return <BellOutlined style={style.BellOutlined} />;
    default:
      return null;
  }
};
// ----- KẾT THÚC THÊM MỚI -----

const StatCardsGroup = () => {
  return (
    <Row gutter={16}>
      {statsData.map((item, index) => (
        <Col span={6} key={index}>
          <Card style={{ backgroundColor: item.bgColor }} bordered={false}>
            <Statistic
              title={item.title}
              value={item.value}
              // Gọi hàm helper để "vẽ" icon
              prefix={renderIcon(item.icon)}
              valueStyle={{ fontWeight: 'bold', fontSize: '24px' }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatCardsGroup;