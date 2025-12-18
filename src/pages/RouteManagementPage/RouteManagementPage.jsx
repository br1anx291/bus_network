import React, { useState, useEffect, useMemo } from 'react';
import { Button, Flex, Typography, message, Input } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';

import RouteTable from '~/features/routes/components/RouteTable';
import RouteFormModal from '~/features/routes/components/RouteFormModal';
import RouteDrawModal from '~/features/routes/components/RouteDrawModal/RouteDrawModal';
import RouteStationModal from '~/features/routes/components/RouteStationModal/RouteStationModal';

import { routeService } from '~/services/routeService';
import { useLocation } from 'react-router-dom';

import styles from './RouteManagementPage.module.css';

const { Title } = Typography;

const RouteManagementPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [searchText, setSearchText] = useState('');

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    showSizeChanger: true, 
    pageSizeOptions: ['7', '10', '20', '50']
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await routeService.getAll(1, 1000);
      
      const list = result.data || result || [];
      
      const mappedData = list.map((item) => ({ ...item, key: item.id }));
      setData(mappedData);
      
    } catch (error) {
      message.error('Lỗi khi tải danh sách tuyến!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchText(searchParam);
    }
  }, [location.search]);


  const STATUS_DICT = {
    'active': 'đang hoạt động',
    'stopped': 'tạm ngưng',
    'maintenance': 'bảo trì'
  };

  const filteredData = useMemo(() => {
    if (!searchText) return data;

    const lowerText = searchText.toLowerCase().trim();

    return data.filter((item) => {
      const name = (item.name || '').toLowerCase();
      const code = (item.code || '').toLowerCase();
      const description = (item.description || '').toLowerCase();
      
      const statusEng = (item.status || '').toLowerCase();
      const statusViet = STATUS_DICT[statusEng] || '';

      return (
        name.includes(lowerText) ||
        code.includes(lowerText) ||
        description.includes(lowerText) ||
        statusEng.includes(lowerText) ||
        statusViet.includes(lowerText)
      );
    });
  }, [data, searchText]);


  const handleDelete = async (id) => {
    try {
      await routeService.delete(id);
      message.success('Xóa tuyến thành công!');
      fetchData();
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

      fetchData(); 
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
          <Input.Search
            placeholder="Tìm tên tuyến, mã, mô tả..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 280 }}
            enterButton={<SearchOutlined />}
          />

          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => {
                setSearchText('');
                fetchData();
            }} 
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
        data={filteredData} 
        loading={loading}
        

        pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: filteredData.length,
            showSizeChanger: true,
            pageSizeOptions: pagination.pageSizeOptions,
            onChange: (page, pageSize) => {
                setPagination({ ...pagination, current: page, pageSize });
            }
        }}

        onTableChange={() => {}} 
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