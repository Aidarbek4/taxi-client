import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import styles from './Map.module.scss';

function MapEffect({ start, end, setStart, setEnd, selecting, setSelecting }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    map.setView([42.8746, 74.5698], 13);
  }, [map]);

  useEffect(() => {
    const handleClick = (e) => {
      const { lat, lng } = e.latlng;
      if (selecting === 'start') {
        setStart({ lat, lng });
        setSelecting(null);
      } else if (selecting === 'end') {
        setEnd({ lat, lng });
        setSelecting(null);
      }
    };

    if (selecting) {
      map.on('click', handleClick);
    }

    return () => {
      map.off('click', handleClick);
    };
  }, [map, selecting, setStart, setEnd, setSelecting]);

  useEffect(() => {
    if (!start || !end) {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      return;
    }

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng),
      ],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: '#007bff', weight: 4 }],
      },
      show: false,
      addWaypoints: false,
      createMarker: () => null,
      draggableWaypoints: false,
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
      }),
    }).addTo(map);

    routingControlRef.current = routingControl;

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [map, start, end]);

  const handleStartDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setStart({ lat, lng });
  };

  const handleEndDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setEnd({ lat, lng });
  };

  return (
    <>
      {start && (
        <Marker
          position={[start.lat, start.lng]}
          draggable={true}
          eventHandlers={{
            dragend: handleStartDragEnd,
          }}
        >
          <Popup>Точка отправления</Popup>
        </Marker>
      )}
      {end && (
        <Marker
          position={[end.lat, end.lng]}
          draggable={true}
          eventHandlers={{
            dragend: handleEndDragEnd,
          }}
        >
          <Popup>Точка назначения</Popup>
        </Marker>
      )}
    </>
  );
}

function Map({ start, end, setStart, setEnd, selecting, setSelecting }) {
  return (
    <MapContainer 
      className={styles.Map} 
      zoom={13} 
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEffect
        start={start}
        end={end}
        setStart={setStart}
        setEnd={setEnd}
        selecting={selecting}
        setSelecting={setSelecting}
      />
    </MapContainer>
  );
}

export default Map;
