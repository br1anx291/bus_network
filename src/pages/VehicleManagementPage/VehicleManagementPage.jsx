// src/pages/VehicleManagementPage/VehicleManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// 1. Import Bảng và Modal (Features)
import VehicleTable from '../../features/vehicles/components/VehicleTable/VehicleTable';
import VehicleFormModal from '../../features/vehicles/components/VehicleFormModal/VehicleFormModal';

// 2. Import Service
import { vehicleService } from '../../services/vehicleService';

import styles from './VehicleManagementPage.module.css';

const { Title } = Typography;

const VehicleManagementPage = () => {
  // --- 3. TOÀN BỘ LOGIC DATA GIỜ NẰM Ở ĐÂY ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: 0,
  });

  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const result = await vehicleService.getVehicles(page, pageSize);
      const mappedData = result.data.map((item) => ({ ...item, key: item.id }));
      setData(mappedData);
      setPagination({
        ...pagination,
        current: page,
        total: result.total,
      });
    } catch (error) {
      message.error('Lỗi khi tải danh sách xe!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Chạy 1 lần khi mount

  const handleTableChange = (newPagination) => {
    fetchData(newPagination.current, newPagination.pageSize);
  };

  const handleDelete = async (id) => {
    try {
      await vehicleService.deleteVehicle(id);
      message.success('Xóa xe thành công!');
      fetchData(pagination.current, pagination.pageSize); // Tải lại data
    } catch (error) {
      message.error('Lỗi khi xóa xe!');
    }
  };

  // --- 4. LOGIC QUẢN LÝ MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null); // 'null' = Thêm mới

  // Mở modal cho "Thêm mới"
  const handleOpenAddModal = () => {
    setEditingVehicle(null); // Đặt là null
    setIsModalOpen(true);
  };

  // Mở modal cho "Chỉnh sửa"
  const handleOpenEditModal = (vehicle) => {
    setEditingVehicle(vehicle); // Đặt là data của xe
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // (Không cần setEditingVehicle(null) ở đây, để modal tự xử lý)
  };

  // Khi Modal báo "Thành công" (Thêm/Sửa)
  const handleModalSuccess = () => {
    handleCloseModal(); // Đóng modal
    fetchData(); // Tải lại dữ liệu (về trang 1)
  };

  return (
    <div className={styles.pageContainer}>
      {/* --- HEADER CỦA TRANG --- */}
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Quản lý xe
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={handleOpenAddModal} // <-- 5. KÍCH HOẠT NÚT "THÊM"
        >
          Thêm xe mới
        </Button>
      </Flex>

      {/* --- BẢNG DỮ LIỆU "NGU" --- */}
      <VehicleTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onEdit={handleOpenEditModal} // <-- 6. TRUYỀN HÀM SỬA VÀO
        onDelete={handleDelete} // <-- 7. TRUYỀN HÀM XÓA VÀO
      />

      {/* --- MODAL (ẨN) --- */}
      <VehicleFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingVehicle={editingVehicle} // <-- 8. TRUYỀN DATA XE VÀO
      />
    </div>
  );
};

export default VehicleManagementPage;