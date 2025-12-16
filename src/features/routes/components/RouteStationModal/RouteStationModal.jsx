import React, { useEffect, useState } from 'react';
import { Modal, Transfer, message, Spin } from 'antd';
import { stationService } from '~/services/stationService';
import { routeService } from '~/services/routeService';

const RouteStationModal = ({ open, onClose, editingRoute }) => {
  const [loading, setLoading] = useState(false);
  
  // Dữ liệu cho Transfer
  const [allStations, setAllStations] = useState([]); // Bên trái (Nguồn)
  const [targetKeys, setTargetKeys] = useState([]);   // Bên phải (Đích - ID các trạm đã chọn)

  // 1. Load dữ liệu khi mở Modal
  useEffect(() => {
    if (open && editingRoute) {
      fetchData();
    }
  }, [open, editingRoute]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi song song: Lấy TẤT CẢ trạm & Lấy trạm CỦA TUYẾN này
      const [allRes, assignedIds] = await Promise.all([
        stationService.getAll(1, 1000), // Lấy max 1000 trạm
        routeService.getStationsByRoute(editingRoute.id)
      ]);

      // Map dữ liệu sang format của Antd Transfer
      const formattedStations = (allRes.data || []).map(s => ({
        key: s.id,          // ID trạm (bắt buộc)
        title: s.name,      // Tên hiển thị
        description: s.address // Mô tả phụ
      }));

      setAllStations(formattedStations);
      setTargetKeys(assignedIds); // Set các trạm đã gán sang bên phải

    } catch (error) {
      message.error("Lỗi tải dữ liệu trạm");
    } finally {
      setLoading(false);
    }
  };

  // 2. Xử lý khi người dùng chuyển trạm qua lại
  const handleChange = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
  };

  // 3. Xử lý Lưu
  const handleSave = async () => {
    setLoading(true);
    try {
      // Gọi service cập nhật
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
            render={(item) => item.title} // Hiển thị tên trạm
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