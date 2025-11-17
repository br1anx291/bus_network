// src/pages/MapPage/MapPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Flex, Select, Input, message } from 'antd';
// Import thêm: Source, Layer
import Map, { Marker, Popup, NavigationControl, FullscreenControl, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; 

// Import Services
import { stationService } from '~/services/stationService';
import { routeService } from '~/services/routeService';
import { vehicleService } from '~/services/vehicleService'; 
import styles from './MapPage.module.css';

// Import icons
import stationIcon from '~/assets/station-pin-blue.png';
import busIcon from '~/assets/bus-marker.png';

// Lấy Token
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
        style={{ 
          width: '30px', 
          height: '50px',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          userSelect: 'none',
          WebkitUserDrag: 'none',
        }} 
        draggable={false} 
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
        style={{ 
          width: '50px', 
          height: '50px',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          userSelect: 'none',
          WebkitUserDrag: 'none',
        }} 
        draggable={false} 
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
        <div style={{ fontSize: 13, color: '#333', lineHeight: 1.6 }}>
          <div><strong>Trạng thái:</strong> {item.status}</div>
          <div><strong>Tọa độ:</strong> {item.lat.toFixed(4)}, {item.lon.toFixed(4)}</div>
        </div>
      </div>
    );
  }
  if (type === 'bus') {
    return (
      <div style={{ minWidth: 200, padding: '5px' }}>
        <h4 style={{ margin: '0 0 8px', color: '#D32F2F', fontWeight: 600 }}>{item.plate}</h4>
        <div style={{ fontSize: 13, color: '#333', lineHeight: 1.6 }}>
          <div><strong>Tài xế:</strong> {item.driverName || 'Chưa cập nhật'}</div>
          <div><strong>Trạng thái:</strong> {item.status}</div>
          <div><strong>Tọa độ:</strong> {item.lat.toFixed(4)}, {item.lon.toFixed(4)}</div>
        </div>
      </div>
    );
  }
};

// --- LAYER STYLE CHO ĐƯỜNG VẼ ---
const routeLayerStyle = {
  id: 'route-line',
  type: 'line',
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#1890ff', // Màu xanh
    'line-width': 4,
    'line-opacity': 0.8
  }
};


// --- COMPONENT CHÍNH ---

