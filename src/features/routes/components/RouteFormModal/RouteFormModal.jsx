// src/features/routes/components/RouteFormModal/RouteFormModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message, InputNumber } from 'antd';

// 1. Import routeService
import { routeService } from '~/services/routeService'; 

const statusOptions = [
  { value: 'Đang hoạt động', label: 'Đang hoạt động' },
  { value: 'Tạm ngưng', label: 'Tạm ngưng' },
  { value: 'Bảo trì', label: 'Bảo trì' },
];

const RouteFormModal = ({ open, onClose, onSuccess, editingRoute }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!editingRoute;

  // 2. Đổ dữ liệu vào form khi sửa
  useEffect(() => {
    if (open) {
      if (isEditing) {
        form.setFieldsValue({
          name: editingRoute.name,
          description: editingRoute.description, // Thêm trường này
          numStops: editingRoute.numStops,       // Sửa stopsCount -> numStops
          status: editingRoute.status,
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
        // 3. [NÂNG CẤP] Gọi hàm update (Truyền ID riêng)
        await routeService.update(editingRoute.id, values);
        message.success('Cập nhật tuyến thành công!');
      } else {
        // 4. [NÂNG CẤP] Gọi hàm create
        await routeService.create(values);
        message.success('Thêm tuyến mới thành công!');
      }

      onSuccess(); // Tải lại bảng
      onClose();   // Đóng modal

    } catch (error) {
      console.error('Lỗi khi lưu thông tin tuyến:', error);
      if (error.message) {
         message.error(error.message || 'Đã có lỗi xảy ra');
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
        style={{ marginTop: '24px' }}
        initialValues={{ status: 'Đang hoạt động', numStops: 10 }}
      >
        {/* FIELD 1: TÊN TUYẾN */}
        <Form.Item
          name="name"
          label="Tên tuyến"
          rules={[{ required: true, message: 'Vui lòng nhập tên tuyến!' }]}
        >
          <Input placeholder="Ví dụ: Tuyến 01" />
        </Form.Item>
        
        {/* FIELD 2: MÔ TẢ (Thêm mới cho khớp Table) */}
        <Form.Item
          name="description"
          label="Mô tả lộ trình"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <Input placeholder="Ví dụ: Bến Thành - Bến xe Miền Tây" />
        </Form.Item>

        {/* FIELD 3: SỐ TRẠM (Đổi tên biến cho khớp Data) */}
        <Form.Item
          name="numStops" 
          label="Số trạm dừng"
          rules={[{ required: true, message: 'Vui lòng nhập số trạm!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Ví dụ: 15" />
        </Form.Item>

        {/* FIELD 4: TRẠNG THÁI */}
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