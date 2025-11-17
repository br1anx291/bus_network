// src/features/admins/components/AdminFormModal/AdminFormModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd'; 

// 1. Import adminService (sẽ tạo ở bước 4)
import { adminService } from '~/services/adminService'; 
import { STATUS_COLOR_MAP, ROLE_COLOR_MAP } from '../../data/adminMockData';

// 2. Lấy options cho cả 2
const statusOptions = Object.keys(STATUS_COLOR_MAP).map(status => ({
  value: status,
  label: status,
}));
const roleOptions = Object.keys(ROLE_COLOR_MAP).map(role => ({
  value: role,
  label: role,
}));

// 3. Đổi tên component và props
const AdminFormModal = ({ open, onClose, onSuccess, editingAdmin }) => { 
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!editingAdmin; // Sửa tên prop

  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue(editingAdmin);
    } else {
      form.resetFields();
    }
  }, [editingAdmin, form, isEditing]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      // 4. Sửa logic service
      if (isEditing) {
        await adminService.updateAdmin(editingAdmin.id, values);
        message.success('Cập nhật Admin thành công!');
      } else {
        await adminService.createAdmin(values);
        message.success('Thêm Admin mới thành công!');
      }

      onSuccess();
      onClose();

    } catch (error) {
      console.error('Lỗi khi lưu thông tin Admin:', error);
      message.error(error.message || 'Đã có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Chỉnh sửa thông tin Admin' : 'Thêm Admin mới'}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={isLoading}
      forceRender
      width={600}
    >
      {/* 5. Sửa Form */}
      <Form
        form={form}
        layout="vertical"
        name="admin_form" // Sửa tên form
        style={{ marginTop: '24px' }}
      >
        <Form.Item
          name="name"
          label="Tên Admin"
          rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
        >
          <Input placeholder="Ví dụ: Tuyết My" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email (Tài khoản)"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input placeholder="Vi dụ: my.tuyet@bus.com" />
        </Form.Item>

        {/* Bỏ SĐT, thêm Vai trò */}
        <Form.Item
          name="role"
          label="Vai trò"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
        >
          <Select
            options={roleOptions}
            placeholder="Chọn vai trò"
          />
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

        {/* Chúng ta có thể thêm trường "Mật khẩu" ở đây khi làm form "Tạo mới" */}

      </Form>
    </Modal>
  );
};

export default AdminFormModal;