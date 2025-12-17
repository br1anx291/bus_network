import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { routeService } from '~/services/routeService'; 
import './RouteFormModal.module.css'; 

const statusOptions = [
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'maintenance', label: 'Bảo trì' },
  { value: 'stopped', label: 'Tạm ngưng' },
];

const RouteFormModal = ({ open, onClose, onSuccess, editingRoute }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!editingRoute;

  useEffect(() => {
    if (open) {
      if (isEditing) {
        form.setFieldsValue({
          code: editingRoute.code,
          name: editingRoute.name,
          description: editingRoute.description,
          status: editingRoute.status || '',
        });
      } else {
        form.resetFields();
      }
    }
  }, [editingRoute, form, isEditing, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      if (isEditing) {
        await routeService.update(editingRoute.id, values);
        message.success('Cập nhật tuyến thành công!');
      } else {
        await routeService.create(values);
        message.success('Thêm tuyến mới thành công!');
      }

      onSuccess(); 
      onClose();   

    } catch (error) {
      if (error.errorFields) {
        console.log("Validate failed:", error);
      } else {
        console.error('Chi tiết lỗi PocketBase:', error.response); 
        
        const errorData = error.response?.data || {};
        const firstKey = Object.keys(errorData)[0];
        const errorMessage = firstKey 
          ? `${firstKey}: ${errorData[firstKey].message}` 
          : (error.message || 'Lỗi không xác định');

        message.error(`Lỗi tạo tuyến: ${errorMessage}`);
      }
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
      okText={isEditing ? 'Lưu thay đổi' : 'Thêm mới'}
      cancelText="Hủy bỏ"
      forceRender
    >
      <Form
        form={form}
        layout="vertical"
        name="route_form"
        className="route-form" 
        initialValues={{ status: 'active', numStops: 10 }}
      >

        <Form.Item
          name="code"
          label="Mã tuyến"
          rules={[{ required: true, message: 'Vui lòng nhập mã tuyến!' }]}
        >
          <Input placeholder="Ví dụ: R1" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên tuyến"
          rules={[{ required: true, message: 'Vui lòng nhập tên tuyến!' }]}
        >
          <Input placeholder="Ví dụ: Tuyến 01" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Mô tả lộ trình"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <Input placeholder="Ví dụ: Bến Thành - Bến xe Miền Tây" />
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