// src/features/dashboard/components/BusMarker/BusMarker.jsx
import React from 'react';
import { Marker } from 'react-map-gl';

// 1. SỬA ĐƯỜNG DẪN IMPORT (Xem giải thích bên dưới)
import busMarker from '../../../../assets/bus-marker.png'; 

// 2. Import CSS Module
import styles from './BusMarker.module.css';

const BusMarker = ({ bus, onMarkerClick }) => {
  const handleClick = (e) => {
    e.stopPropagation?.();
    onMarkerClick(bus);
  };

  return (
    <Marker latitude={bus.lat} longitude={bus.lng} anchor="bottom">
      <button
        type="button"
        onClick={handleClick}
        title={bus.name}
        className={styles.markerButton} // 3. Áp dụng class
        // Toàn bộ inline style đã bị xóa
      >
        <img
          src={busMarker}
          alt={bus.name}
          className={styles.markerImage} // 4. Áp dụng class
          draggable={false}
          // Toàn bộ inline style đã bị xóa
        />
      </button>
    </Marker>
  );
};

export default React.memo(BusMarker);