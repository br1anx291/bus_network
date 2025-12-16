// src/features/vehicles/components/VehicleFormModal/VehicleFormModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { vehicleService } from '~/services/vehicleService'; 

// --- 1. ĐỊNH NGHĨA OPTIONS ---
const statusOptions = [
  { value: 'active', label: 'Đang chạy' },
  { value: 'maintenance', label: 'Bảo trì' },
  { value: 'stopped', label: 'Không hoạt động' },
];

// (Đã xóa typeOptions)

const VehicleFormModal = ({ 
  open, 
  onClose, 
  onSuccess, 
  editingVehicle,
  routeOptions = [], 
  driverOptions = [] 
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!editingVehicle;

  // --- 2. LOGIC ĐIỀN DỮ LIỆU (PRE-FILL) ---
  useEffect(() => {
    if (open) {
      if (isEditing) {
        form.setFieldsValue({
          plate: editingVehicle.plate,
          model: editingVehicle.model,
          // type: editingVehicle.type, // (Đã xóa)
          capacity: editingVehicle.capacity,
          status: editingVehicle.status,
          
          routes: editingVehicle.routes || editingVehicle.routeId || null,
          driver: editingVehicle.driver || editingVehicle.driverId || null,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ 
          status: 'active', 
          capacity: 16 
        });
      }
    }
  }, [editingVehicle, form, isEditing, open]);

  // --- 3. LOGIC XỬ LÝ SUBMIT ---
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      const payload = {
        ...values,
        routes: values.routes || null,
        driver: values.driver || null
        // Không gửi type nữa
      };

      if (isEditing) {
        await vehicleService.update(editingVehicle.id, payload);
        message.success('Cập nhật xe thành công!');
      } else {
        await vehicleService.create(payload);
        message.success('Thêm xe mới thành công!');
      }

      onSuccess(); 
      onClose();   

    } catch (error) {
      console.error('Lỗi lưu xe:', error);
      const msg = error.message || 'Đã có lỗi xảy ra';
      message.error(msg);
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
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        name="vehicle_form"
        style={{ marginTop: '24px' }}
      >
        {/* --- DÒNG 1: BIỂN SỐ & MẪU XE --- */}
        <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="plate"
              label="Biển số xe"
              style={{ flex: 1 }}
              rules={[{ required: true, message: 'Vui lòng nhập biển số!' }]}
            >
              <Input placeholder="Ví dụ: 50H-12345" />
            </Form.Item>

            <Form.Item
              name="model"
              label="Mẫu xe (Hãng)"
              style={{ flex: 1 }}
              rules={[{ required: true, message: 'Vui lòng nhập mẫu xe!' }]}
            >
              <Input placeholder="Ví dụ: Ford Transit" />
            </Form.Item>
        </div>

        {/* --- DÒNG 2: SỨC CHỨA & TRẠNG THÁI (Đẩy trạng thái lên đây cho gọn) --- */}
        <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="capacity"
              label="Sức chứa"
              style={{ flex: 1 }}
              rules={[{ required: true, message: 'Vui lòng nhập sức chứa!' }]}
            >
              <InputNumber min={4} max={100} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              style={{ flex: 1 }}
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select options={statusOptions} placeholder="Chọn trạng thái" />
            </Form.Item>
        </div>

        {/* --- DÒNG 3: TÀI XẾ & TUYẾN --- */}
        <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="driver"
              label="Tài xế phụ trách"
              style={{ flex: 1 }}
            >
              <Select 
                options={driverOptions} 
                placeholder="Chọn tài xế..."
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item
              name="routes"
              label="Tuyến cố định (Nếu có)"
              style={{ flex: 1 }}
            >
              <Select 
                options={routeOptions}
                placeholder="Tìm và chọn tuyến..."
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
        </div>

      </Form>
    </Modal>
  );
};

export default VehicleFormModal;