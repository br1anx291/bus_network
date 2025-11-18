// src/pages/MapPage/MapPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Flex, Select, Input, message } from 'antd';
import Map, { Marker, Popup, NavigationControl, FullscreenControl, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; 

// Import Services (Đã nâng cấp)
import { stationService } from '~/services/stationService';
import { routeService } from '~/services/routeService';
import { vehicleService } from '~/services/vehicleService'; 
import styles from './MapPage.module.css';

// Import icons (Đảm bảo bạn có file ảnh trong assets)
import stationIcon from '~/assets/station-pin-blue.png';
import busIcon from '~/assets/bus-marker.png';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// --- MARKER COMPONENTS ---
const StationMarker = ({ station, onMarkerClick }) => (
  <Marker
    longitude={station.lon} 
    latitude={station.lat} 
    anchor="bottom-right"
    onClick={(e) => { 
      e.originalEvent.stopPropagation(); 
      onMarkerClick(station); 
    }}
  >
    <div style={{ cursor: 'pointer' }} title={station.name}>
      <img 
        src={stationIcon} 
        alt="Trạm" 
        style={{ width: '30px', height: '50px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} 
      />
    </div>
  </Marker>
);

const BusMarker = ({ bus, onMarkerClick }) => (
  <Marker
    longitude={bus.lon} 
    latitude={bus.lat} 
    anchor="bottom-left"
    onClick={(e) => { 
      e.originalEvent.stopPropagation(); 
      onMarkerClick(bus); 
    }}
  >
    <div style={{ cursor: 'pointer' }} title={bus.plate}>
      <img 
        src={busIcon} 
        alt="Xe buýt" 
        style={{ width: '40px', height: '40px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} 
      />
    </div>
  </Marker>
);

// --- POPUP RENDER ---
const renderPopupInfo = (item, type) => {
  if (type === 'station') {
    return (
      <div style={{ minWidth: 200, padding: '5px' }}>
        <h4 style={{ margin: '0 0 8px', color: '#1890ff', fontWeight: 600 }}>{item.name}</h4>
        <div style={{ fontSize: 13, color: '#333' }}>
          <div><strong>Đia chỉ:</strong> {item.address}</div>
          <div><strong>Trạng thái:</strong> {item.status}</div>
        </div>
      </div>
    );
  }
  if (type === 'bus') {
    return (
      <div style={{ minWidth: 200, padding: '5px' }}>
        <h4 style={{ margin: '0 0 8px', color: '#D32F2F', fontWeight: 600 }}>{item.plate}</h4>
        <div style={{ fontSize: 13, color: '#333' }}>
          <div><strong>Tuyến:</strong> {item.routeName || 'N/A'}</div>
          <div><strong>Tài xế:</strong> {item.driverName || 'Chưa cập nhật'}</div>
          <div><strong>Tốc độ:</strong> {item.speed ? `${item.speed} km/h` : '0 km/h'}</div>
          <div><strong>Trạng thái:</strong> {item.status}</div>
        </div>
      </div>
    );
  }
};

// --- LAYER STYLE ---
const routeLayerStyle = {
  id: 'route-line',
  type: 'line',
  layout: { 'line-join': 'round', 'line-cap': 'round' },
  paint: { 'line-color': '#1890ff', 'line-width': 4, 'line-opacity': 0.8 }
};

// --- COMPONENT CHÍNH ---
const MapPage = () => {
  const [allStations, setAllStations] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [allRoutesData, setAllRoutesData] = useState([]); 
  const [allRouteOptions, setAllRouteOptions] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  const [popupInfo, setPopupInfo] = useState(null);
  const [initialViewState, setInitialViewState] = useState({
    longitude: 108.2208, // Kinh độ Đà Nẵng
    latitude: 16.0471,   // Vĩ độ Đà Nẵng
    zoom: 12,            // Mức zoom phù hợp để nhìn toàn thành phố
  });

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchPlate, setSearchPlate] = useState('');
  const [routePolyline, setRoutePolyline] = useState(null);

  // --- 1. SỬA FETCH DATA (QUAN TRỌNG NHẤT) ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Gọi 3 service cùng lúc (Dùng hàm getAll mới)
        const [stationRes, routeRes, vehicleRes] = await Promise.all([
          stationService.getAll(1, 2000), // Lấy số lượng lớn để hiện hết lên map
          routeService.getAll(1, 2000),
          vehicleService.getAll(1, 2000) 
        ]);
        
        // Xử lý data an toàn (Mock trả về {data:[]}, API có thể trả về [])
        const stations = stationRes.data || stationRes || [];
        const routes = routeRes.data || routeRes || [];
        const vehicles = vehicleRes.data || vehicleRes || [];

        setAllStations(stations);
        setAllRoutesData(routes);
        setAllVehicles(vehicles);
        
        // Tạo options cho Select
        const routeOptions = [
          { value: null, label: 'Tất cả các tuyến' }, 
          ...routes.map(route => ({ 
            value: route.id, 
            label: `${route.name}` // Hiển thị tên tuyến
          }))
        ];
        setAllRouteOptions(routeOptions);

      } catch (error) {
        console.error(error);
        message.error('Lỗi khi tải dữ liệu bản đồ!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. LOGIC XỬ LÝ MARKER/POPUP (Giữ nguyên) ---
  const handleMarkerClick = useCallback((item, type) => {
    setPopupInfo({ item, type });
  }, []);

  const handlePopupClose = useCallback(() => {
    setPopupInfo(null);
  }, []);

  // --- 3. LOGIC FILTER ---
  const handleRouteChange = (routeId) => {
    setSelectedRoute(routeId);
    
    // Vẽ đường (Polyline)
    if (routeId) {
      const route = allRoutesData.find(r => r.id === routeId);
      if (route && route.coordinates) { // Đảm bảo mock data route có trường coordinates
        setRoutePolyline({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: route.coordinates
          }
        });
      } else {
          setRoutePolyline(null); // Nếu tuyến không có tọa độ vẽ
      }
    } else {
      setRoutePolyline(null);
    }
  };
  
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const handleSearchChange = (e) => {
    setSearchPlate(e.target.value.toLowerCase());
  };

  // Filter Xe
  const filteredVehicles = useMemo(() => {
    return allVehicles
      .filter(bus => bus.lat && bus.lon) // Chỉ lấy xe có GPS
      .filter(bus => !selectedRoute || bus.routeId === selectedRoute) // Lọc theo RouteID
      .filter(bus => !selectedStatus || bus.status === selectedStatus) 
      .filter(bus => bus.plate.toLowerCase().includes(searchPlate)); 
  }, [allVehicles, selectedRoute, selectedStatus, searchPlate]);

  // Filter Trạm
  const filteredStations = useMemo(() => {
    return allStations.filter(station => {
      if (!selectedRoute) return true;
      // Kiểm tra xem trạm có thuộc tuyến đang chọn không
      // (Giả sử station.routeIds là mảng chứa id các tuyến đi qua)
      return station.routeIds && station.routeIds.includes(selectedRoute);
    });
  }, [allStations, selectedRoute]);


  return (
    <div className={styles.pageContainer}>
      {/* --- THANH CÔNG CỤ --- */}
      <Flex className={styles.filterBar} justify="space-between" gap="middle">
        <Select
          placeholder="Lọc theo tuyến"
          options={allRouteOptions}
          loading={loading}
          className={styles.filterSelect}
          onChange={handleRouteChange}
          allowClear
          style={{ minWidth: 200 }}
        />
        <Select
          placeholder="Trạng thái xe"
          options={[
            { value: null, label: 'Tất cả' },
            { value: 'Đang chạy', label: 'Đang chạy' },
            { value: 'Bảo trì', label: 'Bảo trì' },
          ]}
          className={styles.filterSelect}
          onChange={handleStatusChange}
          allowClear
          style={{ minWidth: 150 }}
        />
        <Input.Search
          placeholder="Tìm biển số xe..."
          className={styles.filterSearch}
          onChange={handleSearchChange}
          allowClear
          style={{ maxWidth: 300 }}
        />
      </Flex>

      {/* --- BẢN ĐỒ --- */}
      <div className={styles.mapContainer}>
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={initialViewState}
          style={{ width: '100%', height: '100%' }} 
          mapStyle="mapbox://styles/mapbox/streets-v12" // Update v12 mới nhất
          attributionControl={false}
          onClick={handlePopupClose}
        >
          <NavigationControl position="bottom-right" />
          <FullscreenControl position="top-right" />

          {/* Đường vẽ lộ trình */}
          {routePolyline && (
            <Source type="geojson" data={routePolyline}>
              <Layer {...routeLayerStyle} />
            </Source>
          )}

          {/* Marker Trạm */}
          {filteredStations.map(station => (
            <StationMarker 
              key={`station-${station.id}`}
              station={station}
              onMarkerClick={(item) => handleMarkerClick(item, 'station')}
            />
          ))}

          {/* Marker Xe */}
          {filteredVehicles.map(bus => (
            <BusMarker 
              key={`bus-${bus.id}`}
              bus={bus}
              onMarkerClick={(item) => handleMarkerClick(item, 'bus')}
            />
          ))}
          
          {/* Popup Thông tin */}
          {popupInfo && (
            <Popup
              latitude={popupInfo.item.lat}
              longitude={popupInfo.item.lon}
              anchor="bottom"
              offset={popupInfo.type === 'bus' ? [0, -40] : [0, -40]}
              onClose={handlePopupClose}
              closeOnClick={false}
              closeButton={true}
              maxWidth="300px"
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