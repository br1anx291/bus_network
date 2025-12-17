import React, { useState, useEffect } from 'react';
import { Flex, Typography, message, Button, Tabs } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

import PickupRequestTable from '~/features/pickupRequests/components/PickupRequestTable/PickupRequestTable';
import { pickupRequestService } from '~/services/pickupRequestService';
import styles from './PickupRequestPage.module.css';

const { Title } = Typography;

const TAB_ITEMS = [
  {
    key: 'pending',
    label: 'Cần xử lý (Pending)',
  },
  {
    key: 'accepted',
    label: 'Đang đợi xe (Accepted)',
  },
  {
    key: 'history',
    label: 'Lịch sử (All/Others)',
  },
];

const PickupRequestPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('pending'); 

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = async (
    page = pagination.current, 
    pageSize = pagination.pageSize, 
    currentTab = activeTab 
  ) => {
    setLoading(true);
    try {
      let statusParam = '';
      
      if (currentTab === 'pending') statusParam = 'pending';
      else if (currentTab === 'accepted') statusParam = 'accepted';
      else if (currentTab === 'history') statusParam = '';
      
      const result = await pickupRequestService.getAll(page, pageSize, statusParam);
      
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
      console.error(error);
      message.error('Lỗi khi tải danh sách yêu cầu đón!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const newPagination = { ...pagination, current: 1 };
    setPagination(newPagination);
    fetchData(1, newPagination.pageSize, activeTab);
  }, [activeTab]);

  const handleTableChange = (newPagination) => {
    fetchData(newPagination.current, newPagination.pageSize, activeTab);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setLoading(true);
      await pickupRequestService.updateStatus(id, newStatus);

      setData(prevData => 
        prevData.map(item => 
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      const actionMap = {
        'accepted': 'Duyệt',
        'rejected': 'Từ chối'
      };
      message.success(`Đã ${actionMap[newStatus] || 'cập nhật'} yêu cầu thành công!`);

    } catch (error) {
      console.error(error);
      message.error('Lỗi khi cập nhật trạng thái!');
      fetchData(pagination.current, pagination.pageSize, activeTab);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (id) => handleUpdateStatus(id, 'accepted'); 
  const handleDeny = (id) => handleUpdateStatus(id, 'rejected');
  const handleCancelTrip = (id) => handleUpdateStatus(id, 'rejected');

  return (
    <div className={styles.pageContainer}>
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Quản lý Yêu cầu đón
        </Title>
        
        <Button 
          icon={<ReloadOutlined />} 
          onClick={() => fetchData(pagination.current, pagination.pageSize, activeTab)}
          loading={loading}
        >
          Làm mới
        </Button>
      </Flex>

      <Tabs 
        activeKey={activeTab} 
        items={TAB_ITEMS} 
        onChange={handleTabChange}
        style={{ marginBottom: 16 }} 
        type="card"
      />

      <PickupRequestTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}

        onApprove={handleApprove} 
        onDeny={handleDeny}
        onCancel={handleCancelTrip}     
      />
    </div>
  );
};

export default PickupRequestPage;