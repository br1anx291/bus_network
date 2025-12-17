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

  const renderRouteData = useCallback((mapInstance, drawInstance, routeData) => {
    if (!mapInstance || !drawInstance) return;

    try {
      drawInstance.deleteAll();

      if (!routeData?.path) return;

      let coordsToDraw = [];
      const rawPath = routeData.path;

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

      const feature = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordsToDraw
        }
      };

      drawInstance.add(feature);

      setTimeout(() => {
        try { drawInstance.changeMode('simple_select'); } catch (e) {}
      }, 50);

      if (window.mapboxgl) {
        const bounds = coordsToDraw.reduce((bounds, coord) => {
          return bounds.extend(coord);
        }, new window.mapboxgl.LngLatBounds(coordsToDraw[0], coordsToDraw[0]));

        mapInstance.fitBounds(bounds, {
          padding: 100,
          duration: 1000
        });
      }
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
      onSave(editingRoute.id, []);
      return;
    }

    const geometry = data.features[0].geometry;
    if (geometry.type !== 'LineString') {
      message.warning("Vui lòng chỉ vẽ 1 đường duy nhất!");
      return;
    }

    onSave(editingRoute.id, geometry.coordinates);
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