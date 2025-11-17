// src/features/passengers/components/PassengerFormModal/PassengerFormModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd'; 

// 1. Import Service
import { passengerService } from '~/services/passengerService'; 
import { STATUS_COLOR_MAP } from '../../data/passengerMockData';

const statusOptions = Object.keys(STATUS_COLOR_MAP).map(status => ({
  value: status,
  label: status,
}));

const PassengerFormModal = ({ open, onClose, onSuccess, editingPassenger }) => { 
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!editingPassenger;

  // 2. Đổ dữ liệu vào form khi sửa
  useEffect(() => {
    if (open) {
      if (isEditing) {
        form.setFieldsValue(editingPassenger);
      } else {
        form.resetFields();
      }
    }
  }, [editingPassenger, form, isEditing, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      if (isEditing) {
        // 3. [NÂNG CẤP] Gọi hàm update (Truyền ID riêng)
        await passengerService.update(editingPassenger.id, values);
        message.success('Cập nhật hành khách thành công!');
      } else {
        // 4. [NÂNG CẤP] Gọi hàm create
        await passengerService.create(values);
        message.success('Thêm hành khách mới thành công!');
      }

      onSuccess(); // Tải lại bảng
      onClose();   // Đóng modal

    } catch (error) {
      console.error('Lỗi khi lưu thông tin hành khách:', error);
      if (error.message) {
         message.error(error.message || 'Đã có lỗi xảy ra');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Chỉnh sửa thông tin hành khách' : 'Thêm hành khách mới'}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={isLoading}
      forceRender
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        name="passenger_form"
        style={{ marginTop: '24px' }}
        initialValues={{ status: 'Hoạt động' }}
      >
        {/* TÊN HÀNH KHÁCH */}
        <Form.Item
          name="name"
          label="Tên hành khách"
          rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
        >
          <Input placeholder="Ví dụ: Lý Thị M" />
        </Form.Item>

        {/* EMAIL */}
        <Form.Item
          name="email"
          label="Email (Tài khoản)"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input placeholder="Vi dụ: lym@email.com" />
        </Form.Item>

        {/* SỐ ĐIỆN THOẠI */}
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}
        >
          <Input placeholder="Ví dụ: 0901234567" />
        </Form.Item>

        {/* TRẠNG THÁI */}
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

export default PassengerFormModal;