// src/pages/PickupRequestPage/PickupRequestPage.jsx
import React, { useState, useEffect } from 'react';
import { Flex, Typography, message } from 'antd';
import PickupRequestTable from '~/features/pickupRequests/components/PickupRequestTable';
import { pickupRequestService } from '~/services/pickupRequestService';
import styles from './PickupRequestPage.module.css';

const { Title } = Typography;

const PickupRequestPage = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: 0,
  });

  // --- 1. FETCH DATA (Đã nâng cấp) ---
  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      // [ĐỔI TÊN] getPickupRequests -> getAll
      const result = await pickupRequestService.getAll(page, pageSize);
      
      // [NÂNG CẤP] Xử lý data an toàn cho cả Mock và API
      const list = result.data || result || [];
      const totalCount = result.total || list.length || 0;

      const mappedData = list.map((item) => ({ ...item, key: item.id }));
      
      setData(mappedData);
      setPagination({
        ...pagination,
        current: page,
        total: totalCount,
      });
    } catch (error) {
      message.error('Lỗi khi tải danh sách yêu cầu đón!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleTableChange = (newPagination) => {
    fetchData(newPagination.current, newPagination.pageSize);
  };

  // --- 2. CẬP NHẬT TRẠNG THÁI (Đã nâng cấp) ---
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // [ĐỔI TÊN] updatePickupRequestStatus -> updateStatus
      await pickupRequestService.updateStatus(id, newStatus);
      
      message.success(`Đã ${newStatus === 'Đã duyệt' ? 'duyệt' : 'hủy'} yêu cầu!`);
      fetchData(pagination.current, pagination.pageSize); 
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái!');
    }
  };

  // Cụ thể cho nút "Duyệt"
  const handleApprove = (id) => {
    handleUpdateStatus(id, 'Đã duyệt');
  };

  // Cụ thể cho nút "Hủy"
  const handleDeny = (id) => {
    handleUpdateStatus(id, 'Đã hủy');
  };

  return (
    <div className={styles.pageContainer}>
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Quản lý Yêu cầu đón
        </Title>
      </Flex>

      <PickupRequestTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onApprove={handleApprove} 
        onDeny={handleDeny}     
      />
    </div>
  );
};

export default PickupRequestPage;