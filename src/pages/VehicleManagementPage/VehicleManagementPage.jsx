// src/pages/VehicleManagementPage/VehicleManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography, message } from 'antd';
import { PlusOutlined,ReloadOutlined  } from '@ant-design/icons';

// 1. Import Bảng và Modal (Features)
import VehicleTable from '../../features/vehicles/components/VehicleTable/VehicleTable';
import VehicleFormModal from '../../features/vehicles/components/VehicleFormModal/VehicleFormModal';

// 2. Import Service
import { vehicleService } from '../../services/vehicleService';
import { routeService } from '../../services/routeService'; // [MỚI] Import routeService
import { driverService } from '../../services/driverService'; // [MỚI] Import routeService

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

  // [MỚI] State lưu danh sách Tuyến cho Dropdown
  const [routeOptions, setRouteOptions] = useState([]); 
  const [driverOptions, setDriverOptions] = useState([]); 

  // --- 4. HÀM TẢI DỮ LIỆU XE ---
  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const result = await vehicleService.getAll(page, pageSize);
      
      const vehicleList = result.data || result || [];
      const totalCount = result.total || vehicleList.length || 0;

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

  // --- [MỚI] HÀM TẢI DỮ LIỆU PHỤ TRỢ (TUYẾN) ---
  // Giống hệt logic bên TripManagementPage
  const fetchDependencies = async () => {
    try {
      // Lấy danh sách tuyến (Giả sử lấy 100 tuyến đầu tiên để hiển thị dropdown)
      // const routeRes = await routeService.getAll(1, 100);
      const [ driverRes, routeRes ] = await Promise.all([
        driverService.getAll(1, 100),
        routeService.getAll(1, 100)
      ]);

      const driverOpts = (driverRes.data || []).map(driver => ({
        value: driver.id,
        label: driver.name
      }));

      // Map sang định dạng { value, label } cho Select
      const routeOpts = (routeRes.data || []).map(route => ({
        value: route.id,
        label: route.name
      }));
      setDriverOptions(driverOpts);
      setRouteOptions(routeOpts);
    } catch (error) {
      console.error("Lỗi tải danh sách tuyến:", error);
      // Không cần message lỗi để tránh làm phiền user nếu API phụ lỗi
    }
  };

  // --- EFFECT ---
  useEffect(() => {
    fetchData();        // Tải danh sách xe
    fetchDependencies(); // [MỚI] Tải danh sách tuyến
  }, []); 

  // Xử lý khi chuyển trang trên bảng
  const handleTableChange = (newPagination) => {
    fetchData(newPagination.current, newPagination.pageSize);
  };

  // --- 5. HÀM XÓA XE ---
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await vehicleService.delete(id);
      message.success('Xóa xe thành công!');
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa xe!');
    } finally {
      setLoading(false);
    }
  };

  // --- 6. LOGIC QUẢN LÝ MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const handleOpenAddModal = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
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
          Quản lý xe
        </Title>
        <Flex gap="small">
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => fetchData()} 
            loading={loading}
          >
            Làm mới
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={handleOpenAddModal}
          >
            Thêm xe mới
          </Button>
        </Flex>
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
        routeOptions={routeOptions}
        driverOptions={driverOptions}
      />
    </div>
  );
};

export default VehicleManagementPage;