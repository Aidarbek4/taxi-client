import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
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
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const defaultCenter = [42.8776, 74.5998]; // Бишкек

const Map = ({ from, to }) => {
  const [via, setVia] = useState(null);
  const [routeCoordsList, setRouteCoordsList] = useState([]);

  useEffect(() => {
    if (!from || !to) {
      setRouteCoordsList([]);
      return;
    }

    const coords = [from, via, to].filter(Boolean);

    const fetchRoute = async () => {
      try {
        const url = [
          'https://router.project-osrm.org/route/v1/driving/',
          coords.map(p => `${p[1]},${p[0]}`).join(';'),
          '?overview=full&geometries=geojson&alternatives=true'
        ].join('');

        const res = await fetch(url);
        const json = await res.json();

        if (json.code === 'Ok' && json.routes.length) {
          const routes = json.routes.map(route =>
            route.geometry.coordinates.map(([lng, lat]) => [lat, lng])
          );
          setRouteCoordsList(routes);
        } else {
          setRouteCoordsList([]);
        }
      } catch (err) {
        console.error('OSRM routing error:', err);
        setRouteCoordsList([]);
      }
    };

    fetchRoute();
  }, [from, to, via]);

  return (
    <MapContainer
      className={styles.Map}
      center={from || defaultCenter}
      zoom={15}
      attributionControl={false}
      zoomControl={false}
      whenCreated={(map) => {
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          setVia([lat, lng]);
        });
      }}
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

      {via && (
        <Marker position={via}>
          <Popup>Промежуточная точка</Popup>
        </Marker>
      )}

      {routeCoordsList.map((coords, i) => (
        <Polyline
          key={i}
          positions={coords}
          color={i === 0 ? '#d4ff00' : '#888'}
          weight={i === 0 ? 4 : 3}
          dashArray={i === 0 ? null : '6,6'}
        />
      ))}

      <MapUpdater center={from} />
    </MapContainer>
  );
};

export default Map;
