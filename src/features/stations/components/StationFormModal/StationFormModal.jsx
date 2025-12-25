import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message, InputNumber, Row, Col } from 'antd';
import { stationService } from '~/services/stationService'; 

const statusOptions = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'maintenance', label: 'Bảo trì' },
  { value: 'stopped', label: 'Ngừng hoạt động' },
];

const StationFormModal = ({ open, onClose, onSuccess, editingStation }) => { 
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!editingStation;

  useEffect(() => {
    if (open) {
      if (isEditing) {
        form.setFieldsValue({
          name: editingStation.name,
          address: editingStation.address,
          lat: editingStation.lat,
          lng: editingStation.lng,
          status: editingStation.status,
        });
      } else {
        form.resetFields();
      }
    }
  }, [editingStation, form, isEditing, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("🚀 Dữ liệu Trạm gửi đi:", values); 
      setIsLoading(true);

      if (isEditing) {
        await stationService.update(editingStation.id, values);
        message.success('Cập nhật trạm thành công!');
      } else {
        await stationService.create(values);
        message.success('Thêm trạm mới thành công!');
      }

      onSuccess();
      onClose();  

} catch (error) {
      if (error.errorFields) {
        console.log("Validate failed:", error);
      } else {
        console.error('Lỗi API:', error);
        const errorData = error.response?.data || {};
        const firstKey = Object.keys(errorData)[0];
        const msg = firstKey 
          ? `${firstKey}: ${errorData[firstKey].message}` 
          : (error.message || 'Lỗi không xác định');
          
        message.error(`Lỗi: ${msg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Chỉnh sửa thông tin trạm' : 'Thêm trạm mới'}
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
        name="station_form"
        style={{ marginTop: '24px' }}
        initialValues={{ status: 'active' }}
      >
        <Form.Item
          name="name"
          label="Tên trạm"
          rules={[{ required: true, message: 'Vui lòng nhập tên trạm!' }]}
        >
          <Input placeholder="Ví dụ: Bến Thành" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input placeholder="Ví dụ: Quận 1, TP.HCM" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="lat"
              label="Vĩ độ (Lat)"
              rules={[{ required: true, message: 'Vui lòng nhập vĩ độ!' }]}
            >
              <InputNumber 
                step="0.0001" 
                style={{ width: '100%' }} 
                placeholder="10.7725"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lng"
              label="Kinh độ (Lng)"
              rules={[{ required: true, message: 'Vui lòng nhập kinh độ!' }]}
            >
              <InputNumber 
                step="0.0001" 
                style={{ width: '100%' }} 
                placeholder="106.6980"
              />
            </Form.Item>
          </Col>
        </Row>

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

export default StationFormModal;