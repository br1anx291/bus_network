import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Typography, Tabs, Space } from 'antd';
import { 
  WarningOutlined, 
  BellOutlined, 
  CarOutlined, 
  UserOutlined,
  EnvironmentOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { dashboardService } from '~/services/dashboardService';
import styles from './RecentIncidentsTable.module.css';

const { Title, Text } = Typography;

const SEVERITY_COLORS = {
  'high': 'error',
  'medium': 'warning',
  'low': 'success',
};

const STATUS_COLORS = {
  'pending': 'processing',
  'accepted': 'warning',
  'rejected': 'error',
  'completed': 'success',
};

const RecentIncidentsTable = ({ refreshKey }) => {
  const [incidents, setIncidents] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [incidentsData, pickupsData] = await Promise.all([
        dashboardService.getRecentIncidents(),
        dashboardService.getRecentPickups(),
      ]);
      setIncidents(incidentsData);
      setPickups(pickupsData);
      setLoading(false);
    };
    fetchData();  
  }, [refreshKey]);

  const incidentColumns = [
    {
      title: 'MỨC ĐỘ',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (level) => (
        <Tag color={SEVERITY_COLORS[level] || 'default'}>
          {level === 'high' ? 'CAO' : level === 'medium' ? 'TB' : 'Thấp'}
        </Tag>
      ),
    },
    {
      title: 'NỘI DUNG SỰ CỐ',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Space style={{ fontSize: '12px', color: '#888' }}>
            <CarOutlined /> {record.meta}
          </Space>
        </Space>
      ),
    },
    {
      title: 'THỜI GIAN',
      dataIndex: 'time',
      key: 'time',
      width: 150,
      render: (time) => <span style={{ color: '#666' }}>{dayjs(time).format('HH:mm DD/MM')}</span>,
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={status === 'pending' ? 'red' : 'blue'}>
          {status === 'pending' ? 'Mới' : 'Đang xử lý'}
        </Tag>
      ),
    },
  ];

  const pickupColumns = [
    {
      title: 'KHÁCH HÀNG',
      key: 'users',
      render: (_, record) => (
        <Space>
           <UserOutlined style={{ color: '#1890ff' }} />
           <Space direction="vertical" size={0}>
             <Text strong>{record.customerName}</Text>
             <Text type="secondary" style={{ fontSize: '12px' }}>{record.customerPhone}</Text>
           </Space>
        </Space>
      ),
    },
    {
      title: 'ĐIỂM ĐÓN',
      dataIndex: 'stationName',
      key: 'stationName',
      render: (text) => (
        <Space>
          <EnvironmentOutlined style={{ color: 'orange' }} />
          {text}
        </Space>
      )
    },
    {
      title: 'THỜI GIAN',
      dataIndex: 'time',
      key: 'time',
      width: 150,
      render: (time) => <span style={{ color: '#666' }}>{dayjs(time).format('HH:mm DD/MM')}</span>,
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || 'default'}>
          {status === 'pending' ? 'Đang chờ' : status}
        </Tag>
      ),
    },
  ];

  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <WarningOutlined /> Sự cố mới ({incidents.length})
        </span>
      ),
      children: (
        <Table 
          columns={incidentColumns} 
          dataSource={incidents} 
          pagination={false} 
          loading={loading}
          rowKey="id"
          size="small"
        />
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <BellOutlined /> Yêu cầu đón ({pickups.length})
        </span>
      ),
      children: (
        <Table 
          columns={pickupColumns} 
          dataSource={pickups} 
          pagination={false} 
          loading={loading}
          rowKey="id"
          size="small"
        />
      ),
    },
  ];

  return (
    <Card
      className={styles.card}
      bordered={false}
    >
      <Tabs 
        defaultActiveKey="1" 
        items={tabItems} 
        size="large"
        tabBarStyle={{ marginBottom: 16 }}
      />
    </Card>
  );
};

export default RecentIncidentsTable;