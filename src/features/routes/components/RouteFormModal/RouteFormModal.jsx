// src/features/routes/components/RouteFormModal/RouteFormModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message, InputNumber } from 'antd';

// 1. Import routeService
import { routeService } from '~/services/routeService'; 

const statusOptions = [
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'maintenance', label: 'Bảo trì' },
  { value: 'stopped', label: 'Tạm ngưng' },
];

const RouteFormModal = ({ open, onClose, onSuccess, editingRoute }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!editingRoute;

  // 2. Đổ dữ liệu vào form khi sửa
  useEffect(() => {
    if (open) {
      if (isEditing) {
        form.setFieldsValue({
          code: editingRoute.code,
          name: editingRoute.name,
          description: editingRoute.description, // Thêm trường này
          status: editingRoute.status || '',
        });
      } else {
        form.resetFields();
      }
    }
  }, [editingRoute, form, isEditing, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      if (isEditing) {
        // 3. [NÂNG CẤP] Gọi hàm update (Truyền ID riêng)
        await routeService.update(editingRoute.id, values);
        message.success('Cập nhật tuyến thành công!');
      } else {
        // 4. [NÂNG CẤP] Gọi hàm create
        await routeService.create(values);
        message.success('Thêm tuyến mới thành công!');
      }

      onSuccess(); // Tải lại bảng
      onClose();   // Đóng modal

    } catch (error) {
      // [FIX QUAN TRỌNG] Phân loại lỗi để hiển thị
      if (error.errorFields) {
        // Đây là lỗi chưa nhập đủ thông tin (Antd tự hiện chữ đỏ dưới ô input)
        // Không cần alert message gây khó chịu
        console.log("Validate failed:", error);
      } else {
// --- SỬA ĐOẠN NÀY ĐỂ SOI LỖI 400 ---
        console.error('Chi tiết lỗi PocketBase:', error.response); 
        // error.response.data sẽ cho biết chính xác cột nào sai
        
        // Hiển thị thông báo lỗi cụ thể
        const errorData = error.response?.data || {};
        const firstKey = Object.keys(errorData)[0];
        const errorMessage = firstKey 
          ? `${firstKey}: ${errorData[firstKey].message}` 
          : (error.message || 'Lỗi không xác định');

        message.error(`Lỗi tạo tuyến: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Chỉnh sửa thông tin tuyến' : 'Thêm tuyến mới'}
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
        name="route_form"
        style={{ marginTop: '24px' }}
        initialValues={{ status: 'active', numStops: 10 }}
      >
        <Form.Item
          name="code"
          label="Mã tuyến"
          rules={[{ required: true, message: 'Vui lòng nhập mã tuyến!' }]}
        >
          <Input placeholder="Ví dụ: R1" />
        </Form.Item>
        {/* FIELD 1: TÊN TUYẾN */}
        <Form.Item
          name="name"
          label="Tên tuyến"
          rules={[{ required: true, message: 'Vui lòng nhập tên tuyến!' }]}
        >
          <Input placeholder="Ví dụ: Tuyến 01" />
        </Form.Item>
        
        {/* FIELD 2: MÔ TẢ (Thêm mới cho khớp Table) */}
        <Form.Item
          name="description"
          label="Mô tả lộ trình"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <Input placeholder="Ví dụ: Bến Thành - Bến xe Miền Tây" />
        </Form.Item>

        {/* FIELD 4: TRẠNG THÁI */}
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

export default RouteFormModal;