// src/pages/IncidentPage/IncidentPage.jsx
import React, { useState, useEffect } from 'react';
import { Flex, Typography, message } from 'antd';
import IncidentTable from '~/features/incidents/components/IncidentTable';
// --- 1. IMPORT MODAL MỚI ---
import IncidentViewModal from '~/features/incidents/components/IncidentViewModal'; 
import { incidentService } from '~/services/incidentService';
import styles from './IncidentPage.module.css';

const { Title } = Typography;

const IncidentPage = () => {
  // (State data, loading, pagination... giữ nguyên)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ /*...*/ });

  // --- 2. THÊM STATE CHO MODAL ---
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingIncident, setViewingIncident] = useState(null);

  // (fetchData, handleTableChange, handleMarkComplete... giữ nguyên)
  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const result = await incidentService.getIncidents(page, pageSize); 
      const mappedData = result.data.map((item) => ({ ...item, key: item.id }));
      setData(mappedData);
      setPagination({ /*...*/ });
    } catch (error) {
      message.error('Lỗi khi tải danh sách sự cố!');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchData(); }, []);
  const handleTableChange = (newPagination) => {
    fetchData(newPagination.current, newPagination.pageSize);
  };
  const handleMarkComplete = async (id, isCompleted) => {
    try {
      await incidentService.updateIncidentCompletion(id, isCompleted);
      message.success(isCompleted ? 'Đánh dấu đã hoàn thành!' : 'Bỏ đánh dấu hoàn thành!');
      setData((prevData) => 
        prevData.map(item => 
          item.id === id 
            ? { ...item, isCompleted: isCompleted, status: isCompleted ? 'Đã xử lý' : 'Mới' } 
            : item
        )
      );
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái!');
    }
  };

  // --- 3. THÊM CÁC HÀM XỬ LÝ MODAL ---
  const handleView = (incidentRecord) => {
    setViewingIncident(incidentRecord); // Lưu data sự cố đang xem
    setIsViewModalOpen(true);          // Mở modal
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingIncident(null); // Xóa data khi đóng
  };
  // --- HẾT PHẦN THÊM ---

  return (
    <div className={styles.pageContainer}>
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Quản lý Sự cố
        </Title>
      </Flex>

      {/* --- 4. CẬP NHẬT PROPS TRUYỀN XUỐNG BẢNG --- */}
      <IncidentTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onMarkComplete={handleMarkComplete}
        onView={handleView} // <-- Truyền hàm View xuống
      />

      {/* --- 5. RENDER MODAL --- */}
      <IncidentViewModal
        open={isViewModalOpen}
        onClose={handleCloseViewModal}
        incident={viewingIncident}
      />
    </div>
  );
};

export default IncidentPage;