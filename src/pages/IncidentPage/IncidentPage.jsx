// src/pages/IncidentPage/IncidentPage.jsx
import React, { useState, useEffect } from 'react';
import { Flex, Typography, message } from 'antd';
import IncidentTable from '~/features/incidents/components/IncidentTable';
// --- 1. IMPORT MODAL VIEW ---
import IncidentViewModal from '~/features/incidents/components/IncidentViewModal'; 
import { incidentService } from '~/services/incidentService';
import styles from './IncidentPage.module.css';

const { Title } = Typography;

const IncidentPage = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: 0,
  });

  // --- 2. STATE CHO MODAL ---
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingIncident, setViewingIncident] = useState(null);

  // --- 3. FETCH DATA (Đã nâng cấp) ---
  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      // [NÂNG CẤP] getIncidents -> getAll
      const result = await incidentService.getAll(page, pageSize);
      
      // Xử lý an toàn cho data (Mock vs API)
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
      message.error('Lỗi khi tải danh sách sự cố!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleTableChange = (newPagination) => {
    fetchData(newPagination.current, newPagination.pageSize);
  };

  // --- 4. CẬP NHẬT TRẠNG THÁI (Đã nâng cấp) ---
  const handleMarkComplete = async (id, isCompleted) => {
    try {
      // [NÂNG CẤP] updateIncidentCompletion -> updateCompletion
      await incidentService.updateCompletion(id, isCompleted);
      
      message.success(isCompleted ? 'Đánh dấu đã hoàn thành!' : 'Bỏ đánh dấu hoàn thành!');
      
      // Tải lại dữ liệu để cập nhật bảng
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái!');
    }
  };

  // --- 5. XỬ LÝ MODAL VIEW ---
  const handleView = (incidentRecord) => {
    setViewingIncident(incidentRecord); 
    setIsViewModalOpen(true);          
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingIncident(null); 
  };

  return (
    <div className={styles.pageContainer}>
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Quản lý Sự cố
        </Title>
      </Flex>

      {/* BẢNG SỰ CỐ */}
      <IncidentTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onMarkComplete={handleMarkComplete}
        onView={handleView} 
      />

      {/* MODAL XEM CHI TIẾT */}
      <IncidentViewModal
        open={isViewModalOpen}
        onClose={handleCloseViewModal}
        incident={viewingIncident}
      />
    </div>
  );
};

export default IncidentPage;