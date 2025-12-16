// src/pages/TripManagementPage/TripManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

// 1. Import Component
import TripTable from '~/features/trips/components/TripTable/TripTable';
import TripFormModal from '~/features/trips/components/TripFormModal/TripFormModal';

// 2. Import Services
import { tripService } from '~/services/tripService';
import { vehicleService } from '~/services/vehicleService'; // [MỚI] Để lấy list xe
import { routeService } from '~/services/routeService';     // [MỚI] Để lấy list tuyến

import styles from './TripManagementPage.module.css';

const { Title } = Typography;

const TripManagementPage = () => {
  // --- STATE CHÍNH ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: 0,
  });

  // --- STATE DỮ LIỆU PHỤ TRỢ (CHO MODAL) ---
  const [busOptions, setBusOptions] = useState([]);   // List xe cho dropdown
  const [routeOptions, setRouteOptions] = useState([]); // List tuyến cho dropdown

  // --- 1. HÀM LẤY DỮ LIỆU CHUYẾN (TRIPS) ---
  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const result = await tripService.getAll(page, pageSize);
      
      const list = result.data || [];
      const totalCount = result.total || 0;

      const mappedData = list.map((item) => ({ ...item, key: item.id }));
      setData(mappedData);
      setPagination({
        ...pagination,
        current: page,
        total: totalCount,
      });
    } catch (error) {
      message.error('Lỗi khi tải danh sách chuyến!');
    } finally {
      setLoading(false);
    }
  };

  // --- 2. HÀM LẤY DỮ LIỆU PHỤ TRỢ (XE & TUYẾN) ---
  const fetchDependencies = async () => {
    try {
      // Gọi song song 2 API để tiết kiệm thời gian
      const [busRes, routeRes] = await Promise.all([
        vehicleService.getAll(1, 100), // Lấy tối đa 100 xe (hoặc nhiều hơn tuỳ nhu cầu)
        routeService.getAll(1, 100)    // Lấy tối đa 100 tuyến
      ]);

      // Map sang định dạng { value, label } của Ant Design Select
      const busOpts = busRes.data.map(bus => ({
        value: bus.id,
        label: `${bus.plate}`
      }));

      const routeOpts = routeRes.data.map(route => ({
        value: route.id,
        // Hiển thị: 05 - Nguyễn Tất Thành
        label: `${route.name}`
      }));

      setBusOptions(busOpts);
      setRouteOptions(routeOpts);
    } catch (error) {
      console.error("Lỗi tải dữ liệu xe/tuyến:", error);
      // Không cần hiện thông báo lỗi cho user để tránh rối, chỉ log console
    }
  };

  // --- EFFECT ---
  useEffect(() => {
    fetchData();        // Lấy danh sách chuyến
    fetchDependencies(); // Lấy danh sách xe & tuyến để nạp vào Modal
  }, []);

  const handleTableChange = (newPagination) => {
    fetchData(newPagination.current, newPagination.pageSize);
  };

  const handleDelete = async (id) => {
    try {
      await tripService.delete(id); 
      message.success('Xóa chuyến thành công!'); 
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa chuyến!'); 
    }
  };

  // --- STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null); 

  const handleOpenAddModal = () => {
    setEditingTrip(null); 
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (trip) => { 
    setEditingTrip(trip); 
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
          Quản lý chuyến
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
            Tạo chuyến mới
          </Button>
        </Flex>
      </Flex>

      {/* --- BẢNG DỮ LIỆU --- */}
      <TripTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      {/* --- MODAL (Đã truyền thêm props options) --- */}
      <TripFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingTrip={editingTrip}
        // [QUAN TRỌNG] Truyền danh sách xe và tuyến xuống Modal
        busOptions={busOptions}
        routeOptions={routeOptions}
      />
    </div>
  );
};

export default TripManagementPage;