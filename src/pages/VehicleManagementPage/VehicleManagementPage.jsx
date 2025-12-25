import React, { useState, useEffect, useMemo } from 'react';
import { Button, Flex, Typography, message, Input } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';

import VehicleTable from '~/features/vehicles/components/VehicleTable/VehicleTable';
import VehicleFormModal from '~/features/vehicles/components/VehicleFormModal/VehicleFormModal';
import { vehicleService } from '~/services/vehicleService';
import { routeService } from '~/services/routeService';
import { driverService } from '~/services/driverService'; 
import { useLocation } from 'react-router-dom';

import styles from './VehicleManagementPage.module.css';

const { Title } = Typography;

const VehicleManagementPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [searchText, setSearchText] = useState('');

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7, 
    showSizeChanger: true, 
    pageSizeOptions: ['7', '10', '20', '50', '100']
  });

  const [routeOptions, setRouteOptions] = useState([]); 
  const [driverOptions, setDriverOptions] = useState([]); 

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await vehicleService.getAll(1, 1000);
      
      const vehicleList = result.data || result || [];
      
      const mappedData = vehicleList.map((item) => ({ ...item, key: item.id }));
      
      setData(mappedData);
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tải danh sách xe!');
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const [ driverRes, routeRes ] = await Promise.all([
        driverService.getAll(1, 100),
        routeService.getAll(1, 100)
      ]);

      const driverOpts = (driverRes.data || []).map(driver => ({
        value: driver.id,
        label: driver.name
      }));

      const routeOpts = (routeRes.data || []).map(route => ({
        value: route.id,
        label: route.name
      }));
      setDriverOptions(driverOpts);
      setRouteOptions(routeOpts);
    } catch (error) {
      console.error("Lỗi tải danh sách tuyến:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDependencies();
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
    setSearchText(searchParam);
    }
  }, [location.search]); 


const STATUS_DICT = {
    'active': 'đang chạy',
    'maintenance': 'bảo trì',
    'stopped': 'ngừng',
    'default': 'không rõ'
  };

const filteredData = useMemo(() => {
    if (!searchText) return data;

    const lowerText = searchText.toLowerCase().trim();

    return data.filter((item) => {
      const plate = item.plate?.toLowerCase() || '';
      const driverName = item.driverName?.toLowerCase() || ''; 
      const routeName = item.routeName?.toLowerCase() || '';
      const statusEng = item.status?.toLowerCase() || '';
      const statusViet = STATUS_DICT[statusEng] || '';

      return (
        plate.includes(lowerText) ||
        driverName.includes(lowerText) ||
        routeName.includes(lowerText) ||
        statusViet.includes(lowerText)
      );
    });
  }, [data, searchText]);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await vehicleService.delete(id);
      message.success('Xóa xe thành công!');
      fetchData(); 
    } catch (error) {
      message.error('Lỗi khi xóa xe!');
    } finally {
      setLoading(false);
    }
  };

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
  const handleCloseModal = () => setIsModalOpen(false);
  const handleModalSuccess = () => {
    handleCloseModal();
    fetchData(); 
  };

  return (
    <div className={styles.pageContainer}>
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Quản lý xe
        </Title>
        <Flex gap="small">
            <Input.Search
                placeholder="Tìm biển số, tài xế, tuyến..."
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
            Thêm xe mới
          </Button>
        </Flex>
      </Flex>

      <VehicleTable 
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