const MapPage = () => {
  // State dữ liệu gốc
  const [allStations, setAllStations] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [allRoutesData, setAllRoutesData] = useState([]); // State chứa data thô
  const [allRouteOptions, setAllRouteOptions] = useState([]); // State cho Select
  const [loading, setLoading] = useState(false);
  
  // State Popup, ViewState
  const [popupInfo, setPopupInfo] = useState(null);
  const [initialViewState, setInitialViewState] = useState({
    longitude: 106.6980,
    latitude: 10.7725,
    zoom: 13,
  });

  // State cho Bộ lọc
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchPlate, setSearchPlate] = useState('');

  // State cho đường vẽ
  const [routePolyline, setRoutePolyline] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [stationRes, routeRes, vehicleRes] = await Promise.all([
          stationService.getStations(1, 1000),
          routeService.getRoutes(1, 1000),
          vehicleService.getVehicles(1, 1000) 
        ]);
        
        setAllStations(stationRes.data);
        setAllVehicles(vehicleRes.data);
        
        // Lưu data thô của Tuyến (có coordinates)
        setAllRoutesData(routeRes.data); 
        
        // Tạo options cho Select (thêm "Tất cả")
        const routeOptions = [
          { value: null, label: 'Tất cả các tuyến' }, 
          ...routeRes.data.map(route => ({ value: route.id, label: `${route.name}: ${route.startPoint} - ${route.endPoint}` }))
        ];
        setAllRouteOptions(routeOptions);

      } catch (error) {
        message.error('Lỗi khi tải dữ liệu!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Hàm xử lý click
  const handleMarkerClick = useCallback((item, type) => {
    setPopupInfo({ item, type });
  }, []);

  const handlePopupClose = useCallback(() => {
    setPopupInfo(null);
  }, []);

  // Hàm xử lý cho Bộ lọc
  const handleRouteChange = (routeId) => {
    setSelectedRoute(routeId);
    
    // Cập nhật đường vẽ
    if (routeId) {
      const route = allRoutesData.find(r => r.id === routeId);
      if (route && route.coordinates) {
        setRoutePolyline({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: route.coordinates
          }
        });
      }
    } else {
      setRoutePolyline(null); // Xóa đường vẽ nếu chọn "Tất cả"
    }
  };
  
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const handleSearchChange = (e) => {
    setSearchPlate(e.target.value.toLowerCase());
  };

  // Tối ưu hóa việc lọc bằng useMemo
  const filteredVehicles = useMemo(() => {
    return allVehicles
      .filter(bus => bus.lat && bus.lon) // Chỉ hiển thị xe có tọa độ
      .filter(bus => !selectedRoute || bus.routeId === selectedRoute) // Lọc theo Tuyến
      .filter(bus => !selectedStatus || bus.status === selectedStatus) // Lọc theo Trạng thái
      .filter(bus => bus.plate.toLowerCase().includes(searchPlate)); // Lọc theo Biển số
  }, [allVehicles, selectedRoute, selectedStatus, searchPlate]);

  const filteredStations = useMemo(() => {
    return allStations.filter(station => {
      if (!selectedRoute) return true; // Lọc theo Tuyến
      return station.routeIds.includes(selectedRoute);
    });
  }, [allStations, selectedRoute]);


  return (
    <div className={styles.pageContainer}>
      {/* Thanh Filters */}
      <Flex className={styles.filterBar} justify="space-between" gap="middle">
        <Select
          placeholder="Lọc theo tuyến"
          options={allRouteOptions}
          loading={loading}
          className={styles.filterSelect}
          onChange={handleRouteChange}
          allowClear
        />
        <Select
          placeholder="Lọc theo trạng thái xe"
          options={[
            { value: null, label: 'Tất cả trạng thái' },
            { value: 'Đang chạy', label: 'Đang chạy' },
            { value: 'Bảo trì', label: 'Bảo trì' },
          ]}
          className={styles.filterSelect}
          onChange={handleStatusChange}
          allowClear
        />
        <Input.Search
          placeholder="Tìm theo biển số xe..."
          className={styles.filterSearch}
          onChange={handleSearchChange}
          allowClear
        />
      </Flex>

      {/* Bản đồ */}
      <div className={styles.mapContainer}>
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={initialViewState}
          style={{ width: '100%', height: '100%' }} 
          mapStyle="mapbox://styles/mapbox/streets-v11"
          attributionControl={false}
          onClick={handlePopupClose} // Đóng Popup khi click ra ngoài
        >
          <NavigationControl position="bottom-right" />
          <FullscreenControl position="top-right" />

          {/* Render Markers đã lọc */}
          {filteredStations.map(station => (
            <StationMarker 
              key={`station-${station.id}`}
              station={station}
              onMarkerClick={(item) => handleMarkerClick(item, 'station')}
            />
          ))}

          {filteredVehicles.map(bus => (
            <BusMarker 
              key={`bus-${bus.id}`}
              bus={bus}
              onMarkerClick={(item) => handleMarkerClick(item, 'bus')}
            />
          ))}
          
          {/* Render Đường vẽ Lộ trình */}
          {routePolyline && (
            <Source type="geojson" data={routePolyline}>
              <Layer {...routeLayerStyle} />
            </Source>
          )}
          
          {/* Render Popup */}
          {popupInfo && (
            <Popup
              latitude={popupInfo.item.lat}
              longitude={popupInfo.item.lon}
              anchor="bottom-left"
              offset={popupInfo.type === 'bus' ? [25, -50] : [10, -30]}
              onClose={handlePopupClose}
              closeOnClick={false}
              closeButton={true}
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