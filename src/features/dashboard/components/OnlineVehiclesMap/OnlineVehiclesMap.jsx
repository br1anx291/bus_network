// src/components/Dashboard/OnlineVehiclesMap.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import MapGL, { Popup, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, Typography } from 'antd';
import pb from '~/api/pocketbase'; 
import BusMarker from '~/features/dashboard/components/BusMarker/BusMarker'; 
import { initialViewState } from '../../data/dashboardMockData'; 
import styles from './OnlineVehiclesMap.module.css'; 

const { Title } = Typography;
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// --- HÀM XỬ LÝ DỮ LIỆU ---
const processLatestBusLocations = (records) => {
  const busMap = new Map();

  // Sắp xếp log mới nhất lên đầu
  const sortedRecords = [...records].sort((a, b) => new Date(b.created) - new Date(a.created));

  sortedRecords.forEach((record) => {
    // 1. Strict Check: Phải có ID xe
    const busId = record.buses; 
    
    // 2. Strict Check: Trạng thái phải là 'active' (Phòng hờ API filter sót)
    // Lưu ý: data từ API getFullList đã lọc rồi, nhưng check thêm ở đây không thừa
    const busInfo = record.expand?.buses || {};
    const isActive = busInfo.status === 'active';

    if (busId && isActive && !busMap.has(busId)) {
      const lat = record.latitude; 
      const lng = record.longitude; 

      if (lat && lng) {
         const driverInfo = busInfo.expand?.driver || {}; 
         const routeInfo = busInfo.expand?.current_route || {};

         busMap.set(busId, {
            id: busId, 
            locationId: record.id,
            lat: Number(lat),
            lng: Number(lng),
            speed: record.speed || 0,
            created: record.created,
            
            licensePlate: busInfo.license_plate || busInfo.plate_number || '---',
            driver: driverInfo.name || driverInfo.fullName || 'Chưa phân công',
            route: routeInfo.name || routeInfo.route_name || 'Chưa phân tuyến'
         });
      }
    }
  });

  return Array.from(busMap.values());
};

const renderPopupInfo = (bus) => {
  return (
    <div className={styles.popupContainer}>
      <h4 className={styles.popupTitle}>Xe {bus.licensePlate}</h4>
      <div className={styles.popupInfo}>
        <div><strong>Tài xế:</strong> {bus.driver}</div>
        <div><strong>Tuyến:</strong> {bus.route}</div>
        <div><strong>Cập nhật:</strong> {new Date(bus.created).toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

const OnlineVehiclesMap = () => {
  const [selectedBus, setSelectedBus] = useState(null);
  const [busLocations, setBusLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rawCount, setRawCount] = useState(0);

  useEffect(() => {
    const fetchAndSubscribe = async () => {
      try {
        setLoading(true);

        // -----------------------------------------------------------
        // 1. API FILTERING (LỌC NGAY TẠI SERVER)
        // -----------------------------------------------------------
        const records = await pb.collection('bus_locations').getFullList({
          sort: '-created',
          // CÚ PHÁP QUAN TRỌNG:
          // buses != '' : Loại bỏ log rác không có xe
          // buses.status = 'active' : Chỉ lấy log của xe có status là 'active'
          filter: "buses != '' && buses.status = 'active'", 
          expand: 'buses.driver,buses.current_route', 
        });

        setRawCount(records.length);
        const uniqueBuses = processLatestBusLocations(records);
        setBusLocations(uniqueBuses);
        setLoading(false);

        // -----------------------------------------------------------
        // 2. REAL-TIME FILTERING
        // -----------------------------------------------------------
        pb.collection('bus_locations').subscribe('*', function (e) {
          // Chỉ xử lý Create hoặc Update
          if (e.action === 'create' || e.action === 'update') {
            const record = e.record;
            const busId = record.buses;
            
            if (!busId) return;

            // CHECK TRẠNG THÁI REAL-TIME
            // Khi có bản tin mới, ta phải xem thông tin xe đi kèm có active không
            const busInfo = record.expand?.buses || {};
            
            // Nếu xe KHÔNG active, ta phải loại bỏ nó khỏi bản đồ (trường hợp xe đang chạy thì bị set Maintenance)
            if (busInfo.status !== 'active') {
                setBusLocations(prev => prev.filter(b => b.id !== busId));
                return;
            }

            // Nếu Active thì cập nhật bình thường
            setBusLocations(prev => {
                const lat = record.latitude;
                const lng = record.longitude;

                if (!lat || !lng) return prev;

                const driverInfo = busInfo.expand?.driver || {}; 
                const routeInfo = busInfo.expand?.current_route || {}; 

                const newBusData = {
                    id: busId,
                    locationId: record.id,
                    lat: Number(lat),
                    lng: Number(lng),
                    speed: record.speed || 0,
                    created: record.created,
                    
                    licensePlate: busInfo.license_plate || '---',
                    driver: driverInfo.name || driverInfo.fullName || 'Chưa phân công',
                    route: routeInfo.name || routeInfo.route_name || 'Chưa phân tuyến'
                };

                const others = prev.filter(b => b.id !== busId);
                return [...others, newBusData];
            });
          }
        });

      } catch (error) {
        console.error("Lỗi tải map:", error);
        setLoading(false);
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
          key={bus.id}
          bus={bus}
          onMarkerClick={handleMarkerClick}
        />
      )),
    [busLocations, handleMarkerClick]
  );

  return (
    <Card
      title={
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
           <Title level={4} className={styles.cardTitle}>
             Xe trực tuyến ({busLocations.length})
           </Title>
           <span style={{fontSize: '12px', color: '#888', fontWeight: 'normal'}}>
             {loading ? 'Đang tải...' : `(Active Logs: ${rawCount})`}
           </span>
        </div>
      }
      className={styles.card}
      classNames={{ body: styles.cardBody }}
    >
      <div className={styles.mapWrapper}>
        <MapGL
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
        </MapGL>
      </div>
    </Card>
  );
};

export default OnlineVehiclesMap;