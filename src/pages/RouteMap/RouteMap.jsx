import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import './RouteMap.scss'; // Подключение стилей

const RouteMap = () => {
  const [map, setMap] = useState(null);
  const [routingControl, setRoutingControl] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [routeDetails, setRouteDetails] = useState(null); // Данные маршрута (дистанция, время)
  const [routePoints, setRoutePoints] = useState(null); // Координаты точек
  const [isOriginManual, setIsOriginManual] = useState(true); // Track if the origin is manual or map click
  const [isDestinationManual, setIsDestinationManual] = useState(true); // Track if the destination is manual or map click

  useEffect(() => {
    const mapInstance = L.map('map').setView([42.8746, 74.5698], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstance);
    setMap(mapInstance);

    // Enable map click events to set origin or destination
    mapInstance.on('click', async (e) => {
      if (!isOriginManual) {
        const address = await reverseGeocode(e.latlng);
        setOrigin(address);
        setIsOriginManual(true); // Switch back to manual after selecting the point
      } else if (!isDestinationManual) {
        const address = await reverseGeocode(e.latlng);
        setDestination(address);
        setIsDestinationManual(true); // Switch back to manual after selecting the point
      }
    });

    return () => {
      mapInstance.remove();
    };
  }, [isOriginManual, isDestinationManual]);

  // Reverse geocode function to convert latlng to address
  const reverseGeocode = async (latlng) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&addressdetails=1`
    );
    const data = await response.json();
    if (data && data.address) {
      // Format the address based on available components
      const { road, city, country } = data.address;
      return `${road}, ${city}, ${country}`;
    }
    return '';
  };

  const fetchSuggestions = async (query, setter) => {
    if (query.length < 2) {
      setter([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ', Bishkek'
        )}&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setter(data.map((item) => item.display_name));
      } else {
        setter([]);
      }
    } catch (error) {
      console.error('Ошибка при получении подсказок:', error);
      setter([]);
    }
  };

  const drawRoute = async () => {
    if (routingControl) {
      map.removeControl(routingControl);
    }

    const geocodeAddress = async (address) => {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
      throw new Error(`Не удалось найти координаты для адреса "${address}".`);
    };

    try {
      const originCoords = await geocodeAddress(origin);
      const destinationCoords = await geocodeAddress(destination);

      const newRoutingControl = L.Routing.control({
        waypoints: [
          L.latLng(originCoords.lat, originCoords.lng),
          L.latLng(destinationCoords.lat, destinationCoords.lng),
        ],
        routeWhileDragging: true,
        show: false,
        createMarker: () => null,
      });

      newRoutingControl.on('routesfound', (e) => {
        const route = e.routes[0];
        setRouteDetails({
          distance: (route.summary.totalDistance / 1000).toFixed(2),
          time: (route.summary.totalTime / 60).toFixed(2),
        });

        // Сохраняем координаты точек
        setRoutePoints({
          origin: originCoords,
          destination: destinationCoords,
        });
      });

      newRoutingControl.addTo(map);
      setRoutingControl(newRoutingControl);
    } catch (error) {
      alert('Не удалось построить маршрут. Проверьте адреса.');
    }
  };

  const StyledDropdown = ({ suggestions, onSelect }) => (
    <ul className="styled-dropdown">
      {suggestions.map((suggestion, index) => (
        <li key={index} onClick={() => onSelect(suggestion)}>
          {suggestion}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="route-info">
      <h1>Построение маршрута с подсказками</h1>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginRight: '10px' }}>
          <input
            type="text"
            placeholder="Адрес отправления"
            value={origin}
            onChange={(e) => {
              setOrigin(e.target.value);
              fetchSuggestions(e.target.value, setOriginSuggestions);
              setIsOriginManual(true);
            }}
            className="input-field"
          />
          {originSuggestions.length > 0 && (
            <StyledDropdown
              suggestions={originSuggestions}
              onSelect={(suggestion) => {
                setOrigin(suggestion);
                setOriginSuggestions([]);
              }}
            />
          )}
          <button onClick={() => setIsOriginManual(false)} className="map-button">
            Выбрать на карте
          </button>
        </div>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <input
            type="text"
            placeholder="Адрес назначения"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              fetchSuggestions(e.target.value, setDestinationSuggestions);
              setIsDestinationManual(true);
            }}
            className="input-field"
          />
          {destinationSuggestions.length > 0 && (
            <StyledDropdown
              suggestions={destinationSuggestions}
              onSelect={(suggestion) => {
                setDestination(suggestion);
                setDestinationSuggestions([]);
              }}
            />
          )}
          <button onClick={() => setIsDestinationManual(false)} className="map-button">
            Выбрать на карте
          </button>
        </div>
        <button onClick={drawRoute} className="route-button">
          Построить маршрут
        </button>
      </div>
      <div id="map"></div>
    </div>
  );
};

export default RouteMap;