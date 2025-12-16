// src/components/Dashboard/OnlineVehiclesMap.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Map, { Popup, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, Typography } from 'antd';

// Import api pocketbase
import pb from '~/api/pocketbase'; 

import BusMarker from '../../features/dashboard/components/BusMarker/BusMarker'; 
import { initialViewState } from '../../data/dashboardMockData'; 
import styles from './OnlineVehiclesMap.module.css'; 

const { Title } = Typography;
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// --- HÀM XỬ LÝ DỮ LIỆU (Theo Schema mới) ---
const processLatestBusLocations = (records) => {
  const busMap = new Map();

  // Sắp xếp: Mới nhất lên đầu
  const sortedRecords = [...records].sort((a, b) => new Date(b.created) - new Date(a.created));

  sortedRecords.forEach((record) => {
    // 1. UNIQUE KEY: Dùng trường relation 'buses' (ID của xe)
    // Nếu record không có relation tới xe nào thì bỏ qua
    const busId = record.buses; 
    
    if (busId && !busMap.has(busId)) {
      // 2. LẤY THÔNG TIN XE TỪ EXPAND
      // Vì field 'buses' là relation single, nên expand.buses là 1 object
      const busInfo = record.expand?.buses || {};

      // Chỉ lấy nếu có tọa độ hợp lệ
      if (record.latitude && record.longitude) {
         busMap.set(busId, {
            id: busId, // ID của xe (từ relation)
            locationId: record.id, // ID của bản ghi log location
            
            // Map đúng trường từ DB
            lat: record.latitude, 
            lng: record.longitude,
            speed: record.speed || 0, // Nếu có field speed
            created: record.created,

            // Thông tin chi tiết từ bảng 'buses'
            name: busInfo.name || 'Xe chưa đặt tên',
            licensePlate: busInfo.license_plate || busInfo.plate_number || '---', 
            // Lưu ý: Bạn cần check xem trong bảng 'buses' bạn đặt tên field biển số là gì
            driver: busInfo.driver || '---',
            route: busInfo.route || '---'
         });
      }
    }
  });

  return Array.from(busMap.values());
};

const renderPopupInfo = (bus) => {
  return (
    <div className={styles.popupContainer}>
      <h4 className={styles.popupTitle}>{bus.name}</h4>
      <div className={styles.popupInfo}>
        {bus.licensePlate !== '---' && <div><strong>BKS:</strong> {bus.licensePlate}</div>}
        <div><strong>Tài xế:</strong> {bus.driver}</div>
        <div><strong>Tốc độ:</strong> {bus.speed} km/h</div>
        <div><strong>Tọa độ:</strong> {bus.lat.toFixed(4)}, {bus.lng.toFixed(4)}</div>
        <div style={{fontSize: '10px', color: '#999', marginTop: '5px'}}>
           Cập nhật: {new Date(bus.created).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

const OnlineVehiclesMap = () => {
  const [selectedBus, setSelectedBus] = useState(null);
  const [busLocations, setBusLocations] = useState([]);

  useEffect(() => {
    const fetchAndSubscribe = async () => {
      try {
        // 1. INITIAL FETCH
        // BẮT BUỘC PHẢI CÓ: expand: 'buses'
        const records = await pb.collection('bus_locations').getFullList({
          sort: '-created',
          expand: 'buses', 
        });

        const uniqueBuses = processLatestBusLocations(records);
        setBusLocations(uniqueBuses);

        // 2. REAL-TIME SUBSCRIPTION
        // Lưu ý: Real-time của PocketBase trả về record, nhưng đôi khi expand không đi kèm đầy đủ
        // tùy version. Tuy nhiên ta vẫn bắt sự kiện để cập nhật tọa độ.
        pb.collection('bus_locations').subscribe('*', function (e) {
          const { action, record } = e;

          if (action === 'create' || action === 'update') {
            setBusLocations((prevBuses) => {
              const busId = record.buses; // ID của xe
              if (!busId) return prevBuses;

              // Tìm xe này trong danh sách hiện tại để giữ lại thông tin cũ (tên, tài xế...)
              // vì bản ghi realtime đôi khi thiếu expand
              const existingBus = prevBuses.find(b => b.id === busId);
              
              // Tạo object xe mới
              const updatedBus = {
                ...existingBus, // Giữ lại thông tin cũ (tên, driver...)
                id: busId,
                lat: record.latitude,
                lng: record.longitude,
                speed: record.speed || 0,
                created: record.created,
                // Nếu bản tin realtime có expand (tùy config), ta update luôn
                ...(record.expand?.buses ? {
                    name: record.expand.buses.name,
                    licensePlate: record.expand.buses.license_plate
                } : {})
              };

              // Lọc bỏ xe cũ, thêm xe mới
              const otherBuses = prevBuses.filter(b => b.id !== busId);
              return [...otherBuses, updatedBus];
            });
          }
        });

      } catch (error) {
        console.error("Lỗi PocketBase:", error);
      }
    };

    fetchAndSubscribe();

    return () => {
      pb.collection('bus_locations').unsubscribe();
    };
  }, []);

  const handleMarkerClick = useCallback((bus) => {
    setSelectedBus(bus);
  }, []);

  const handlePopupClose = useCallback(() => {
    setSelectedBus(null);
  }, []);

  const markers = useMemo(
    () =>
      busLocations.map((bus) => (
        <BusMarker
          key={bus.id} // Key là ID của xe (relation ID)
          bus={bus}
          onMarkerClick={handleMarkerClick}
        />
      )),
    [busLocations, handleMarkerClick]
  );

  return (
    <Card
      title={
        <Title level={4} className={styles.cardTitle}>
          Tổng quan xe trực tuyến ({busLocations.length})
        </Title>
      }
      className={styles.card}
      classNames={{ body: styles.cardBody }}
    >
      <div className={styles.mapWrapper}>
        <Map
          initialViewState={initialViewState}
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
              offset={[25, -20]}
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