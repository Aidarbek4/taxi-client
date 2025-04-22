// src/components/LocationInputs.jsx
import React, { useState, useEffect } from 'react';
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
import NearMeRoundedIcon     from '@mui/icons-material/NearMeRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import styles from './LocationInputs.module.scss';

const NominatimURL = 'https://nominatim.openstreetmap.org/search?format=json&q=';

const LocationInputs = ({ onFromSelect, onToSelect }) => {
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery,   setToQuery] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions,   setToSuggestions] = useState([]);

  // Debounced fetch
  useEffect(() => {
    if (!fromQuery) return setFromSuggestions([]);
    const id = setTimeout(async () => {
      const res  = await fetch(NominatimURL + encodeURIComponent(fromQuery));
      const json = await res.json();
      setFromSuggestions(json);
    }, 300);
    return () => clearTimeout(id);
  }, [fromQuery]);

  useEffect(() => {
    if (!toQuery) return setToSuggestions([]);
    const id = setTimeout(async () => {
      const res  = await fetch(NominatimURL + encodeURIComponent(toQuery));
      const json = await res.json();
      setToSuggestions(json);
    }, 300);
    return () => clearTimeout(id);
  }, [toQuery]);

  const handleSelect = (place, type) => {
    const lat = parseFloat(place.lat).toFixed(6);
    const lon = parseFloat(place.lon).toFixed(6);
    const coords = [ +lat, +lon ];

    // Вбиваем именно координаты в поле
    if (type === 'from') {
      setFromQuery(`${lat}, ${lon}`);
      setFromSuggestions([]);
      onFromSelect(coords);
    } else {
      setToQuery(`${lat}, ${lon}`);
      setToSuggestions([]);
      onToSelect(coords);
    }
  };

  return (
    <div className={styles.LocationInputs}>
      <div className={styles.LocationInputsWrapper}>
        {/* — Откуда — */}
        <div className={styles.LocationInputs__Input}>
          <label htmlFor="departure" className={styles.LocationInputs__Input__Icon__Wrapper}>
            <LocationOnRoundedIcon className={styles.LocationInputs__Input__Icon} />
          </label>
          <input
            id="departure"
            type="text"
            placeholder="Откуда"
            value={fromQuery}
            onChange={e => setFromQuery(e.target.value)}
            className={styles.LocationInputs__Input__Field}
          />
        </div>
        {fromSuggestions.length > 0 && (
          <ul className={styles.suggestions}>
            {fromSuggestions.map((place, i) => (
              <li key={i} onClick={() => handleSelect(place, 'from')}>
                {place.display_name}
              </li>
            ))}
          </ul>
        )}

        {/* — Куда — */}
        <div className={styles.LocationInputs__Input}>
          <label htmlFor="destination" className={styles.LocationInputs__Input__Icon__Wrapper}>
            <NearMeRoundedIcon className={styles.LocationInputs__Input__Icon} />
          </label>
          <input
            id="destination"
            type="text"
            placeholder="Куда"
            value={toQuery}
            onChange={e => setToQuery(e.target.value)}
            className={styles.LocationInputs__Input__Field}
          />
        </div>
        {toSuggestions.length > 0 && (
          <ul className={styles.suggestions}>
            {toSuggestions.map((place, i) => (
              <li key={i} onClick={() => handleSelect(place, 'to')}>
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LocationInputs;
