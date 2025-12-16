import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd'; 

// 1. Import Service
import { passengerService } from '~/services/passengerService'; 

// Define options with English values for DB compatibility
const statusOptions = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'blocked', label: 'Đã khóa' },
];

const PassengerFormModal = ({ open, onClose, onSuccess, editingPassenger }) => { 
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!editingPassenger;

  // 2. Populate form data when editing
  useEffect(() => {
    if (open) {
      if (isEditing) {
        form.setFieldsValue({
          name: editingPassenger.name,
          email: editingPassenger.email,
          phone: editingPassenger.phone,
          address: editingPassenger.address, // Added address field
          status: editingPassenger.status || 'active',
        });
      } else {
        form.resetFields();
      }
    }
  }, [editingPassenger, form, isEditing, open]);

  const handleOk = async () => {
    try {
      // Validate fields
      const values = await form.validateFields();
      console.log("1. Form values OK:", values); // <--- THÊM DÒNG NÀY
      setIsLoading(true);

      if (isEditing) {
        // 3. Update existing passenger
        await passengerService.update(editingPassenger.id, values);
        message.success('Cập nhật hành khách thành công!');
      } else {
        // 4. Create new passenger
        await passengerService.create(values);
        message.success('Thêm hành khách mới thành công!');
      }

      onSuccess(); // Refresh table
      onClose();   // Close modal

    } catch (error) {
      console.log("FAILED VALIDATION:", error);
      if (error.errorFields) {
        // Validation error, do nothing (form displays errors)
      } else {
        console.error('Lỗi khi lưu thông tin hành khách:', error);
        
        // Handle PocketBase errors
        const errorData = error.response?.data || {};
        const firstKey = Object.keys(errorData)[0];
        const msg = firstKey 
          ? `${firstKey}: ${errorData[firstKey].message}` 
          : (error.message || 'Đã có lỗi xảy ra');
          
        message.error(`Lỗi: ${msg}`);
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
      okText={isEditing ? 'Lưu thay đổi' : 'Thêm mới'}
      cancelText="Hủy bỏ"
    >
      <Form
        form={form}
        layout="vertical"
        name="passenger_form"
        style={{ marginTop: '24px' }}
        // Use English value 'active' for initial state
        initialValues={{ status: 'active' }}
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
            { type: 'email', required: true, message: 'Email không hợp lệ!' }
          ]}
        >
          <Input 
            placeholder="Ví dụ: lym@email.com" 
            disabled={isEditing}
            style={isEditing ? { color: '#888', cursor: 'not-allowed' } : {}} // (Tùy chọn) Style thêm cho rõ
          />
        </Form.Item>

        {/* SỐ ĐIỆN THOẠI */}
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}
        >
          <Input placeholder="Ví dụ: 0901234567" />
        </Form.Item>

        {/* ĐỊA CHỈ - New Field */}
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input placeholder="Ví dụ: 123 Nguyễn Văn Linh, Đà Nẵng" />
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