// src/features/vehicles/components/VehicleFormModal/VehicleFormModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { vehicleService } from '../../../../services/vehicleService';
// (Chúng ta có thể import map màu từ data để dùng cho Select)
// import { STATUS_COLOR_MAP } from '../../data/vehicleMockData';

// Lấy các lựa chọn trạng thái
const statusOptions = [
  { value: 'Đang chạy', label: 'Đang chạy' },
  { value: 'Bảo trì', label: 'Bảo trì' },
  { value: 'Ngưng hoạt động', label: 'Ngưng hoạt động' },
  { value: 'N/A', label: 'N/A' },
];

const VehicleFormModal = ({ open, onClose, onSuccess, editingVehicle }) => {
  const [form] = Form.useForm(); // Hook của Antd để điều khiển Form
  const [isLoading, setIsLoading] = useState(false);

  // 1. Xác định xem đây là chế độ "Sửa" hay "Thêm"
  const isEditing = !!editingVehicle; // Nếu có editingVehicle -> true

  // 2. Tự động điền form khi 'editingVehicle' thay đổi
  useEffect(() => {
    if (isEditing) {
      // Chế độ Sửa: Đặt giá trị cho form
      form.setFieldsValue(editingVehicle);
    } else {
      // Chế độ Thêm: Xóa trắng form
      form.resetFields();
    }
  }, [editingVehicle, form, isEditing]); // Chạy lại khi modal mở ra

  // 3. Hàm xử lý khi nhấn nút "OK" (Gửi form)
  const handleOk = async () => {
    try {
      // Kiểm tra validation
      const values = await form.validateFields();
      setIsLoading(true);

      if (isEditing) {
        // Logic CẬP NHẬT
        await vehicleService.updateVehicle(editingVehicle.id, values);
        message.success('Cập nhật xe thành công!');
      } else {
        // Logic THÊM MỚI
        await vehicleService.createVehicle(values);
        message.success('Thêm xe mới thành công!');
      }

      onSuccess(); // Báo cho cha (trang) biết để tải lại bảng
      onClose(); // Đóng modal

    } catch (error) {
      // Lỗi validation hoặc lỗi từ service
      console.error('Lỗi khi lưu thông tin xe:', error);
      message.error(error.message || 'Đã có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Render
  return (
    <Modal
      title={isEditing ? 'Chỉnh sửa thông tin xe' : 'Thêm xe mới'}
      open={open}
      onCancel={onClose}
      onOk={handleOk} // <-- Gắn hàm xử lý vào nút OK
      confirmLoading={isLoading} // <-- Nút OK sẽ xoay khi loading
      forceRender // Cần thiết để form khởi tạo đúng cách
    >
      <Form
        form={form}
        layout="vertical"
        name="vehicle_form"
        style={{ marginTop: '24px' }}
      >
        <Form.Item
          name="licensePlate"
          label="Biển số xe"
          rules={[{ required: true, message: 'Vui lòng nhập biển số!' }]}
        >
          <Input placeholder="Ví dụ: 50H-12345" />
        </Form.Item>

        <Form.Item
          name="capacity"
          label="Sức chứa"
          rules={[{ required: true, message: 'Vui lòng nhập sức chứa!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Ví dụ: 40" />
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

        <Form.Item
          name="currentRoute"
          label="Đang ở tuyến"
          rules={[{ required: true, message: 'Vui lòng nhập tuyến!' }]}
        >
          <Input placeholder="Ví dụ: Tuyến 05 (Hoặc 'N/A' nếu không có)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VehicleFormModal;