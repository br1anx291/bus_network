// src/features/routes/components/RouteFormModal/RouteFormModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message, InputNumber } from 'antd';

// 1. Import routeService (chưa tạo, nhưng ta import trước)
import { routeService } from '~/services/routeService'; 
// import { routeService } from '../../../services/routeService'; // Dùng đường dẫn này nếu bạn chưa setup `~/`

const statusOptions = [
  { value: 'Đang hoạt động', label: 'Đang hoạt động' },
  { value: 'Tạm ngưng', label: 'Tạm ngưng' },
];

const RouteFormModal = ({ open, onClose, onSuccess, editingRoute }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!editingRoute;

  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue(editingRoute);
    } else {
      form.resetFields();
    }
  }, [editingRoute, form, isEditing]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      if (isEditing) {
        // 2. Sửa logic service
        await routeService.updateRoute(editingRoute.id, values);
        message.success('Cập nhật tuyến thành công!');
      } else {
        await routeService.createRoute(values);
        message.success('Thêm tuyến mới thành công!');
      }

      onSuccess();
      onClose();

    } catch (error) {
      console.error('Lỗi khi lưu thông tin tuyến:', error);
      message.error(error.message || 'Đã có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Chỉnh sửa thông tin tuyến' : 'Thêm tuyến mới'}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={isLoading}
      forceRender
    >
      {/* 3. Sửa Form */}
      <Form
        form={form}
        layout="vertical"
        name="route_form"
        style={{ marginTop: '24px' }}
      >
        <Form.Item
          name="code"
          label="Mã tuyến"
          rules={[{ required: true, message: 'Vui lòng nhập mã tuyến!' }]}
        >
          <Input placeholder="Ví dụ: Tuyến 01" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên tuyến"
          rules={[{ required: true, message: 'Vui lòng nhập tên tuyến!' }]}
        >
          <Input placeholder="Ví dụ: Bến Thành - Chợ Lớn" />
        </Form.Item>
        
        <Form.Item
          name="stopsCount"
          label="Số trạm dừng"
          rules={[{ required: true, message: 'Vui lòng nhập số trạm!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Ví dụ: 15" />
        </Form.Item>

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

export default RouteFormModal;