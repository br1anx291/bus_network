// src/components/Dashboard/RecentIncidentsTable.jsx
import React from 'react';
// 1. Thêm Typography vào import
import { Card, Table, Tag, Typography } from 'antd';
import { WarningOutlined, BellOutlined } from '@ant-design/icons';
import { tableData } from  '../../data/dashboardMockData';

// 2. Lấy Title ra
const { Title } = Typography;

// (Phần config cột tableColumns giữ nguyên như cũ, tôi ẩn đi cho gọn)
const tableColumns = [
  {
    title: 'LOẠI',
    dataIndex: 'type',
    key: 'type',
    render: (type) => {
      const isIncident = type === 'Sự cố';
      return (
        <span style={{ color: isIncident ? '#D32F2F' : '#1890FF' }}>
          {isIncident ? <WarningOutlined /> : <BellOutlined />} {type}
        </span>
      );
    },
  },
  { title: 'CHI TIẾT', dataIndex: 'details', key: 'details' },
  { title: 'TÀI XẾ', dataIndex: 'driver', key: 'driver' },
  { title: 'THỜI GIAN', dataIndex: 'time', key: 'time' },
  {
    title: 'TRẠNG THÁI',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      let color;
      if (status === 'Mới') color = 'error';
      else if (status === 'Đang chờ') color = 'processing';
      else color = 'success';
      return <Tag color={color}>{status.toUpperCase()}</Tag>;
    },
  },
];

const RecentIncidentsTable = () => {
  return (
    <Card 
      // 3. Sửa title dùng Typography level 4
      title={
        <Title level={4} style={{ margin: 0 }}>
          Sự cố & Yêu cầu gần đây
        </Title>
      }
    >
      <Table
        columns={tableColumns}
        dataSource={tableData}
        pagination={false}
      />
    </Card>
  );
};

export default RecentIncidentsTable;