// src/components/Dashboard/StatCardsGroup.jsx
import React from 'react';
import { Card, Col, Row } from 'antd';
import {
  CarOutlined,
  UserOutlined,
  WarningOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { statsData } from  '../../data/dashboardMockData';
import styles from './StatCardsGroup.module.css';

const iconMap = {
  CarOutlined: <CarOutlined />,
  UserOutlined: <UserOutlined />,
  WarningOutlined: <WarningOutlined />,
  BellOutlined: <BellOutlined />,
};

const StatCardsGroup = () => {
  return (
    <Row gutter={[16, 16]}>
      {statsData.map((item) => ( // 3. Bỏ 'index'
        <Col xs={24} sm={12} md={8} lg={6} key={item.title}> {/* 4. Dùng item.title làm key */}
          <Card
            bordered={false}
            // 5. Tách style ra
            className={styles.statCard}
            classNames={{ body: styles.statCardBody }}
            // Toàn bộ inline style đã bị xóa
          >
            <div className={styles.contentWrapper}>
              {/* --- BÊN TRÁI: ICON --- */}
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>
                  {iconMap[item.icon]}
                </span>
              </div>

              {/* --- BÊN PHẢI: CHỮ --- */}
              <div className={styles.textWrapper}>
                <div className={styles.textValue}>
                  {item.value}
                </div>
                <div className={styles.textTitle}>
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