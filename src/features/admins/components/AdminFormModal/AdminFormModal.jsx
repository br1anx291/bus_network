// src/features/admins/components/AdminFormModal/AdminFormModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd'; 

// 1. Import adminService
import { adminService } from '~/services/adminService'; 
import { STATUS_COLOR_MAP, ROLE_COLOR_MAP } from '../../data/adminMockData';

// 2. Lấy options cho cả 2 trường
const statusOptions = Object.keys(STATUS_COLOR_MAP).map(status => ({
  value: status,
  label: status,
}));
const roleOptions = Object.keys(ROLE_COLOR_MAP).map(role => ({
  value: role,
  label: role,
}));

const AdminFormModal = ({ open, onClose, onSuccess, editingAdmin }) => { 
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!editingAdmin;

  // 3. Đổ dữ liệu vào form khi sửa
  useEffect(() => {
    if (open) {
      if (isEditing) {
        form.setFieldsValue(editingAdmin);
      } else {
        form.resetFields();
      }
    }
  }, [editingAdmin, form, isEditing, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      if (isEditing) {
        // 4. [NÂNG CẤP] Gọi hàm update (Truyền ID riêng)
        await adminService.update(editingAdmin.id, values);
        message.success('Cập nhật Admin thành công!');
      } else {
        // 5. [NÂNG CẤP] Gọi hàm create
        await adminService.create(values);
        message.success('Thêm Admin mới thành công!');
      }

      onSuccess(); // Tải lại bảng
      onClose();   // Đóng modal

    } catch (error) {
      console.error('Lỗi khi lưu thông tin Admin:', error);
      if (error.message) {
         message.error(error.message || 'Đã có lỗi xảy ra');
      }
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
      okText={isEditing ? 'Lưu thay đổi' : 'Thêm mới'}
      cancelText="Hủy bỏ"
    >
      <Form
        form={form}
        layout="vertical"
        name="admin_form"
        style={{ marginTop: '24px' }}
        initialValues={{ status: 'Hoạt động', role: 'Staff' }}
      >
        {/* TÊN ADMIN */}
        <Form.Item
          name="name"
          label="Tên Admin"
          rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
        >
          <Input placeholder="Ví dụ: Tuyết My" />
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
          <Input placeholder="Vi dụ: my.tuyet@bus.com" />
        </Form.Item>

        {/* VAI TRÒ */}
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

        {/* CHỈ HIỆN PASSWORD KHI THÊM MỚI (Optional) */}
        {!isEditing && (
          <Form.Item
            name="password"
            label="Mật khẩu khởi tạo"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu cho Admin mới" />
          </Form.Item>
        )}

      </Form>
    </Modal>
  );
};

export default AdminFormModal;