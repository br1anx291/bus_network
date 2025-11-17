// src/features/drivers/components/DriverFormModal/DriverFormModal.jsx
import React, { useEffect, useState } from 'react';
// 1. Import (không cần DatePicker)
import { Modal, Form, Input, Select, message } from 'antd'; 

// 2. Import driverService (sẽ tạo ở bước 2)
import { driverService } from '~/services/driverService'; 
import { STATUS_COLOR_MAP } from '../../data/driverMockData';

// 3. Lấy status options
const statusOptions = Object.keys(STATUS_COLOR_MAP).map(status => ({
  value: status,
  label: status,
}));

// 4. Đổi tên component và props
const DriverFormModal = ({ open, onClose, onSuccess, editingDriver }) => { 
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!editingDriver; // Sửa tên prop

  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue(editingDriver);
    } else {
      form.resetFields();
    }
  }, [editingDriver, form, isEditing]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      // 5. Sửa logic service
      if (isEditing) {
        await driverService.updateDriver(editingDriver.id, values);
        message.success('Cập nhật tài xế thành công!');
      } else {
        await driverService.createDriver(values);
        message.success('Thêm tài xế mới thành công!');
      }

      onSuccess();
      onClose();

    } catch (error) {
      console.error('Lỗi khi lưu thông tin tài xế:', error);
      message.error(error.message || 'Đã có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Chỉnh sửa thông tin tài xế' : 'Thêm tài xế mới'}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={isLoading}
      forceRender
      width={600} // Giữ nguyên chiều rộng cho đẹp
    >
      {/* 6. Sửa Form */}
      <Form
        form={form}
        layout="vertical"
        name="driver_form" // Sửa tên form
        style={{ marginTop: '24px' }}
      >
        <Form.Item
          name="name"
          label="Tên tài xế"
          rules={[{ required: true, message: 'Vui lòng nhập tên tài xế!' }]}
        >
          <Input placeholder="Ví dụ: Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input placeholder="Vi dụ: vana@bus.com" />
        </Form.Item>

        <Form.Item
          name="licenseNumber"
          label="Số giấy phép lái xe"
          rules={[{ required: true, message: 'Vui lòng nhập số GPLX!' }]}
        >
          <Input placeholder="Ví dụ: A1-12345" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}
        >
          <Input placeholder="Ví dụ: 0905111222" />
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

export default DriverFormModal;