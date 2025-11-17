// src/features/incidents/components/IncidentViewModal/IncidentViewModal.jsx
import React from 'react';
import { Modal, Descriptions } from 'antd';
import styles from './IncidentViewModal.module.css';

const IncidentViewModal = ({ open, onClose, incident }) => {

  if (!incident) {
    return null;
  }

  return (
    <Modal
      title="Chi tiết Sự cố"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Descriptions bordered column={1} style={{ marginTop: '24px' }}>
        <Descriptions.Item label="ID Sự cố">{incident.id}</Descriptions.Item>

        {/* --- SỬA DÒNG NÀY --- */}
        <Descriptions.Item label="Phân loại">{incident.category}</Descriptions.Item>

        <Descriptions.Item label="Chi tiết">{incident.detail}</Descriptions.Item>
        <Descriptions.Item label="Liên quan đến">{incident.related}</Descriptions.Item>
        <Descriptions.Item label="Thời gian báo cáo">{incident.time}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{incident.status}</Descriptions.Item>
        <Descriptions.Item label="Đã hoàn thành">
          {incident.isCompleted ? 'Đã hoàn thành' : 'Chưa xử lý'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default IncidentViewModal;