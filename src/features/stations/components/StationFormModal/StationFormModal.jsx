// src/features/stations/components/StationFormModal/StationFormModal.jsx
import React, { useEffect, useState } from 'react';
// 1. Import thêm InputNumber, Row, Col
import { Modal, Form, Input, Select, message, InputNumber, Row, Col } from 'antd'; 

import { stationService } from '~/services/stationService'; 

const statusOptions = [
  { value: 'Đang hoạt động', label: 'Đang hoạt động' },
  { value: 'Tạm ngưng', label: 'Tạm ngưng' },
];

const StationFormModal = ({ open, onClose, onSuccess, editingStation }) => { 
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!editingStation;

  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue(editingStation);
    } else {
      form.resetFields();
    }
  }, [editingStation, form, isEditing]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      if (isEditing) {
        await stationService.updateStation(editingStation.id, values);
        message.success('Cập nhật trạm thành công!');
      } else {
        await stationService.createStation(values);
        message.success('Thêm trạm mới thành công!');
      }

      onSuccess();
      onClose();

    } catch (error) {
      console.error('Lỗi khi lưu thông tin trạm:', error);
      message.error(error.message || 'Đã có lỗi xảy ra');
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
      forceRender
    >
      {/* 2. SỬA FORM */}
      <Form
        form={form}
        layout="vertical"
        name="station_form"
        style={{ marginTop: '24px' }}
      >
        <Form.Item
          name="name"
          label="Tên trạm"
          rules={[{ required: true, message: 'Vui lòng nhập tên trạm!' }]}
        >
          <Input placeholder="Ví dụ: Bến Thành" />
        </Form.Item>

        {/* 3. Thêm Row/Col cho Lat/Lon */}
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