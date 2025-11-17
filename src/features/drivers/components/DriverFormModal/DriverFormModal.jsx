// src/features/drivers/components/DriverFormModal/DriverFormModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd'; 

// 1. Import Service
import { driverService } from '~/services/driverService'; 
import { STATUS_COLOR_MAP } from '../../data/driverMockData';

const statusOptions = Object.keys(STATUS_COLOR_MAP).map(status => ({
  value: status,
  label: status,
}));

const DriverFormModal = ({ open, onClose, onSuccess, editingDriver }) => { 
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!editingDriver;

  // 2. Đổ dữ liệu vào form khi sửa
  useEffect(() => {
    if (open) {
      if (isEditing) {
        form.setFieldsValue(editingDriver);
      } else {
        form.resetFields();
      }
    }
  }, [editingDriver, form, isEditing, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      if (isEditing) {
        // 3. [NÂNG CẤP] Gọi hàm update (Truyền ID riêng)
        await driverService.update(editingDriver.id, values);
        message.success('Cập nhật tài xế thành công!');
      } else {
        // 4. [NÂNG CẤP] Gọi hàm create
        await driverService.create(values);
        message.success('Thêm tài xế mới thành công!');
      }

      onSuccess(); // Tải lại bảng
      onClose();   // Đóng modal

    } catch (error) {
      console.error('Lỗi khi lưu thông tin tài xế:', error);
      if (error.message) {
         message.error(error.message || 'Đã có lỗi xảy ra');
      }
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
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        name="driver_form"
        style={{ marginTop: '24px' }}
        initialValues={{ status: 'Hoạt động' }}
      >
        {/* TÊN TÀI XẾ */}
        <Form.Item
          name="name"
          label="Tên tài xế"
          rules={[{ required: true, message: 'Vui lòng nhập tên tài xế!' }]}
        >
          <Input placeholder="Ví dụ: Nguyễn Văn A" />
        </Form.Item>

        {/* EMAIL */}
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

        {/* GIẤY PHÉP LÁI XE */}
        <Form.Item
          name="licenseNumber"
          label="Số giấy phép lái xe"
          rules={[{ required: true, message: 'Vui lòng nhập số GPLX!' }]}
        >
          <Input placeholder="Ví dụ: A1-12345" />
        </Form.Item>

        {/* SỐ ĐIỆN THOẠI */}
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}
        >
          <Input placeholder="Ví dụ: 0905111222" />
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

export default DriverFormModal;