import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Skeleton } from 'antd';
import {
  CarOutlined,
  UserOutlined,
  WarningOutlined,
  BellOutlined,
} from '@ant-design/icons';

import { dashboardService } from '~/services/dashboardService';
import styles from './StatCardsGroup.module.css';

const StatCardsGroup = ({ refreshKey }) => {
  const [stats, setStats] = useState({
    activeBuses: 0,
    driverStats: "0/0",
    newIncidents: 0,
    pendingPickups: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      
      const data = await dashboardService.getStats();

      setStats({
        activeBuses: data.activeBuses,
        driverStats: `${data.activeDrivers}/${data.totalDrivers}`, 
        newIncidents: data.newIncidents,
        pendingPickups: data.pendingPickups,
      });

      setLoading(false);
    };

    fetchStats();
  }, [refreshKey]);

  const cardsConfig = [
    {
      key: 'activeBuses',
      title: 'Xe đang hoạt động',
      icon: <CarOutlined />,
      color: '#52c41a',
      bgColor: '#f6ffed',
    },
    {
      key: 'driverStats',
      title: 'Tài xế hoạt động',
      icon: <UserOutlined />,
      color: '#1890ff',
      bgColor: '#e6f7ff',
    },
    {
      key: 'newIncidents',
      title: 'Sự cố mới',
      icon: <WarningOutlined />,
      color: '#ff4d4f',
      bgColor: '#fff1f0',
    },
    {
      key: 'pendingPickups',
      title: 'Yêu cầu đón',
      icon: <BellOutlined />,
      color: '#faad14',
      bgColor: '#fffbe6',
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {cardsConfig.map((item) => (
        <Col xs={24} sm={12} md={8} lg={6} key={item.key}>
          <Card
            bordered={false}
            className={styles.statCard}
            classNames={{ body: styles.statCardBody }}
          >
            <div className={styles.contentWrapper}>
              <div 
                className={styles.iconWrapper}
                style={{ 
                  color: item.color, 
                  backgroundColor: item.bgColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '48px', height: '48px', borderRadius: '12px', fontSize: '24px'
                }}
              >
                {item.icon}
              </div>

              <div className={styles.textWrapper} style={{ marginLeft: '12px' }}>
                <Skeleton paragraph={false} title={{ width: 40 }} loading={loading} active>
                  <div className={styles.textValue} style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {stats[item.key]}
                  </div>
                </Skeleton>
                
                <div className={styles.textTitle} style={{ color: '#8c8c8c' }}>
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