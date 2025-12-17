import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import TripTable from '~/features/trips/components/TripTable/TripTable';
import TripFormModal from '~/features/trips/components/TripFormModal/TripFormModal';

import { tripService } from '~/services/tripService';
import { vehicleService } from '~/services/vehicleService'; 
import { routeService } from '~/services/routeService';  

import styles from './TripManagementPage.module.css';

const { Title } = Typography;

const TripManagementPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: 0,
  });

  const [busOptions, setBusOptions] = useState([]); 
  const [routeOptions, setRouteOptions] = useState([]);

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

  const fetchDependencies = async () => {
    try {
      const [busRes, routeRes] = await Promise.all([
        vehicleService.getAll(1, 100),
        routeService.getAll(1, 100)
      ]);

      const busOpts = busRes.data.map(bus => ({
        value: bus.id,
        label: `${bus.plate}`
      }));

      const routeOpts = routeRes.data.map(route => ({
        value: route.id,
        label: `${route.name}`
      }));

      setBusOptions(busOpts);
      setRouteOptions(routeOpts);
    } catch (error) {
      console.error("Lỗi tải dữ liệu xe/tuyến:", error);
    }
  };

  useEffect(() => {
    fetchData(); 
    fetchDependencies();
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

      <TripTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      <TripFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingTrip={editingTrip}
        busOptions={busOptions}
        routeOptions={routeOptions}
      />
    </div>
  );
};

export default TripManagementPage;