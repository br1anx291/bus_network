import React, { useState, useEffect, useMemo } from 'react';
import { Button, Flex, Typography, message, Input } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
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
  
  const [searchText, setSearchText] = useState('');

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    showSizeChanger: true, 
    pageSizeOptions: ['7', '10', '20', '50']
  });

  const [busOptions, setBusOptions] = useState([]); 
  const [routeOptions, setRouteOptions] = useState([]);

  const fetchData = async () => { 
    setLoading(true);
    try {
      const result = await tripService.getAll(1, 1000);
      
      const list = result.data || [];

      const mappedData = list.map((item) => ({ ...item, key: item.id }));
      setData(mappedData);
      
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

  const STATUS_DICT = {
    'scheduled': 'lên lịch',
    'running': 'đang chạy', 
    'completed': 'hoàn thành',
    'cancelled': 'đã hủy',
  };

  const filteredData = useMemo(() => {
    if (!searchText) return data;

    const lowerText = searchText.toLowerCase().trim();

    return data.filter((item) => {
      const busName = (item.busName || '').toLowerCase();
      const routeName = (item.routeName || '').toLowerCase();
      const startTime = (item.startTime || '').toLowerCase(); 
      
      const statusEng = (item.status || '').toLowerCase();
      const statusViet = STATUS_DICT[statusEng] || '';

      return (
        busName.includes(lowerText) ||
        routeName.includes(lowerText) ||
        startTime.includes(lowerText) ||
        statusEng.includes(lowerText) ||
        statusViet.includes(lowerText)
      );
    });
  }, [data, searchText]);


  const handleDelete = async (id) => {
    try {
      await tripService.delete(id); 
      message.success('Xóa chuyến thành công!'); 
      fetchData(); 
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
  const handleCloseModal = () => setIsModalOpen(false);
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
            <Input.Search
                placeholder="Tìm xe, tuyến, trạng thái..."
                allowClear
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
            Tạo chuyến mới
          </Button>
        </Flex>
      </Flex>

      <TripTable 
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