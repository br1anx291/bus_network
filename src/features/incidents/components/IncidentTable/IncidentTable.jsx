// src/features/incidents/components/IncidentTable/IncidentTable.jsx
import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Checkbox } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

// 1. Sửa import: Lấy CATEGORY_COLOR_MAP
import { STATUS_COLOR_MAP, CATEGORY_COLOR_MAP } from '../../data/incidentMockData'; 
import styles from './IncidentTable.module.css';

const IncidentTable = ({ 
  data, 
  loading, 
  pagination, 
  onTableChange,
  onMarkComplete,
  onView
}) => {

  const columns = useMemo(
    () => [
      // --- 2. THAY THẾ CỘT "LOẠI" ---
      { 
        title: 'PHÂN LOẠI', // <-- Tên cột mới
        dataIndex: 'category', // <-- Data mới
        key: 'category',
        render: (category) => (
          <Tag color={CATEGORY_COLOR_MAP[category] || 'default'}>
            {category}
          </Tag>
        )
      },
      // --- HẾT PHẦN THAY THẾ ---

      { title: 'CHI TIẾT', dataIndex: 'detail', key: 'detail', width: '30%' },
      { title: 'LIÊN QUAN', dataIndex: 'related', key: 'related' },
      { title: 'THỜI GIAN', dataIndex: 'time', key: 'time' },
      {
        title: 'TRẠNG THÁI',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={STATUS_COLOR_MAP[status] || 'default'}>
            {status.toUpperCase()}
          </Tag>
        ),
      },
      {
        title: 'HÀNH ĐỘNG',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              style={{ color: '#1890ff' }} 
              onClick={() => onView(record)}
            />
            <Checkbox 
              checked={record.isCompleted}
              onChange={(e) => onMarkComplete(record.id, e.target.checked)}
            />
          </Space>
        ),
      },
    ],
    // --- 3. CẬP NHẬT DEPENDENCY ARRAY ---
    [STATUS_COLOR_MAP, CATEGORY_COLOR_MAP, onMarkComplete, onView] 
  );

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{
        ...pagination,
        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên ${total} kết quả`,
      }}
      onChange={onTableChange}
      className={styles.incidentTable}
    />
  );
};

export default IncidentTable;