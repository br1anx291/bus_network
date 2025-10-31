// src/components/Dashboard/RecentIncidentsTable.jsx
import React from 'react';
import { Card, Table, Tag } from 'antd';
// ----- ĐẢM BẢO BẠN CÓ DÒNG NÀY -----
import { WarningOutlined, BellOutlined } from '@ant-design/icons';
// ----- KẾT THÚC -----
import { tableData } from '../../data/dashboardMockData'; 

// Config cột
const tableColumns = [
  {
    title: 'LOẠI',
    dataIndex: 'type',
    key: 'type',
    render: (type) => {
      const isIncident = type === 'Sự cố';
      return (
        <span style={{ color: isIncident ? '#D32F2F' : '#1890FF' }}>
          {/* Code này chạy được VÌ chúng ta đã import 2 icon ở trên */}
          {isIncident ? <WarningOutlined /> : <BellOutlined />} {type}
        </span>
      );
    },
  },
  // ... (các cột khác giữ nguyên) ...
  {
    title: 'CHI TIẾT',
    dataIndex: 'details',
    key: 'details',
  },
  {
    title: 'TÀI XẾ',
    dataIndex: 'driver',
    key: 'driver',
  },
  {
    title: 'THỜI GIAN',
    dataIndex: 'time',
    key: 'time',
  },
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
    <Card title="Sự cố & Yêu cầu gần đây">
      <Table
        columns={tableColumns}
        dataSource={tableData}
        pagination={false}
      />
    </Card>
  );
};

export default RecentIncidentsTable;