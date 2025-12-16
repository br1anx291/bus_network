// src/pages/MapPage/MapPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Flex, Select, Input, message, Tag } from 'antd'; // Import lại Input
import Map, { Marker, Popup, NavigationControl, FullscreenControl, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; 

// Import Services
import { stationService } from '~/services/stationService';
import { routeService } from '~/services/routeService';
import { mapService } from '~/services/mapService'; 

import styles from './MapPage.module.css';

// Import icons
import stationIcon from '~/assets/station-pin-blue.png';
import busIcon from '~/assets/bus-marker.png';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// --- 1. HÀM CHECK TOẠ ĐỘ ---
const isValidCoordinate = (lat, lng) => {
  const validLat = Number.isFinite(lat) && lat >= -90 && lat <= 90;
  const validlng = Number.isFinite(lng) && lng >= -180 && lng <= 180;
  return validLat && validlng;
};

// --- 2. COMPONENTS CON (Marker) ---
const StationMarker = ({ station, onMarkerClick }) => (
  <Marker
    longitude={station.lng} 
    latitude={station.lat} 
    anchor="bottom"
    onClick={(e) => { e.originalEvent.stopPropagation(); onMarkerClick(station); }}
  >
    <div style={{ cursor: 'pointer' }} title={station.name}>
      <img src={stationIcon} alt="Trạm" style={{ width: '30px', height: '75px', objectFit: 'contain' }} />
    </div>
  </Marker>
);

const BusMarker = ({ bus, onMarkerClick }) => (
  <Marker
    longitude={bus.lng} 
    latitude={bus.lat} 
    anchor="bottom"
    onClick={(e) => { e.originalEvent.stopPropagation(); onMarkerClick(bus); }}
  >
    <div style={{ cursor: 'pointer' }} title={bus.plate}>
      <img 
        src={busIcon} 
        alt="Bus" 
        style={{ width: '50px', height: '75px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} 
      />
      {/* <div style={{ background: 'white', padding: '0 4px', borderRadius: 4, fontSize: 10, textAlign: 'center', border: '1px solid #ccc', marginTop: -5 }}>
        {bus.plate}
      </div> */}
    </div>
  </Marker>
);

// --- 3. POPUP ---
// const renderPopupInfo = (item, type) => {
//   if (type === 'station') {
//     return (
//       <div style={{ padding: 5 }}>
//         <h4 style={{ margin: 0, color: '#1890ff' }}>{item.name}</h4>
//         <p style={{ margin: '5px 0 0', fontSize: 12 }}>{item.address}</p>
//         <Tag color="blue" style={{ marginTop: 5 }}>{item.status}</Tag>
//       </div>
//     );
//   }
//   if (type === 'bus') {
//     return (
//       <div style={{ padding: 5 }}>
//         <h4 style={{ margin: 0, color: '#d9363e' }}>{item.plate}</h4>
//         <p style={{ margin: '5px 0 0', fontSize: 12 }}>Trạng thái: {item.status}</p>
//         <p style={{ margin: '2px 0 0', fontSize: 10, color: '#888' }}>
//           Cập nhật: {new Date(item.updatedAt).toLocaleTimeString()}
//         </p>
//       </div>
//     );
//   }
// };

// --- 3. POPUP (CẬP NHẬT GIAO DIỆN MỚI) ---
const renderPopupInfo = (item, type) => {
  // A. Popup cho TRẠM DỪNG
  if (type === 'station') {
    return (
      <div style={{ width: '220px', padding: '4px' }}>
        {/* Header */}
        <div style={{ 
          borderBottom: '1px solid #f0f0f0', 
          paddingBottom: '8px', 
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {/* Icon trạm nhỏ */}
          <div style={{ width: 24, height: 24, background: '#e6f7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1890ff', fontWeight: 'bold', fontSize: '10px' }}>T</div>
          <h4 style={{ margin: 0, color: '#1890ff', fontSize: '14px', flex: 1 }}>{item.name}</h4>
        </div>
        
        {/* Body */}
        <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* <div>
            <strong style={{ color: '#555' }}>Mã trạm:</strong> {item.code || '---'}
          </div> */}
          <div>
             <strong style={{ color: '#555' }}>Địa chỉ:</strong> 
             <span style={{ color: '#777', marginLeft: 4 }}>{item.address}</span>
          </div>
          <div style={{ marginTop: 4 }}>
            <Tag color={item.status === 'active' ? 'blue' : 'red'}>
              {item.status === 'active' ? 'Đang hoạt động' : 'Bảo trì'}
            </Tag>
          </div>
        </div>
      </div>
    );
  }

  // B. Popup cho XE BUÝT
  if (type === 'bus') {
    return (
      <div style={{ width: '240px', padding: '4px' }}>
        {/* Header */}
        <div style={{ 
          borderBottom: '1px solid #f0f0f0', 
          paddingBottom: '8px', 
          marginBottom: '8px',
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h4 style={{ margin: 0, color: '#1890ff', fontSize: '15px', fontWeight: 'bold' }}>
            Xe {item.plate || item.licensePlate} {/* Fallback tên trường */}
          </h4>
          {/* <Tag color="cyan">{item.speed ? `${item.speed} km/h` : '0 km/h'}</Tag> */}
        </div>

        {/* Body */}
        <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div>
            <strong style={{ color: '#333' }}>Tài xế:</strong> {item.driver || 'Chưa phân công'}
          </div>
          <div>
            <strong style={{ color: '#333' }}>Tuyến:</strong> {item.route || 'Chưa phân tuyến'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
             <strong style={{ color: '#333' }}>Trạng thái:</strong>
             <Tag color={item.status === 'active' ? 'success' : 'warning'} style={{ margin: 0 }}>
               {item.status === 'active' ? 'Đang chạy' : 'Bảo trì'}
             </Tag>
          </div>
          
          <div style={{ 
            borderTop: '1px solid #f5f5f5', 
            marginTop: '2px', 
            paddingTop: '2px', 
            fontSize: '11px', 
            color: '#999',
            fontStyle: 'italic',
            textAlign: 'right'
          }}>
          </div>
        </div>
      </div>
    );
  }
};

const routeLayerStyle = {
  id: 'route-line',
  type: 'line',
  layout: { 'line-join': 'round', 'line-cap': 'round' },
  paint: { 'line-color': '#1890ff', 'line-width': 5, 'line-opacity': 0.7 }
};

// --- COMPONENT CHÍNH ---
const MapPage = () => {
  // Dữ liệu gốc
  const [stations, setStations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [busLocations, setBusLocations] = useState([]); 
  
  // State Map
  const [popupInfo, setPopupInfo] = useState(null);
  const [routePolyline, setRoutePolyline] = useState(null);
  const [initialViewState] = useState({ longitude: 108.2208, latitude: 16.0471, zoom: 12 });

  // --- [KHÔI PHỤC] State Bộ Lọc ---
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchPlate, setSearchPlate] = useState('');
  const [routeStationIds, setRouteStationIds] = useState([]);

  // 1. FETCH BASE DATA
  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        const [stationRes, routeRes] = await Promise.all([
          stationService.getAll(1, 1000), // Lấy nhiều để hiện hết
          routeService.getAll(1, 1000)
        ]);
        setStations(stationRes.data || []);
        setRoutes(routeRes.data || []);
      } catch (error) {
        message.error("Lỗi tải dữ liệu");
      }
    };
    fetchBaseData();
  }, []);

const fetchBusLocations = async () => {
    try {
      const locations = await mapService.getBusLocations();
      
    if (locations.length > 0) {
              console.group("🔥 DEBUG DATA XE ĐẦU TIÊN");
              const firstBus = locations[0];
              console.log("1. Record gốc:", firstBus);
              console.log("2. Expand Buses:", firstBus.expand?.buses);
              console.log("3. Expand Driver (Lớp 2):", firstBus.expand?.buses?.expand?.driver);
              console.groupEnd();
          }

      const mappedLocations = locations.map(rec => {
        // Lấy thông tin từ các tầng expand
        // Lưu ý: Cần dùng cú pháp ?. để tránh lỗi nếu không có dữ liệu
        const busInfo = rec.expand?.buses || {};
        const driverInfo = busInfo.expand?.driver || {};       // Lớp 2: Driver
        const routeInfo = busInfo.expand?.current_route || {}; // Lớp 2: Route

        return {
           // Giữ lại các field gốc
           ...rec,
           
           // Gán ID rõ ràng cho marker key
           locationId: rec.id,

           // Ưu tiên lấy dữ liệu đã map (nếu service làm rồi), nếu không thì đào sâu vào expand
           plate: rec.plate || busInfo.license_plate || 'Unknown',
           
           // QUAN TRỌNG: Driver nằm sâu 2 lớp expand
           driver: rec.driver || driverInfo.name || driverInfo.fullName || '---',
           
           // Route cũng nằm sâu 2 lớp
           route: rec.route || routeInfo.name || routeInfo.route_name || '---',
           
           status: rec.status || busInfo.status || 'unknown',
           updatedAt: rec.updatedAt || rec.updated || rec.created
        };
      });

      setBusLocations(mappedLocations);
    } catch (error) { console.error("Lỗi fetch bus:", error); }
};

  useEffect(() => {
    fetchBusLocations();
    const interval = setInterval(fetchBusLocations, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- [KHÔI PHỤC] XỬ LÝ SỰ KIỆN FILTER ---
  
  // A. Chọn Tuyến
  const handleRouteChange = async (routeId) => {
    setSelectedRouteId(routeId);
    if (!routeId) {
      setRoutePolyline(null);
      setRouteStationIds([]); // Reset list trạm
    } else {
      const selectedRoute = routes.find(r => r.id === routeId);
      if (selectedRoute?.path?.length > 0) {
        setRoutePolyline({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: selectedRoute.path }
        });
      } else {
        setRoutePolyline(null);
        message.info("Tuyến này chưa có dữ liệu bản đồ");
      }
    }
    try {
      const stationIds = await routeService.getStationsByRoute(routeId);
      setRouteStationIds(stationIds);
    } catch (error) {
      console.error(error);
    }
  };

  // B. Chọn Trạng thái
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  // C. Nhập tìm kiếm biển số
  const handleSearchChange = (e) => {
    setSearchPlate(e.target.value.toLowerCase());
  };

  // --- [KHÔI PHỤC] LOGIC LỌC DỮ LIỆU ---
  
  const filteredBuses = useMemo(() => {
    return busLocations.filter(bus => {
      // 1. Lọc theo toạ độ (Bắt buộc)
      if (!bus.lat || !bus.lng && (!bus.lat && !bus.lng)) return false; // Check sơ bộ

      // 2. Lọc theo Tuyến (Tạm thời bỏ qua vì busLocations chưa có routeId, sẽ update sau)
      // if (selectedRouteId && bus.routeId !== selectedRouteId) return false;

      // 3. Lọc theo Trạng thái
      if (selectedStatus && bus.status !== selectedStatus) return false;

      // 4. Lọc theo Biển số (Search)
      if (searchPlate && !bus.plate.toLowerCase().includes(searchPlate)) return false;

      return true;
    });
  }, [busLocations, selectedRouteId, selectedStatus, searchPlate]);

  // Lọc Trạm theo Tuyến (Nếu logic tuyến đi qua trạm có trong DB)
  // Hiện tại hiển thị tất cả trạm vì ta chưa làm bảng 'route_stations'
  const filteredStations = useMemo(() => {
    // Trường hợp 1: Chưa chọn tuyến nào -> Hiển thị TẤT CẢ trạm
    if (!selectedRouteId) return stations;

    // Trường hợp 2: Đã chọn tuyến -> Chỉ hiện trạm có ID nằm trong danh sách routeStationIds
    return stations.filter(st => routeStationIds.includes(st.id));
  }, [stations, selectedRouteId, routeStationIds]);

  return (
    <div className={styles.pageContainer}>
      {/* FILTER BAR - ĐÃ KHÔI PHỤC ĐẦY ĐỦ */}
      <Flex className={styles.filterBar} gap="middle" wrap="wrap">
        
        {/* 1. Chọn Tuyến */}
        <Select
          style={{ width: 220 }}
          placeholder="Chọn tuyến lộ trình"
          allowClear
          onChange={handleRouteChange}
          options={routes.map(r => ({ value: r.id, label: `${r.code} - ${r.name}` }))}
        />

        {/* 2. Chọn Trạng thái */}
        <Select
          placeholder="Trạng thái xe"
          style={{ width: 150 }}
          allowClear
          onChange={handleStatusChange}
          options={[
            { value: 'active', label: 'Đang chạy' }, // Lưu ý value phải khớp với DB (active/maintenance...)
            { value: 'maintenance', label: 'Bảo trì' },
            { value: 'stopped', label: 'Dừng hoạt động' },
          ]}
        />

        {/* 3. Tìm kiếm Biển số */}
        <Input.Search
          placeholder="Tìm biển số xe..."
          allowClear
          onChange={handleSearchChange}
          style={{ maxWidth: 250 }}
        />

        <Tag color="blue" style={{ display: 'flex', alignItems: 'center' }}>Live: 10s</Tag>
      </Flex>

      {/* MAP AREA */}
      <div className={styles.mapContainer}>
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={initialViewState}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
        >
          <NavigationControl position="bottom-right" />
          <FullscreenControl position="top-right" />

          {/* LAYER TUYẾN */}
          {routePolyline && (
            <Source type="geojson" data={routePolyline}>
              <Layer {...routeLayerStyle} />
            </Source>
          )}

          {/* MARKER TRẠM */}
          {filteredStations.map(st => {
             if (!isValidCoordinate(st.lat, st.lng)) return null;
             return (
              <StationMarker 
                key={st.id} 
                station={st} 
                onMarkerClick={(item) => setPopupInfo({ item, type: 'station' })}
              />
            );
          })}

          {/* MARKER XE (Đã qua bộ lọc filteredBuses) */}
          {filteredBuses.map(bus => {
             if (!isValidCoordinate(bus.lat, bus.lng)) return null;
             return (
              <BusMarker 
                key={bus.locationId} 
                bus={bus} 
                onMarkerClick={(item) => setPopupInfo({ item, type: 'bus' })}
              />
            );
          })}

          {/* POPUP */}
          {popupInfo && (
            <Popup
              latitude={popupInfo.item.lat}
              longitude={popupInfo.item.lng}
              anchor="bottom"
              offset={15}
              onClose={() => setPopupInfo(null)}
              closeButton={true}
              closeOnClick={false}
            >
              {renderPopupInfo(popupInfo.item, popupInfo.type)}
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
};

export default MapPage;