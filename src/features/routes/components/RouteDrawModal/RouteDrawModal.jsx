import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Modal, Button, message, Alert } from 'antd';
import Map, { NavigationControl } from 'react-map-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const RouteDrawModal = ({ open, onClose, onSave, editingRoute }) => {
  const [viewState, setViewState] = useState({
    longitude: 108.2208, 
    latitude: 16.0471,
    zoom: 12
  });

  const mapRef = useRef(null);
  const drawRef = useRef(null);

  useEffect(() => {
    import('mapbox-gl').then(mod => {
      window.mapboxgl = mod.default;
    });
  }, []);

  const ensureLngLat = (coord) => {

    if (coord[0] < coord[1]) {
        return [coord[1], coord[0]]; 
    }
    return coord;
  };

  const renderRouteData = useCallback((mapInstance, drawInstance, routeData) => {
      if (!mapInstance || !drawInstance) return;

      try {
        drawInstance.deleteAll();
        if (!routeData?.path) return;

        let coordsToDraw = [];
        const rawPath = routeData.path;

        // 1. Parse JSON
        if (Array.isArray(rawPath)) {
          coordsToDraw = rawPath;
        } else if (typeof rawPath === 'string') {
          try {
            coordsToDraw = JSON.parse(rawPath);
          } catch (e) {
            console.error("Lỗi parse JSON:", e);
            return;
          }
        }

        if (coordsToDraw.length === 0) return;

        const isMultiLine = Array.isArray(coordsToDraw[0]) && Array.isArray(coordsToDraw[0][0]);

        if (isMultiLine) {

          coordsToDraw.forEach(segment => {
              const fixedSegment = segment.map(point => ensureLngLat(point));

              drawInstance.add({
                  type: 'Feature',
                  properties: {},
                  geometry: {
                      type: 'LineString',
                      coordinates: fixedSegment
                  }
              });
          });
          
          if (window.mapboxgl) {
              const allPoints = coordsToDraw.flat().map(p => ensureLngLat(p)); 
              const bounds = allPoints.reduce((bounds, coord) => {
                  return bounds.extend(coord);
              }, new window.mapboxgl.LngLatBounds(allPoints[0], allPoints[0]));

              mapInstance.fitBounds(bounds, { padding: 100, duration: 1000 });
          }

        } else {
          const fixedCoords = coordsToDraw.map(point => ensureLngLat(point));

          drawInstance.add({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: fixedCoords
            }
          });
          
          if (window.mapboxgl) {
              const bounds = fixedCoords.reduce((bounds, coord) => {
                return bounds.extend(coord);
              }, new window.mapboxgl.LngLatBounds(fixedCoords[0], fixedCoords[0]));
              mapInstance.fitBounds(bounds, { padding: 100, duration: 1000 });
          }
        }
        
        setTimeout(() => {
          try { drawInstance.changeMode('simple_select'); } catch (e) {}
        }, 50);

      } catch (error) {
        console.error("Lỗi khi render route:", error);
      }
  }, []);

  const handleMapLoad = (evt) => {
    const map = evt.target;
    mapRef.current = map;

    if (!drawRef.current) {
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          line_string: true,
          trash: true,
        },
        defaultMode: 'draw_line_string',
      });

      map.addControl(draw, 'top-left');
      drawRef.current = draw;
    }

    renderRouteData(map, drawRef.current, editingRoute);
  };

  useEffect(() => {
    if (open && mapRef.current && drawRef.current) {
      renderRouteData(mapRef.current, drawRef.current, editingRoute);
    }
  }, [editingRoute, open, renderRouteData]); 

const handleSave = () => {
    if (!drawRef.current) {
      message.error("Bản đồ chưa sẵn sàng!");
      return;
    }

    const data = drawRef.current.getAll();
    
    if (data.features.length === 0) {
      // Gửi mảng rỗng nếu xóa hết
      onSave(editingRoute.id, []); 
      return;
    }

    const allPaths = [];
    
    data.features.forEach(feature => {
        if (feature.geometry.type === 'LineString') {
            allPaths.push(feature.geometry.coordinates);
        }
    });

    onSave(editingRoute.id, allPaths);
};

  return (
    <Modal
      title={`Vẽ lộ trình: ${editingRoute?.name || '...'}`}
      open={open}
      onCancel={onClose}
      width={1000}
      style={{ top: 20 }}
      footer={[
        <Button key="back" onClick={onClose}>Hủy</Button>,
        <Button key="submit" type="primary" onClick={handleSave}>
          Lưu lộ trình
        </Button>,
      ]}
      destroyOnClose 
    >
      <Alert 
        message="Hướng dẫn" 
        description="Click chuột trái để vẽ. Click đúp để kết thúc. Click vào đường đã vẽ để chỉnh sửa."
        type="info" 
        showIcon 
        style={{ marginBottom: 10 }}
      />
      
      <div style={{ height: '60vh', width: '100%', border: '1px solid #ccc', position: 'relative' }}>
        {open && (
           <Map
             mapboxAccessToken={MAPBOX_TOKEN}
             initialViewState={viewState}
             mapStyle="mapbox://styles/mapbox/streets-v12"
             onLoad={handleMapLoad}
             reuseMaps
           >
             <NavigationControl position="bottom-right" />
           </Map>
        )}
      </div>
    </Modal>
  );
};

export default RouteDrawModal;