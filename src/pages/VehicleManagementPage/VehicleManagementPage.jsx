// src/pages/VehicleManagementPage/VehicleManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// 1. Import Bảng và Modal (Features)
import VehicleTable from '../../features/vehicles/components/VehicleTable/VehicleTable';
import VehicleFormModal from '../../features/vehicles/components/VehicleFormModal/VehicleFormModal';

// 2. Import Service (Đảm bảo đường dẫn đúng)
import { vehicleService } from '../../services/vehicleService';

import styles from './VehicleManagementPage.module.css';

const { Title } = Typography;

const VehicleManagementPage = () => {
  // --- 3. STATE QUẢN LÝ DỮ LIỆU ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: 0,
  });

  // --- 4. HÀM TẢI DỮ LIỆU (Đã cập nhật tên hàm Service) ---
  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      // GỌI HÀM MỚI: getAll thay vì getVehicles
      const result = await vehicleService.getAll(page, pageSize);
      
      // Xử lý dữ liệu trả về (Mock trả về dạng { data: [], total: ... })
      // Nếu sau này API trả về mảng trực tiếp, ta dùng fallback 'result'
      const vehicleList = result.data || result || [];
      const totalCount = result.total || vehicleList.length || 0;

      // Map thêm key cho bảng Antd
      const mappedData = vehicleList.map((item) => ({ ...item, key: item.id }));
      
      setData(mappedData);
      setPagination({
        ...pagination,
        current: page,
        total: totalCount,
      });
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tải danh sách xe!');
    } finally {
      setLoading(false);
    }
  };

  // Chạy 1 lần khi mount
  useEffect(() => {
    fetchData();
  }, []); 

  // Xử lý khi chuyển trang trên bảng
  const handleTableChange = (newPagination) => {
    fetchData(newPagination.current, newPagination.pageSize);
  };

  // --- 5. HÀM XÓA XE (Đã cập nhật tên hàm Service) ---
  const handleDelete = async (id) => {
    try {
      setLoading(true); // Bật loading cho mượt
      // GỌI HÀM MỚI: delete thay vì deleteVehicle
      await vehicleService.delete(id);
      
      message.success('Xóa xe thành công!');
      fetchData(pagination.current, pagination.pageSize); // Tải lại data
    } catch (error) {
      message.error('Lỗi khi xóa xe!');
    } finally {
      setLoading(false);
    }
  };

  // --- 6. LOGIC QUẢN LÝ MODAL (Giữ nguyên) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null); // 'null' = Thêm mới

  // Mở modal cho "Thêm mới"
  const handleOpenAddModal = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  // Mở modal cho "Chỉnh sửa"
  const handleOpenEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Khi Modal báo "Thành công" -> Tải lại dữ liệu
  const handleModalSuccess = () => {
    handleCloseModal();
    fetchData(); 
  };

  return (
    <div className={styles.pageContainer}>
      {/* --- HEADER --- */}
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Quản lý xe
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={handleOpenAddModal}
        >
          Thêm xe mới
        </Button>
      </Flex>

      {/* --- BẢNG DỮ LIỆU --- */}
      <VehicleTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      {/* --- MODAL --- */}
      <VehicleFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingVehicle={editingVehicle}
      />
    </div>
  );
};

export default VehicleManagementPage;