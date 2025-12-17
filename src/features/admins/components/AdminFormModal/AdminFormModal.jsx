import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message, Row, Col } from 'antd'; 

import { adminService } from '~/services/adminService'; 

const ROLE_OPTIONS = [
  { value: 'superadmin', label: 'Quản trị viên (Super Admin)' },
  { value: 'manager',    label: 'Quản lý (Manager)' },
  { value: 'staff',      label: 'Nhân viên (Staff)' },
];

const AdminFormModal = ({ open, onClose, onSuccess, editingAdmin }) => { 
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!editingAdmin;

  useEffect(() => {
    if (open) {
      if (isEditing) {
        form.setFieldsValue({
          username: editingAdmin.username,
          email: editingAdmin.email,
          phoneNumber: editingAdmin.phoneNumber,
          role: editingAdmin.role,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          role: 'staff', 
        });
      }
    }
  }, [editingAdmin, form, isEditing, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      if (isEditing) {
        await adminService.update(editingAdmin.id, values);
        message.success('Cập nhật thông tin thành công!');
      } else {
        await adminService.create(values);
        message.success('Tạo người dùng mới thành công!');
      }

      onSuccess(); 
      onClose();  

    } catch (error) {
      console.error('Lỗi form:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Đã có lỗi xảy ra';
      message.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

return (
    <Modal
      title={isEditing ? 'Cập nhật Admin' : 'Thêm Admin mới'}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={isLoading}
      width={600}
    >
      <Form form={form} layout="vertical" style={{ marginTop: '20px' }}>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="username"
              label="Username (Tên đăng nhập)"
              rules={[
                { required: true, message: 'Vui lòng nhập Username!' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: 'Không chứa ký tự đặc biệt!' },
                { min: 3, message: 'Tối thiểu 3 ký tự' }
              ]}
            >
              <Input placeholder="vd: admin_01" />
            </Form.Item>
          </Col>
          <Col span={12}>
             <Form.Item
              name="role"
              label="Vai trò"
              rules={[{ required: true, message: 'Chọn vai trò!' }]}
            >
              <Select options={ROLE_OPTIONS} placeholder="Chọn quyền" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Nhập email!' }, { type: 'email' }]}
            >
              <Input placeholder="contact@example.com" disabled={isEditing} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[{ pattern: /^[0-9]{10,11}$/, message: 'SĐT không hợp lệ!' }]}
            >
              <Input placeholder="09xxxxxxxxx" />
            </Form.Item>
          </Col>
        </Row>

        {!isEditing && (
          <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '6px' }}>
             <p style={{marginBottom: 5, fontWeight: 500}}>Mật khẩu:</p>
             <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="password" rules={[{ required: true }, { min: 8 }]}>
                  <Input.Password placeholder="Mật khẩu" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="passwordConfirm" 
                  dependencies={['password']}
                  rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) return Promise.resolve();
                        return Promise.reject(new Error('Không khớp!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Xác nhận" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default AdminFormModal;