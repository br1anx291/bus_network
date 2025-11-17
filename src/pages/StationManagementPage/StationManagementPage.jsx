// src/pages/StationManagementPage/StationManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// 1. Import Bảng và Modal CỦA trạm
import StationTable from '~/features/stations/components/StationTable/StationTable';
import StationFormModal from '~/features/stations/components/StationFormModal/StationFormModal';

// 2. Import Service CỦA trạm
import { stationService } from '~/services/stationService';

import styles from './StationManagementPage.module.css';

const { Title } = Typography;

const StationManagementPage = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: 0,
  });

  // --- 4. SỬA CÁC HÀM SERVICE ---
  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      // [NÂNG CẤP 1] GỌI HÀM getAll
      const result = await stationService.getAll(page, pageSize);
      
      // Xử lý an toàn cho data trả về (Mock object hoặc API array)
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
      message.error('Lỗi khi tải danh sách trạm!'); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchData(newPagination.current, newPagination.pageSize);
  };

  const handleDelete = async (id) => {
    try {
      // [NÂNG CẤP 2] GỌI HÀM delete
      await stationService.delete(id); 
      message.success('Xóa trạm thành công!'); 
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa trạm!'); 
    }
  };

  // --- 5. STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null); 

  const handleOpenAddModal = () => {
    setEditingStation(null); 
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (station) => { 
    setEditingStation(station); 
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSuccess = () => {
    handleCloseModal();
    fetchData(); 
  };

  return (
    <div className={styles.pageContainer}>
      {/* --- HEADER --- */}
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Quản lý trạm 
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={handleOpenAddModal}
        >
          Thêm trạm mới 
        </Button>
      </Flex>

      {/* --- BẢNG --- */}
      <StationTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      {/* --- MODAL --- */}
      <StationFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingStation={editingStation} 
      />
    </div>
  );
};

export default StationManagementPage;