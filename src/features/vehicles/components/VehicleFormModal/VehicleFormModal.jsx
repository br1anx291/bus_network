// src/features/vehicles/components/VehicleFormModal/VehicleFormModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
// Import Service từ đường dẫn chính xác (nếu bạn dùng alias ~ thì sửa lại nhé)
import { vehicleService } from '~/services/vehicleService'; 

// Cập nhật option cho khớp với Mock Data và Logic màu sắc
const statusOptions = [
  { value: 'Đang chạy', label: 'Đang chạy' },
  { value: 'Bảo trì', label: 'Bảo trì' },
  { value: 'Không hoạt động', label: 'Không hoạt động' },
];

const typeOptions = [
  { value: 'Xe 16 chỗ', label: 'Xe 16 chỗ' },
  { value: 'Xe 29 chỗ', label: 'Xe 29 chỗ' },
  { value: 'Xe 45 chỗ', label: 'Xe 45 chỗ' },
  { value: 'Xe giường nằm', label: 'Xe giường nằm' },
];

const VehicleFormModal = ({ open, onClose, onSuccess, editingVehicle }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!editingVehicle;

  useEffect(() => {
    if (open) {
      if (isEditing) {
        // Điền dữ liệu khi sửa
        form.setFieldsValue({
          plate: editingVehicle.plate,         // Khớp với key 'plate' trong data
          model: editingVehicle.model,         // Thêm model
          type: editingVehicle.type,           // Thêm type
          capacity: editingVehicle.capacity,
          status: editingVehicle.status,
          routeName: editingVehicle.routeName  // Khớp với key 'routeName'
        });
      } else {
        // Reset form khi thêm mới
        form.resetFields();
      }
    }
  }, [editingVehicle, form, isEditing, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      if (isEditing) {
        // Logic CẬP NHẬT: Truyền ID riêng và Data riêng
        await vehicleService.update(editingVehicle.id, values);
        message.success('Cập nhật xe thành công!');
      } else {
        // Logic THÊM MỚI
        await vehicleService.create(values);
        message.success('Thêm xe mới thành công!');
      }

      onSuccess(); // Tải lại bảng
      onClose();   // Đóng modal

    } catch (error) {
      console.error('Lỗi khi lưu thông tin xe:', error);
      // Nếu lỗi không phải do validate (lỗi API/Service)
      if (error.message) {
         message.error(error.message || 'Đã có lỗi xảy ra');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Chỉnh sửa thông tin xe' : 'Thêm xe mới'}
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
        name="vehicle_form"
        style={{ marginTop: '24px' }}
        // Giá trị mặc định cho form thêm mới
        initialValues={{ status: 'Đang chạy', capacity: 16 }} 
      >
        {/* 1. BIỂN SỐ XE */}
        <Form.Item
          name="plate" // Đã đổi từ licensePlate -> plate
          label="Biển số xe"
          rules={[{ required: true, message: 'Vui lòng nhập biển số!' }]}
        >
          <Input placeholder="Ví dụ: 50H-12345" />
        </Form.Item>

        {/* 2. MẪU XE (Thêm mới) */}
        <Form.Item
          name="model"
          label="Mẫu xe"
          rules={[{ required: true, message: 'Vui lòng nhập mẫu xe!' }]}
        >
          <Input placeholder="Ví dụ: Ford Transit" />
        </Form.Item>

        {/* 3. LOẠI XE (Thêm mới) */}
        <Form.Item
          name="type"
          label="Loại xe"
          rules={[{ required: true, message: 'Vui lòng chọn loại xe!' }]}
        >
          <Select options={typeOptions} placeholder="Chọn loại xe" />
        </Form.Item>

        {/* 4. SỨC CHỨA */}
        <Form.Item
          name="capacity"
          label="Sức chứa (số ghế)"
          rules={[{ required: true, message: 'Vui lòng nhập sức chứa!' }]}
        >
          <InputNumber min={4} max={60} style={{ width: '100%' }} />
        </Form.Item>

        {/* 5. TRẠNG THÁI */}
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select options={statusOptions} placeholder="Chọn trạng thái" />
        </Form.Item>

        {/* 6. TUYẾN (Optional) */}
        <Form.Item
          name="routeName" // Đã đổi từ currentRoute -> routeName
          label="Đang ở tuyến"
        >
          <Input placeholder="Ví dụ: Tuyến 05" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VehicleFormModal;