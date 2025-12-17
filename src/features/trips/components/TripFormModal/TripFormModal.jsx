import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, message, DatePicker, Row, Col } from 'antd'; 
import dayjs from 'dayjs'; 
import { tripService } from '~/services/tripService'; 

const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Lên lịch (Scheduled)' },
  { value: 'running', label: 'Đang chạy (Running)' },
  { value: 'completed', label: 'Hoàn thành (Completed)' },
  { value: 'cancelled', label: 'Đã hủy (Cancelled)' },
];

const TripFormModal = ({ 
  open, 
  onClose, 
  onSuccess, 
  editingTrip,
  busOptions = [],
  routeOptions = []
}) => { 
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!editingTrip;

  useEffect(() => {
    if (open) {
      if (isEditing) {
        form.setFieldsValue({
          routes: editingTrip.routeId, 
          buses: editingTrip.busId,    
          status: editingTrip.status,
          startTime: editingTrip.startTime ? dayjs(editingTrip.startTime) : null,
          endTime: editingTrip.endTime ? dayjs(editingTrip.endTime) : null,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ status: 'scheduled' });
      }
    }
  }, [editingTrip, form, isEditing, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      const dbPayload = {
        routes: values.routes,
        buses: values.buses, 
        status: values.status,
        start_time: values.startTime ? values.startTime.toISOString() : null,
        end_time: values.endTime ? values.endTime.toISOString() : null,
      };

      if (isEditing) {
        await tripService.update(editingTrip.id, dbPayload);
        message.success('Cập nhật chuyến thành công!');
      } else {
        await tripService.create(dbPayload);
        message.success('Thêm chuyến mới thành công!');
      }

      onSuccess();
      onClose();

    } catch (error) {
      console.error('Lỗi khi lưu thông tin chuyến:', error);
      const msg = error.data?.message || error.message || 'Đã có lỗi xảy ra';
      message.error(`Lỗi: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Chỉnh sửa lịch chạy' : 'Tạo lịch chạy mới'}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={isLoading}
      width={600}
      okText={isEditing ? 'Lưu thay đổi' : 'Thêm mới'}
      cancelText="Hủy bỏ"
      forceRender
    >
      <Form
        form={form}
        layout="vertical"
        name="trip_form"
        style={{ marginTop: '24px' }}
      >
        <Form.Item
          name="routes"
          label="Tuyến đường"
          rules={[{ required: true, message: 'Vui lòng chọn tuyến!' }]}
        >
          <Select 
            placeholder="Tìm và chọn tuyến..."
            options={routeOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          name="buses"
          label="Xe buýt thực hiện"
          rules={[{ required: true, message: 'Vui lòng chọn xe!' }]}
        >
          <Select 
            placeholder="Tìm và chọn xe..."
            options={busOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startTime"
              label="Thời gian đi"
              rules={[{ required: true, message: 'Vui lòng chọn giờ đi!' }]}
            >
              <DatePicker 
                showTime={{ format: 'HH:mm' }} 
                format="DD/MM/YYYY HH:mm" 
                placeholder="Chọn ngày giờ"
                style={{ width: '100%' }} 
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endTime"
              label="Thời gian đến (Dự kiến)"
              rules={[{ required: true, message: 'Vui lòng chọn giờ đến!' }]}
            >
              <DatePicker 
                showTime={{ format: 'HH:mm' }} 
                format="DD/MM/YYYY HH:mm" 
                placeholder="Chọn ngày giờ"
                style={{ width: '100%' }} 
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
            options={STATUS_OPTIONS}
            placeholder="Chọn trạng thái"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TripFormModal;