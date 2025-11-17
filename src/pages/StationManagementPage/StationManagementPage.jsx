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

// 3. Đổi tên Component
const StationManagementPage = () => {
  // --- (State không đổi) ---
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
      // GỌI HÀM getStations
      const result = await stationService.getStations(page, pageSize); 
      const mappedData = result.data.map((item) => ({ ...item, key: item.id }));
      setData(mappedData);
      setPagination({
        ...pagination,
        current: page,
        total: result.total,
      });
    } catch (error) {
      message.error('Lỗi khi tải danh sách trạm!'); // Sửa text
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
      // GỌI HÀM deleteStation
      await stationService.deleteStation(id); 
      message.success('Xóa trạm thành công!'); // Sửa text
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa trạm!'); // Sửa text
    }
  };

  // --- 5. SỬA STATE MODAL (cho dễ đọc) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null); // Đổi tên state

  const handleOpenAddModal = () => {
    setEditingStation(null); // Đổi tên state
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (station) => { // Đổi tên param
    setEditingStation(station); // Đổi tên state
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
      {/* --- HEADER CỦA TRANG --- */}
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Quản lý trạm {/* Sửa text */}
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={handleOpenAddModal}
        >
          Thêm trạm mới {/* Sửa text */}
        </Button>
      </Flex>

      {/* --- 6. SỬA COMPONENT CON --- */}
      <StationTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      <StationFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingStation={editingStation} // Truyền prop mới
      />
    </div>
  );
};

export default StationManagementPage;