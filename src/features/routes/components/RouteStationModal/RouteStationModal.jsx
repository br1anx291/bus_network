import React, { useEffect, useState } from 'react';
import { Modal, Transfer, message, Spin } from 'antd';
import { stationService } from '~/services/stationService';
import { routeService } from '~/services/routeService';

const RouteStationModal = ({ open, onClose, editingRoute }) => {
  const [loading, setLoading] = useState(false);
  
  const [allStations, setAllStations] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);

  useEffect(() => {
    if (open && editingRoute) {
      fetchData();
    }
  }, [open, editingRoute]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allRes, assignedIds] = await Promise.all([
        stationService.getAll(1, 1000),
        routeService.getStationsByRoute(editingRoute.id)
      ]);

      const formattedStations = (allRes.data || []).map(s => ({
        key: s.id,
        title: s.name,
        description: s.address
      }));

      setAllStations(formattedStations);
      setTargetKeys(assignedIds); 

    } catch (error) {
      message.error("Lỗi tải dữ liệu trạm");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await routeService.updateRouteStations(editingRoute.id, targetKeys);
      message.success(`Đã cập nhật trạm cho tuyến ${editingRoute.code}`);
      onClose();
    } catch (error) {
      message.error("Lỗi lưu danh sách trạm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Quản lý trạm dừng: ${editingRoute?.name || '...'}`}
      open={open}
      onCancel={onClose}
      onOk={handleSave}
      width={800}
      okText="Lưu thay đổi"
      cancelText="Hủy"
      confirmLoading={loading}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Transfer
            dataSource={allStations}
            titles={['Kho Trạm', 'Trạm Đã Chọn']}
            targetKeys={targetKeys}
            onChange={handleChange}
            render={(item) => item.title}
            listStyle={{
              width: 350,
              height: 400,
            }}
            showSearch
            filterOption={(inputValue, item) =>
              item.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
            }
          />
        </div>
      </Spin>
    </Modal>
  );
};

export default RouteStationModal;