// // src/components/Dashboard/OnlineVehiclesMap.jsx
// import React, { useState } from 'react';
// import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import { Card, Typography } from 'antd'; 
// import busMarker from '../../assets/bus-marker.png';


// const { Title } = Typography;
// // const [selectedBus, setSelectedBus] = useState(null);

// const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// const BUS_LOCATIONS = [
//   { id: 1, lat: 10.7769, lng: 106.7009, name: 'Bus 50H-123' },
//   { id: 2, lat: 10.7796, lng: 106.6990, name: 'Bus 51B-456' },
//   { id: 3, lat: 10.7725, lng: 106.6980, name: 'Bus 59Z-789' },
// ];

// const OnlineVehiclesMap = () => {
//   const [selectedBus, setSelectedBus] = useState(null);
//   const initialViewState = {
//     latitude: 10.7760,
//     longitude: 106.7000,
//     zoom: 14,
//   };

//   return (
//     <Card 
//       title={
//         <Title level={4} style={{ margin: 0 }}>
//           Tổng quan xe trực tuyến
//         </Title>
//       }
//       style={{ height: '100%' }}
//       styles={{ body: { height: '400px', padding: '12px' } }} 
//     >
//       <div style={{ width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden' }}>
//         <Map
//           initialViewState={initialViewState}
//           style={{ width: '100%', height: '100%' }}
//           mapStyle="mapbox://styles/mapbox/streets-v12"
//           mapboxAccessToken={MAPBOX_TOKEN}
//           attributionControl={false}
//         >
//           <NavigationControl position="bottom-right" />
//           <FullscreenControl position="top-right" />

//           {BUS_LOCATIONS.map((bus) => (
//             <Marker
//               key={bus.id}
//               latitude={bus.lat}
//               longitude={bus.lng}
//               anchor="bottom"
//             >

//               <div
//                 onClick={(e) => {

//                   e.stopPropagation?.();
//                   if (e?.originalEvent?.stopPropagation) e.originalEvent.stopPropagation();
//                   setSelectedBus(bus);
//                 }}
//                 onPointerDown={(e) => {
//                   e.stopPropagation?.();
//                   if (e?.originalEvent?.stopPropagation) e.originalEvent.stopPropagation();
//                 }}
//                 title={bus.name}
//                 style={{
//                   cursor: 'pointer',
//                   // transform: 'translate(-50%, -100%)',
//                   display: 'inline-block',
//                 }}
//               >
//                 <img
//                   src={busMarker}
//                   alt={bus.name}
//                   style={{
//                     width: '50px',
//                     height: '50px',
//                     filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
//                     userSelect: 'none',
//                     WebkitUserDrag: 'none',
//                   }}
//                   draggable={false}
//                 />
//               </div>
//             </Marker>
//           ))}

//           {/* Popup hiển thị khi click marker */}
//           {selectedBus && (
//             <Popup
//               latitude={selectedBus.lat}
//               longitude={selectedBus.lng}
//               anchor="bottom-left"    
//               offset={[25, -50]}   

//               onClose={() => setSelectedBus(null)}
//               closeOnClick={true}  
//               closeButton={true}
//             >
//               <div style={{ minWidth: 180, padding: '8px 5px', fontFamily: 'sans-serif' }}>
//                 <h4 style={{ margin: '0 0 6px', color: '#D32F2F', fontWeight: 600, fontSize:'15px' }}>{selectedBus.name}</h4>
//                 <div style={{ fontSize: 13, color: '#333', lineHeight: 1.6 }}>
//                     <div><strong>Tài xế:</strong> {selectedBus.driver || 'Nguyễn Văn A'}</div>
//                     <div><strong>Tuyến:</strong> {selectedBus.route || 'Bến Thành - Suối Tiên'}</div>
//                     <div><strong>Tốc độ:</strong> {selectedBus.speed ? `${selectedBus.speed} km/h` : '35 km/h'}</div>
//                   <div><strong>Tọa độ:</strong> {selectedBus.lat.toFixed(4)}, {selectedBus.lng.toFixed(4)}</div>
//                 </div>
//               </div>
//             </Popup>
//           )}

//         </Map>
//       </div>
//     </Card>
//   );
// };

// export default OnlineVehiclesMap;

// src/components/Dashboard/OnlineVehiclesMap.jsx
import React, { useState, useMemo, useCallback } from 'react';
import Map, { Popup, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, Typography } from 'antd';
import BusMarker from '../BusMarker'; // Import component con
import { BUS_LOCATIONS, initialViewState } from  '../../data/dashboardMockData';
import styles from './OnlineVehiclesMap.module.css'; // <-- 2. IMPORT MODULE
const { Title } = Typography;
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Hàm này vẫn giữ nguyên ở ngoài, rất tốt
const renderPopupInfo = (bus) => {
  return (
    <div className={styles.popupContainer}>
      <h4 className={styles.popupTitle}>{bus.name}</h4>
      <div className={styles.popupInfo}>
        <div><strong>Tài xế:</strong> {bus.driver || 'Chưa cập nhật'}</div>
        <div><strong>Tuyến:</strong> {bus.route || 'Chưa cập nhật'}</div>
        <div><strong>Tốc độ:</strong> {bus.speed ? `${bus.speed} km/h` : 'Chưa cập nhật'}</div>
        <div><strong>Tọa độ:</strong> {bus.lat.toFixed(4)}, {bus.lng.toFixed(4)}</div>
      </div>
    </div>
  );
};

const OnlineVehiclesMap = () => {
  const [selectedBus, setSelectedBus] = useState(null);

  const handleMarkerClick = useCallback((bus) => {
    setSelectedBus(bus);
  }, []); 

  const handlePopupClose = useCallback(() => {
    setSelectedBus(null);
  }, []);

  const markers = useMemo(
    () =>
      BUS_LOCATIONS.map((bus) => (
        <BusMarker
          key={bus.id}
          bus={bus}
          onMarkerClick={handleMarkerClick}
        />
      )),
    [BUS_LOCATIONS, handleMarkerClick]
  );

  return (
    <Card
      title={
        <Title level={4} className={styles.cardTitle}>
          Tổng quan xe trực tuyến
        </Title>
      }
      className={styles.card}
      // 1. SỬA TẠI ĐÂY: Dùng 'classNames' thay vì 'styles'
      classNames={{ body: styles.cardBody }} 
    >
      <div className={styles.mapWrapper}>
        <Map
          initialViewState={initialViewState}
          // 2. SỬA TẠI ĐÂY: Trả lại 'style' prop, xóa 'className'
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          attributionControl={false}
        >
          <NavigationControl position="bottom-right" />
          <FullscreenControl position="top-right" />

          {markers}

          {selectedBus && (
            <Popup
              latitude={selectedBus.lat}
              longitude={selectedBus.lng}
              anchor="bottom-left"
              offset={[25, -50]}
              onClose={handlePopupClose}
              closeOnClick={true}
              closeButton={true}
            >
              {renderPopupInfo(selectedBus)}
            </Popup>
          )}
        </Map>
      </div>
    </Card>
  );
};

export default OnlineVehiclesMap;