import React, { useState, useEffect, useMemo } from 'react';
import { Flex, Typography, message, Button, Input } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';

import IncidentTable from '~/features/incidents/components/IncidentTable/IncidentTable';
import IncidentFormModal from '~/features/incidents/components/IncidentFormModal/IncidentFormModal'; 

import { incidentService } from '~/services/incidentService';
import styles from './IncidentPage.module.css';

const { Title } = Typography;

const IncidentPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [searchText, setSearchText] = useState('');

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50']
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await incidentService.getAll(1, 1000);
      
      const list = result.data || [];

      const mappedData = list.map((item) => ({ ...item, key: item.id }));
      
      setData(mappedData);
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tải danh sách sự cố!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const STATUS_DICT = {
    'pending': 'mới tiếp nhận',
    'processing': 'đang xử lý',
    'resolved': 'đã giải quyết',
  };

  const SEVERITY_DICT = {
    'low': 'thấp',
    'medium': 'trung bình',
    'high': 'cao',
  };

  const CATEGORY_DICT = {
    'technical': 'kỹ thuật / xe',
    'personnel': 'nhân sự',
    'traffic': 'giao thông',
    'other': 'khác',
  };


  const filteredData = useMemo(() => {
    if (!searchText) return data;

    const lowerText = searchText.toLowerCase().trim();

    return data.filter((item) => {
      const title = String(item.title || '').toLowerCase();
      const description = String(item.description || '').toLowerCase();
      
      const busPlate = String(item.busPlate || '').toLowerCase();
      const driverName = String(item.driverName || '').toLowerCase();
      const routeName = String(item.routeName || '').toLowerCase();

      const categoryEng = String(item.category || '').toLowerCase();
      const categoryViet = CATEGORY_DICT[categoryEng] || '';

      const severityEng = String(item.severity || '').toLowerCase();
      const severityViet = SEVERITY_DICT[severityEng] || '';

      const statusEng = String(item.status || '').toLowerCase();
      const statusViet = STATUS_DICT[statusEng] || '';

      return (
        title.includes(lowerText) ||
        description.includes(lowerText) ||
        busPlate.includes(lowerText) ||
        driverName.includes(lowerText) ||
        routeName.includes(lowerText) ||
        
        categoryEng.includes(lowerText) ||
        categoryViet.includes(lowerText) ||

        severityEng.includes(lowerText) ||
        severityViet.includes(lowerText) ||

        statusEng.includes(lowerText) ||
        statusViet.includes(lowerText)
      );
    });
  }, [data, searchText]);


  const handleDelete = async (id) => {
    try {
      await incidentService.delete(id);
      message.success('Xóa sự cố thành công!');
      fetchData(); 
    } catch (error) {
      message.error('Lỗi khi xóa sự cố!');
    }
  };


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);

  const handleOpenAddModal = () => {
    setEditingIncident(null);
    setIsModalOpen(true);
  };
  const handleOpenEditModal = (record) => {
    setEditingIncident(record);
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
          Quản lý Sự cố
        </Title>
        
        <Flex gap="small">
          <Input.Search
            placeholder="Tìm tiêu đề, xe, tài xế, mức độ..."
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
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
            Báo cáo sự cố
          </Button>
        </Flex>
      </Flex>

      <IncidentTable 
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

      <IncidentFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingIncident={editingIncident}
      />
    </div>
  );
};

export default IncidentPage;