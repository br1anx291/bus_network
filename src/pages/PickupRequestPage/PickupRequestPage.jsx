// src/pages/PickupRequestPage/PickupRequestPage.jsx
import React, { useState, useEffect } from 'react';
import { Flex, Typography, message } from 'antd';
import PickupRequestTable from '~/features/pickupRequests/components/PickupRequestTable';
import { pickupRequestService } from '~/services/pickupRequestService';
import styles from './PickupRequestPage.module.css';

const { Title } = Typography;

const PickupRequestPage = () => {
  // (State và fetchData, useEffect... giữ nguyên)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ /*...*/ });

  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const result = await pickupRequestService.getPickupRequests(page, pageSize); 
      const mappedData = result.data.map((item) => ({ ...item, key: item.id }));
      setData(mappedData);
      setPagination({
        ...pagination,
        current: page,
        total: result.total,
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

  // --- THÊM CÁC HÀM MỚI Ở ĐÂY ---

  // Hàm chung để xử lý cập nhật
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await pickupRequestService.updatePickupRequestStatus(id, newStatus);
      message.success(`Đã ${newStatus === 'Đã duyệt' ? 'duyệt' : 'hủy'} yêu cầu!`);
      fetchData(pagination.current, pagination.pageSize); // Tải lại bảng
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
  // --- HẾT PHẦN THÊM ---

  return (
    <div className={styles.pageContainer}>
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Quản lý Yêu cầu đón
        </Title>
      </Flex>

      {/* --- CẬP NHẬT PROPS TRUYỀN XUỐNG --- */}
      <PickupRequestTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onApprove={handleApprove} // <-- Truyền xuống
        onDeny={handleDeny}     // <-- Truyền xuống
      />
    </div>
  );
};

export default PickupRequestPage;