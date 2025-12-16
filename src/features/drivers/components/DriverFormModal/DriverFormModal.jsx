// src/features/drivers/components/DriverFormModal/DriverFormModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd'; 

// 1. Import Service
import { driverService } from '~/services/driverService'; 

const statusOptions = [
  { value: 'active', label: 'Đang làm việc' },
  { value: 'off', label: 'Nghỉ ca' },
  { value: 'leave', label: 'Nghỉ phép' },
];

const DriverFormModal = ({ open, onClose, onSuccess, editingDriver }) => { 
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!editingDriver;

  // 2. [SỬA] Đổ dữ liệu vào form khi sửa (Có Mapping an toàn)
  useEffect(() => {
    if (open) {
      if (isEditing && editingDriver) {
        // Console log để debug xem dữ liệu gốc có gì
        console.log("📝 Editing Driver Data:", editingDriver);

        form.setFieldsValue({
          name: editingDriver.name,
          email: editingDriver.email,
          
          // MAPPING QUAN TRỌNG:
          // Xử lý trường hợp DB trả về 'license_number' nhưng Form tên 'licenseNumber'
          licenseNumber: editingDriver.licenseNumber || editingDriver.license_number,
          
          // Xử lý trường hợp DB trả về 'phone_number' nhưng Form tên 'phone'
          // (Dù bạn đặt tên DB là phone, nhưng cứ map thêm phone_number cho chắc chắn)
          phone: editingDriver.phone || editingDriver.phone_number || editingDriver.phoneNumber,
          
          status: editingDriver.status || 'active',
        });
      } else {
        form.resetFields();
      }
    }
  }, [editingDriver, form, isEditing, open]);

  const handleOk = async () => {
    try {
      // Validate Form
      const values = await form.validateFields();
      setIsLoading(true);

      // 3. [SỬA] Chuẩn hóa Payload trước khi gửi
      // Đảm bảo tên key khớp 100% với tên cột trong PocketBase của bạn
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone, // Bạn xác nhận DB tên là 'phone' -> Gửi 'phone'
        
        // Nếu DB của bạn thực sự tên là licenseNumber (camelCase) thì giữ nguyên.
        // Nếu DB là license_number (snake_case chuẩn PB) thì bỏ comment dòng dưới:
        // license_number: values.licenseNumber, 
        licenseNumber: values.licenseNumber, 

        status: values.status,
      };

      console.log("🚀 Payload gửi đi:", payload);

      if (isEditing) {
        await driverService.update(editingDriver.id, payload);
        message.success('Cập nhật tài xế thành công!');
      } else {
        await driverService.create(payload);
        message.success('Thêm tài xế mới thành công!');
      }

      onSuccess(); 
      onClose();   

    } catch (error) {
      console.error('Lỗi khi lưu thông tin tài xế:', error);
      // Hiển thị lỗi chi tiết từ PocketBase (thường là validation error)
      const errorMsg = error.response?.data?.message || error.message || 'Đã có lỗi xảy ra';
      message.error(errorMsg);
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
        initialValues={{ status: 'active' }}
      >
        {/* TÊN TÀI XẾ */}
        <Form.Item
          name="name"
          label="Tên tài xế"
          rules={[{ required: true, message: 'Vui lòng nhập tên tài xế!' }]}
        >
          <Input placeholder="Ví dụ: Nguyễn Văn A" />
        </Form.Item>

        {/* EMAIL - Lưu ý: Nếu là Auth Collection, email mới phải là duy nhất */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input placeholder="Ví dụ: vana@bus.com" />
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