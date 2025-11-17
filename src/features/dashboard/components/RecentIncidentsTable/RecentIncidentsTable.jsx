// src/components/Dashboard/RecentIncidentsTable.jsx
import React, { useMemo } from 'react';
// 1. Thêm Typography vào import
import { Card, Table, Tag, Typography } from 'antd';
import { WarningOutlined, BellOutlined } from '@ant-design/icons';
import { tableData } from  '../../data/dashboardMockData';
import styles from './RecentIncidentsTable.module.css';
import clsx from 'clsx';
// 2. Lấy Title ra
const { Title } = Typography;

const RecentIncidentsTable = () => {
  // 5. Di chuyển tableColumns vào TRONG component
  // và bọc bằng useMemo để tối ưu performance
  const tableColumns = useMemo(
    () => [
      {
        title: 'LOẠI',
        dataIndex: 'type',
        key: 'type',
        render: (type) => {
          const isIncident = type === 'Sự cố';

          // 6. Dùng clsx để gán class có điều kiện
          const typeClass = clsx({
            [styles.typeIncident]: isIncident,
            [styles.typeRequest]: !isIncident,
          });

          return (
            // 7. Xóa inline style, dùng className
            <span className={typeClass}>
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
    ],
    [styles] // Phụ thuộc vào styles (dù styles không đổi, nhưng đây là cách viết đúng)
  );

  return (
    <Card
      title={
        // 8. Xóa inline style, dùng className
        <Title level={4} className={styles.cardTitle}>
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