// src/components/Map/Map.jsx
import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './Map.module.scss';

// Настройка стандартных иконок
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Хук для программной центровки карты
const MapUpdater = ({ center }) => {
  const map = useMap();
  if (center) map.setView(center, map.getZoom());
  return null;
};

const defaultCenter = [42.8776, 74.5998]; // Бишкек

const Map = ({ from, to }) => {
  const [routeCoords, setRouteCoords] = useState([]);  

  useEffect(() => {
    // Если обе точки заданы — запрашиваем маршрут
    if (!from || !to) {
      setRouteCoords([]);
      return;
    }

    const fetchRoute = async () => {
      try {
        const url = [
          'https://router.project-osrm.org/route/v1/driving/',
          `${from[1]},${from[0]};${to[1]},${to[0]}`,
          '?overview=full&geometries=geojson'
        ].join('');

        const res = await fetch(url);
        const json = await res.json();
        if (json.code === 'Ok' && json.routes.length) {
          // OSRM отдаёт [lng, lat], а leaflet ждёт [lat, lng]
          const coords = json.routes[0].geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          );
          setRouteCoords(coords);
        }
      } catch (err) {
        console.error('OSRM routing error:', err);
      }
    };

    fetchRoute();
  }, [from, to]);

  return (
    <MapContainer
      className={styles.Map}
      center={from || defaultCenter}
      zoom={15}
      attributionControl={false}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {from && (
        <Marker position={from}>
          <Popup>Откуда</Popup>
        </Marker>
      )}

      {to && (
        <Marker position={to}>
          <Popup>Куда</Popup>
        </Marker>
      )}

      {routeCoords.length > 0 && (
        <Polyline
          positions={routeCoords}
          color="#FF5500"
          weight={4}
          dashArray={null}
        />
      )}

      <MapUpdater center={from} />
    </MapContainer>
  );
};

export default Map;
