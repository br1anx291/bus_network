import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Flex, Select, Input, message, Tag } from 'antd';
import Map, { Marker, Popup, NavigationControl, FullscreenControl, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; 
import { stationService } from '~/services/stationService';
import { routeService } from '~/services/routeService';
import { mapService } from '~/services/mapService'; 
import styles from './MapPage.module.css';
import stationIcon from '~/assets/station-pin-blue.png';
import busIcon from '~/assets/bus-marker.png';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const ensureLngLat = (coord) => {
  if (!Array.isArray(coord) || coord.length < 2) return coord;
  if (coord[0] < coord[1]) {
      return [coord[1], coord[0]]; 
  }
  return coord;
};

const isValidCoordinate = (lat, lng) => {
  const validLat = Number.isFinite(lat) && lat >= -90 && lat <= 90;
  const validlng = Number.isFinite(lng) && lng >= -180 && lng <= 180;
  return validLat && validlng;
};

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
      <div style={{ background: 'white', padding: '0 4px', borderRadius: 4, fontSize: 10, textAlign: 'center', border: '1px solid #ccc', marginTop: -5 }}>
        {bus.plate}
      </div>
    </div>
  </Marker>
);

const renderPopupInfo = (item, type) => {
  if (type === 'station') {
    return (
      <div style={{ width: '220px', padding: '4px' }}>
        <div style={{ 
          borderBottom: '1px solid #f0f0f0', 
          paddingBottom: '8px', 
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ width: 24, height: 24, background: '#e6f7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1890ff', fontWeight: 'bold', fontSize: '10px' }}>T</div>
          <h4 style={{ margin: 0, color: '#1890ff', fontSize: '14px', flex: 1 }}>{item.name}</h4>
        </div>
        
        <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
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

  if (type === 'bus') {
    return (
      <div style={{ width: '240px', padding: '4px' }}>
        <div style={{ 
          borderBottom: '1px solid #f0f0f0', 
          paddingBottom: '8px', 
          marginBottom: '8px',
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h4 style={{ margin: 0, color: '#1890ff', fontSize: '15px', fontWeight: 'bold' }}>
            Xe {item.plate || item.licensePlate} 
          </h4>
        </div>

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

const MapPage = () => {

  const [stations, setStations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [busLocations, setBusLocations] = useState([]); 
  
  const [popupInfo, setPopupInfo] = useState(null);
  const [routePolyline, setRoutePolyline] = useState(null);
  const [initialViewState] = useState({ longitude: 108.2208, latitude: 16.0471, zoom: 12 });

  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchPlate, setSearchPlate] = useState('');
  const [routeStationIds, setRouteStationIds] = useState([]);

  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        const [stationRes, routeRes] = await Promise.all([
          stationService.getAll(1, 1000),
          routeService.getAll(1, 1000)
        ]);
        setStations(stationRes.data || []);
        setRoutes(routeRes.data || []);
      } catch (error) {
        message.error("Lỗi tải dữ liệu nền");
      }
    };
    fetchBaseData();
  }, []);

  
  const fetchBusLocations = useCallback(async (currentRouteId) => {
    try {
      const locations = await mapService.getBusLocations(currentRouteId);
      
      const mappedLocations = locations.map(rec => {
        const busInfo = rec.expand?.buses || {};
        const driverInfo = busInfo.expand?.driver || {};      
        const routeInfo = busInfo.expand?.current_route || {}; 

        return {
           ...rec,
           locationId: rec.id,
           plate: rec.plate || busInfo.license_plate || 'Unknown',
           driver: rec.driver || driverInfo.name || driverInfo.fullName || '---',
           route: rec.route || routeInfo.name || routeInfo.route_name || '---',
           status: rec.status || busInfo.status || 'unknown',
           updatedAt: rec.updatedAt || rec.updated || rec.created
        };
      });

      setBusLocations(mappedLocations);
    } catch (error) { console.error("Lỗi fetch bus:", error); }
  }, []);

  useEffect(() => {
    fetchBusLocations(selectedRouteId);

    const interval = setInterval(() => {
      fetchBusLocations(selectedRouteId);
    }, 10000); // 10 giây update 1 lần

    return () => clearInterval(interval);
  }, [selectedRouteId, fetchBusLocations]);

  const handleRouteChange = async (routeId) => {
    console.log("MapPage - User chọn tuyến ID:", routeId);
    setSelectedRouteId(routeId); 
    
    if (!routeId) {
      setRoutePolyline(null);
      setRouteStationIds([]);
    } else {
      const selectedRoute = routes.find(r => r.id === routeId);
      
      if (selectedRoute?.path && selectedRoute.path.length > 0) {
        let rawPath = selectedRoute.path;
        if (typeof rawPath === 'string') {
            try { rawPath = JSON.parse(rawPath); } catch(e) {}
        }

        const isMultiLine = Array.isArray(rawPath[0]) && Array.isArray(rawPath[0][0]);
        let correctedCoordinates;
        let geometryType;

        if (isMultiLine) {
            geometryType = 'MultiLineString';
            correctedCoordinates = rawPath.map(segment => 
                segment.map(point => ensureLngLat(point))
            );
        } else {
            geometryType = 'LineString';
            correctedCoordinates = rawPath.map(point => ensureLngLat(point));
        }

        setRoutePolyline({
          type: 'Feature',
          geometry: { 
              type: geometryType, 
              coordinates: correctedCoordinates 
          }
        });
      } else {
        setRoutePolyline(null);
        message.info("Tuyến này chưa có dữ liệu bản đồ");
      }

      try {
          const stationIds = await routeService.getStationsByRoute(routeId);
          setRouteStationIds(stationIds);
      } catch (error) {
          console.error(error);
      }
    }
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const handleSearchChange = (e) => {
    setSearchPlate(e.target.value.toLowerCase());
  };

  const filteredBuses = useMemo(() => {
    return busLocations.filter(bus => {
      if (!bus.lat || !bus.lng && (!bus.lat && !bus.lng)) return false; 
      
      if (selectedStatus && bus.status !== selectedStatus) return false;
      
      if (searchPlate && !bus.plate.toLowerCase().includes(searchPlate)) return false;
      
      return true;
    });
  }, [busLocations, selectedStatus, searchPlate]);

  const filteredStations = useMemo(() => {
    if (!selectedRouteId) return stations;
    return stations.filter(st => routeStationIds.includes(st.id));
  }, [stations, selectedRouteId, routeStationIds]);

  return (
    <div className={styles.pageContainer}>
      <Flex className={styles.filterBar} gap="middle" wrap="wrap">

        <Select
          style={{ width: 220 }}
          placeholder="Chọn tuyến lộ trình"
          allowClear
          onChange={handleRouteChange}
          options={routes.map(r => ({ value: r.id, label: `${r.code} - ${r.name}` }))}
        />

        <Select
          placeholder="Trạng thái xe"
          style={{ width: 150 }}
          allowClear
          onChange={handleStatusChange}
          options={[
            { value: 'active', label: 'Đang chạy' }, 
            { value: 'maintenance', label: 'Bảo trì' },
            { value: 'stopped', label: 'Dừng hoạt động' },
          ]}
        />

        <Input.Search
          placeholder="Tìm biển số xe..."
          allowClear
          onChange={handleSearchChange}
          style={{ maxWidth: 250 }}
        />

        <Tag color="blue" style={{ display: 'flex', alignItems: 'center' }}>Live: 10s</Tag>
      </Flex>

      <div className={styles.mapContainer}>
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={initialViewState}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
        >
          <NavigationControl position="bottom-right" />
          <FullscreenControl position="top-right" />

          {routePolyline && (
            <Source type="geojson" data={routePolyline}>
              <Layer {...routeLayerStyle} />
            </Source>
          )}

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