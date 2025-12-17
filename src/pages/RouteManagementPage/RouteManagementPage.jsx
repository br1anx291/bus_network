import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography, message } from 'antd';
import { PlusOutlined,ReloadOutlined } from '@ant-design/icons';

import RouteTable from '~/features/routes/components/RouteTable';
import RouteFormModal from '~/features/routes/components/RouteFormModal';
import RouteDrawModal from '~/features/routes/components/RouteDrawModal/RouteDrawModal';
import RouteStationModal from '~/features/routes/components/RouteStationModal/RouteStationModal';

import { routeService } from '~/services/routeService';

import styles from './RouteManagementPage.module.css';

const { Title } = Typography;

const RouteManagementPage = () => {
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
      const result = await routeService.getAll(page, pageSize);
      
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
      message.error('Lỗi khi tải danh sách tuyến!');
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
      await routeService.delete(id);
      message.success('Xóa tuyến thành công!');
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa tuyến!');
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);

  const handleOpenAddModal = () => {
    setEditingRoute(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (route) => {
    setEditingRoute(route);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSuccess = () => {
    handleCloseModal();
    fetchData(); 
  };


  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);
  const [routeToDraw, setRouteToDraw] = useState(null);

  const handleOpenMap = (record) => {
    setRouteToDraw(record);
    setIsDrawModalOpen(true);
  };


const handleSaveMap = async (id, coordinates) => {
    try {
      await routeService.update(id, { path_json: coordinates }); 

      message.success('Cập nhật lộ trình thành công!');
      
      setIsDrawModalOpen(false);
      setRouteToDraw(null);

      fetchData(pagination.current, pagination.pageSize); 
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi lưu lộ trình');
    }
  };

  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [routeToAssign, setRouteToAssign] = useState(null);
  
  const handleOpenStationModal = (record) => {
    setRouteToAssign(record);
    setIsStationModalOpen(true);
  };

  return (
    <div className={styles.pageContainer}>
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Quản lý tuyến
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
            Thêm tuyến mới
          </Button>
         </Flex>

      </Flex>

      <RouteTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
        onEditMap={handleOpenMap}
        onEditStations={handleOpenStationModal}
      />

      <RouteFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingRoute={editingRoute}
      />

      <RouteDrawModal
        open={isDrawModalOpen}
        editingRoute={routeToDraw}
        onClose={() => setIsDrawModalOpen(false)}
        onSave={handleSaveMap}
      />

      <RouteStationModal
        open={isStationModalOpen}
        editingRoute={routeToAssign}
        onClose={() => setIsStationModalOpen(false)}
      />      
    </div>
  );
};

export default RouteManagementPage;