// src/features/stations/components/StationFormModal/StationFormModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message, InputNumber, Row, Col } from 'antd';

// 1. Import Service
import { stationService } from '~/services/stationService'; 

const statusOptions = [
  { value: 'Hoạt động', label: 'Hoạt động' },
  { value: 'Bảo trì', label: 'Bảo trì' },
  { value: 'Không hoạt động', label: 'Không hoạt động' },
];

const StationFormModal = ({ open, onClose, onSuccess, editingStation }) => { 
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!editingStation;

  // 2. Đổ dữ liệu vào form
  useEffect(() => {
    if (open) {
      if (isEditing) {
        form.setFieldsValue({
          name: editingStation.name,
          address: editingStation.address, // Thêm address
          lat: editingStation.lat,
          lon: editingStation.lon,
          status: editingStation.status,
        });
      } else {
        form.resetFields();
      }
    }
  }, [editingStation, form, isEditing, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      if (isEditing) {
        // 3. [NÂNG CẤP] Gọi hàm update (Truyền ID riêng)
        await stationService.update(editingStation.id, values);
        message.success('Cập nhật trạm thành công!');
      } else {
        // 4. [NÂNG CẤP] Gọi hàm create
        await stationService.create(values);
        message.success('Thêm trạm mới thành công!');
      }

      onSuccess(); // Tải lại bảng
      onClose();   // Đóng modal

    } catch (error) {
      console.error('Lỗi khi lưu thông tin trạm:', error);
      if (error.message) {
         message.error(error.message || 'Đã có lỗi xảy ra');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Chỉnh sửa thông tin trạm' : 'Thêm trạm mới'}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={isLoading}
      okText={isEditing ? 'Lưu thay đổi' : 'Thêm mới'}
      cancelText="Hủy bỏ"
      forceRender
    >
      <Form
        form={form}
        layout="vertical"
        name="station_form"
        style={{ marginTop: '24px' }}
        initialValues={{ status: 'Hoạt động' }}
      >
        {/* 1. TÊN TRẠM */}
        <Form.Item
          name="name"
          label="Tên trạm"
          rules={[{ required: true, message: 'Vui lòng nhập tên trạm!' }]}
        >
          <Input placeholder="Ví dụ: Bến Thành" />
        </Form.Item>

        {/* 2. ĐỊA CHỈ (Thêm mới) */}
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input placeholder="Ví dụ: Quận 1, TP.HCM" />
        </Form.Item>

        {/* 3. TỌA ĐỘ (LAT/LON) */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="lat"
              label="Vĩ độ (Lat)"
              rules={[{ required: true, message: 'Vui lòng nhập vĩ độ!' }]}
            >
              <InputNumber 
                step="0.0001" 
                style={{ width: '100%' }} 
                placeholder="10.7725"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lon"
              label="Kinh độ (Lon)"
              rules={[{ required: true, message: 'Vui lòng nhập kinh độ!' }]}
            >
              <InputNumber 
                step="0.0001" 
                style={{ width: '100%' }} 
                placeholder="106.6980"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 4. TRẠNG THÁI */}
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select
            options={statusOptions}
            placeholder="Chọn trạng thái"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StationFormModal;