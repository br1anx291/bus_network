import React from 'react';
import { Marker } from 'react-map-gl';
import busMarker from '../../../../assets/bus-marker.png'; 
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
        className={styles.markerButton} 
      >
        <img
          src={busMarker}
          alt={bus.name}
          className={styles.markerImage} 
          draggable={false}
        />
      </button>
    </Marker>
  );
};

export default React.memo(BusMarker);