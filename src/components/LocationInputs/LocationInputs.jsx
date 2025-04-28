import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NearMeIcon from '@mui/icons-material/NearMe';
import styles from './LocationInputs.module.scss';

function LocationInputs({ start, setStart, end, setEnd, selecting, setSelecting }) {
  const [queries, setQueries] = useState({ start: '', end: '' });
  const [suggestions, setSuggestions] = useState({ start: [], end: [] });
  const [dropdownsOpen, setDropdownsOpen] = useState({ start: false, end: false });

  useEffect(() => {
    if (start?.lat && start?.lng) {
      reverseGeocode(start.lat, start.lng, 'start');
    }
  }, [start]);

  useEffect(() => {
    if (end?.lat && end?.lng) {
      reverseGeocode(end.lat, end.lng, 'end');
    }
  }, [end]);

  const reverseGeocode = async (lat, lng, type) => {
    try {
      const { data } = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat,
          lon: lng,
          format: 'json',
        },
      });
      if (data && data.display_name) {
        setQueries((q) => ({ ...q, [type]: data.display_name }));
      } else {
        setQueries((q) => ({ ...q, [type]: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
      }
    } catch (error) {
      console.error('Ошибка при обратном геокодировании:', error);
      setQueries((q) => ({ ...q, [type]: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
    }
  };

  const fetchSuggestions = async (type, query) => {
    if (!query) {
      setSuggestions((s) => ({ ...s, [type]: [] }));
      return;
    }
    try {
      const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: query, format: 'json', addressdetails: 1, limit: 5 },
      });
      setSuggestions((s) => ({ ...s, [type]: data }));
    } catch (err) {
      console.error('Ошибка при получении подсказок:', err);
    }
  };

  const parseCoordinates = (input) => {
    const regex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
    const match = input.match(regex);
    return match ? { lat: parseFloat(match[1]), lng: parseFloat(match[3]) } : null;
  };

  const searchAndSetLocation = async (type, query) => {
    const setter = type === 'start' ? setStart : setEnd;
    const querySetter = (value) => setQueries((q) => ({ ...q, [type]: value }));

    const coords = parseCoordinates(query);
    if (coords) {
      setter(coords);
      return;
    }

    try {
      const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: query, format: 'json', limit: 1 },
      });
      if (data.length > 0) {
        const place = data[0];
        setter({ lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
        querySetter(place.display_name);
      }
    } catch (err) {
      console.error('Ошибка при поиске местоположения:', err);
    }
  };

  const handleInputChange = (e, type) => {
    const value = e.target.value;
    setQueries((q) => ({ ...q, [type]: value }));
    setDropdownsOpen((d) => ({ ...d, [type]: true }));
    fetchSuggestions(type, value);
  };

  const handleSelect = (suggestion, type) => {
    const setter = type === 'start' ? setStart : setEnd;
    setter({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
    setQueries((q) => ({ ...q, [type]: suggestion.display_name }));
    setSuggestions((s) => ({ ...s, [type]: [] }));
    setDropdownsOpen((d) => ({ ...d, [type]: false }));
  };

  const handleKeyDown = async (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await searchAndSetLocation(type, queries[type]);
      setDropdownsOpen((d) => ({ ...d, [type]: false }));
    }
  };

  const handleBlur = async (type) => {
    if (queries[type] && suggestions[type].length === 0) {
      await searchAndSetLocation(type, queries[type]);
      setDropdownsOpen((d) => ({ ...d, [type]: false }));
    }
  };

  const handleSelectButtonClick = (type, e) => {
    e.preventDefault();
    setSelecting(type);
  };

  return (
    <div className={styles.Inputs}>
      {['start', 'end'].map((type) => (
        <div key={type} className={styles.InputGroup}>
          <div className={styles.InputWrapper}>
            <input
              type="text"
              placeholder={type === 'start' ? 'Откуда' : 'Куда'}
              value={queries[type]}
              onChange={(e) => handleInputChange(e, type)}
              onKeyDown={(e) => handleKeyDown(e, type)}
              onBlur={() => handleBlur(type)}
              onFocus={() => setDropdownsOpen((d) => ({ ...d, [type]: true }))}
            />
            {dropdownsOpen[type] && suggestions[type].length > 0 && (
              <ul className={styles.Suggestions}>
                {suggestions[type].map((s) => (
                  <li key={s.place_id} onMouseDown={() => handleSelect(s, type)}>
                    {s.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={(e) => handleSelectButtonClick(type, e)}
            onMouseDown={(e) => e.preventDefault()}
            className={selecting === type ? styles.ActiveButton : ''}
          >
            {type === 'start' ? (
              <LocationOnIcon fontSize="small" />
            ) : (
              <NearMeIcon fontSize="small" />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}

export default LocationInputs;
