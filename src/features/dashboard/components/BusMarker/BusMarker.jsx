// src/components/Dashboard/BusMarker.jsx
import React from 'react';
import { Marker } from 'react-map-gl';
import busMarker from '../../../../assets/bus-marker.png';

// Sử dụng React.memo để tối ưu
const BusMarker = ({ bus, onMarkerClick }) => {
  // Đóng gói logic click vào đây
  const handleClick = (e) => {
    e.stopPropagation?.(); // Ngăn sự kiện lan xuống map
    onMarkerClick(bus);
  };

  return (
    <Marker
      latitude={bus.lat}
      longitude={bus.lng}
      anchor="bottom"
      // Offset marker một chút nếu cần, ví dụ: offset={[0, -25]}
    >
      {/* Sử dụng <button> để cải thiện accessibility.
        Cần CSS để reset style mặc định của button.
      */}
      <button
        type="button"
        onClick={handleClick}
        title={bus.name}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <img
          src={busMarker}
          alt={bus.name}
          style={{
            width: '50px',
            height: '50px',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            userSelect: 'none',
            WebkitUserDrag: 'none',
          }}
          draggable={false}
        />
      </button>
    </Marker>
  );
};

// So sánh nông (shallow compare) props
export default React.memo(BusMarker);