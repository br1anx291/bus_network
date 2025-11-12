// src/components/Dashboard/StatCardsGroup.jsx
import React from 'react';
import { Card, Col, Row } from 'antd';
import {
  CarOutlined,
  UserOutlined,
  WarningOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { statsData } from '../../data/dashboardMockData';

const iconMap = {
  CarOutlined: <CarOutlined />,
  UserOutlined: <UserOutlined />,
  WarningOutlined: <WarningOutlined />,
  BellOutlined: <BellOutlined />,
};

const StatCardsGroup = () => {
  return (
    <Row gutter={[16, 16]}>
      {statsData.map((item, index) => (
        <Col xs={24} sm={12} md={8} lg={6} key={index}>
          <Card
            bordered={false}
            style={{
              boxShadow: '0 4px 5px rgba(0, 0, 0, 0.25)',
              borderRadius: '16px',
              padding: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              {/* --- BÊN TRÁI: ICON TRONG HÌNH TRÒN --- */}
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 216, 0, 0.2)', // vàng nhạt sữa tươi

                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: '28px', color: '#000' }}>
                  {iconMap[item.icon]}
                </span>
              </div>

              {/* --- BÊN PHẢI: CHỮ --- */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  marginLeft: '18px',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontSize: '26px',
                    fontWeight: 'bold',
                    color: '#000',
                    lineHeight: 1.2,
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#555',
                    marginTop: '4px',
                  }}
                >
                  {item.title}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatCardsGroup;
  