// src/features/passengers/components/PassengerFormModal/PassengerFormModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd'; 

// 1. Import passengerService (sẽ tạo ở bước 4)
import { passengerService } from '~/services/passengerService'; 
import { STATUS_COLOR_MAP } from '../../data/passengerMockData';

const statusOptions = Object.keys(STATUS_COLOR_MAP).map(status => ({
  value: status,
  label: status,
}));

// 2. Đổi tên component và props
const PassengerFormModal = ({ open, onClose, onSuccess, editingPassenger }) => { 
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!editingPassenger; // Sửa tên prop

  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue(editingPassenger);
    } else {
      form.resetFields();
    }
  }, [editingPassenger, form, isEditing]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      // 3. Sửa logic service
      if (isEditing) {
        await passengerService.updatePassenger(editingPassenger.id, values);
        message.success('Cập nhật hành khách thành công!');
      } else {
        await passengerService.createPassenger(values);
        message.success('Thêm hành khách mới thành công!');
      }

      onSuccess();
      onClose();

    } catch (error) {
      console.error('Lỗi khi lưu thông tin hành khách:', error);
      message.error(error.message || 'Đã có lỗi xảy ra');
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
      {/* 4. Sửa Form */}
      <Form
        form={form}
        layout="vertical"
        name="passenger_form" // Sửa tên form
        style={{ marginTop: '24px' }}
      >
        <Form.Item
          name="name"
          label="Tên hành khách"
          rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
        >
          <Input placeholder="Ví dụ: Lý Thị M" />
        </Form.Item>

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

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}
        >
          <Input placeholder="Ví dụ: 0901234567" />
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

export default PassengerFormModal;