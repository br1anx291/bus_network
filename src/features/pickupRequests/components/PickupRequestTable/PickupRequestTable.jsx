// src/features/pickupRequests/components/PickupRequestTable/PickupRequestTable.jsx
import React, { useMemo } from 'react';
import { Table, Tag, Space, Button } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { STATUS_COLOR_MAP } from '../../data/pickupRequestMockData'; 
import styles from './PickupRequestTable.module.css';

const PickupRequestTable = ({ 
  data, 
  loading, 
  pagination, 
  onTableChange,
  // --- 1. NHẬN PROPS MỚI ---
  onApprove, 
  onDeny 
}) => {

  const columns = useMemo(
    () => [
      // (Các cột khác giữ nguyên)
      { title: 'HÀNH KHÁCH', dataIndex: 'userName', key: 'userName' },
      { title: 'TRẠM ĐÓN', dataIndex: 'stationName', key: 'stationName' },
      { title: 'CHUYẾN XE', dataIndex: 'tripName', key: 'tripName' },
      { title: 'THỜI GIAN YÊU CẦU', dataIndex: 'requestTime', key: 'requestTime' },
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
            {record.status === 'Đang chờ' && (
              <>
                {/* --- 2. GẮN onClick VÀO NÚT --- */}
                <Button 
                  type="primary" 
                  icon={<CheckOutlined />} 
                  onClick={() => onApprove(record.id)} // <-- GẮN VÀO ĐÂY
                >
                  Duyệt
                </Button>
                <Button 
                  type="primary" 
                  danger 
                  icon={<CloseOutlined />}
                  onClick={() => onDeny(record.id)} // <-- GẮN VÀO ĐÂY
                >
                  Hủy
                </Button>
              </>
            )}
          </Space>
        ),
      },
    ],
    // --- 3. THÊM PROPS VÀO DEPENDENCY ARRAY ---
    [STATUS_COLOR_MAP, onApprove, onDeny] 
  );

  // (return Table giữ nguyên)
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
      className={styles.pickupRequestTable}
    />
  );
};

export default PickupRequestTable;