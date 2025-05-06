import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NearMeIcon from '@mui/icons-material/NearMe';
import ClearIcon from '@mui/icons-material/Clear';
import { TextField, IconButton } from '@mui/material';
import styles from './LocationInputs.module.scss';

function LocationInputs({ start, setStart, end, setEnd, selecting, setSelecting, onSelectLocation }) {
  const [queries, setQueries] = useState({ start: '', end: '' });
  const [suggestions, setSuggestions] = useState({ start: [], end: [] });
  const [dropdownsOpen, setDropdownsOpen] = useState({ start: false, end: false });
  const [isLoading, setIsLoading] = useState({ start: false, end: false });
  const [error, setError] = useState({ start: null, end: null });

  const wrapperRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownsOpen({ start: false, end: false });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setDropdownsOpen({ start: false, end: false });
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const reverseGeocode = async (lat, lng, type) => {
    try {
      const { data } = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: { lat, lon: lng, format: 'json' },
      });
      if (data?.display_name) {
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

    if (value.trim() === '') {
      if (type === 'start') setStart(null);
      else setEnd(null);
      setSuggestions((s) => ({ ...s, [type]: [] }));
      setDropdownsOpen((d) => ({ ...d, [type]: false }));
    } else {
      fetchSuggestions(type, value);
      setDropdownsOpen((d) => ({ ...d, [type]: true }));
    }
  };

  const handleClear = (type) => {
    setQueries((q) => ({ ...q, [type]: '' }));
    if (type === 'start') setStart(null);
    else setEnd(null);
    setSuggestions((s) => ({ ...s, [type]: [] }));
    setDropdownsOpen((d) => ({ ...d, [type]: false }));
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
    setTimeout(async () => {
      if (queries[type] && suggestions[type].length === 0) {
        await searchAndSetLocation(type, queries[type]);
      }
      setDropdownsOpen((d) => ({ ...d, [type]: false }));
    }, 100);
  };

  const handleSelectButtonClick = (type, e) => {
    e.preventDefault();
    if (onSelectLocation) onSelectLocation(type);
    setSelecting(type);
  };

  return (
    <div className={styles.locationInputs} ref={wrapperRef}>
      <div className={styles.formGroup}>
        {/* <label>Место отправки:</label> */}
        <div className={styles.inputContainer}>
          <TextField
            fullWidth
            placeholder="Откуда?"
            value={queries.start}
            onChange={(e) => handleInputChange(e, 'start')}
            onKeyDown={(e) => handleKeyDown(e, 'start')}
            onBlur={() => handleBlur('start')}
            onFocus={() => {
              if (queries.start) {
                fetchSuggestions('start', queries.start);
                setDropdownsOpen((d) => ({ ...d, start: true }));
              }
            }}
            className={`${styles.input} ${error.start ? styles.error : ''}`}
            InputProps={{
              endAdornment: (
                <>
                  {queries.start && (
                    <IconButton
                      size="small"
                      onClick={() => handleClear('start')}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    className={selecting === 'start' ? styles.active : ''}
                    onClick={(e) => handleSelectButtonClick('start', e)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <LocationOnIcon />
                  </IconButton>
                </>
              ),
            }}
            error={!!error.start}
            helperText={error.start}
          />
        </div>
        {dropdownsOpen.start && suggestions.start.length > 0 && (
          <ul className={styles.suggestions}>
            {suggestions.start.map((s) => (
              <li key={s.place_id} onMouseDown={() => handleSelect(s, 'start')}>
                <LocationOnIcon />
                <span>{s.display_name}</span>
              </li>
            ))}
          </ul>
        )}
        {error.start && <div className={styles.errorMessage}>{error.start}</div>}
      </div>

      <div className={styles.formGroup}>
        {/* <label>Место назначения:</label> */}
        <div className={styles.inputContainer}>
          <TextField
            fullWidth
            placeholder="Куда?"
            value={queries.end}
            onChange={(e) => handleInputChange(e, 'end')}
            onKeyDown={(e) => handleKeyDown(e, 'end')}
            onBlur={() => handleBlur('end')}
            onFocus={() => {
              if (queries.end) {
                fetchSuggestions('end', queries.end);
                setDropdownsOpen((d) => ({ ...d, end: true }));
              }
            }}
            className={`${styles.input} ${error.end ? styles.error : ''}`}
            InputProps={{
              endAdornment: (
                <>
                  {queries.end && (
                    <IconButton
                      size="small"
                      onClick={() => handleClear('end')}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    className={selecting === 'end' ? styles.active : ''}
                    onClick={(e) => handleSelectButtonClick('end', e)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <NearMeIcon />
                  </IconButton>
                </>
              ),
            }}
            error={!!error.end}
            helperText={error.end}
          />
        </div>
        {dropdownsOpen.end && suggestions.end.length > 0 && (
          <ul className={styles.suggestions}>
            {suggestions.end.map((s) => (
              <li key={s.place_id} onMouseDown={() => handleSelect(s, 'end')}>
                <NearMeIcon />
                <span>{s.display_name}</span>
              </li>
            ))}
          </ul>
        )}
        {error.end && <div className={styles.errorMessage}>{error.end}</div>}
      </div>
    </div>
  );
}

export default LocationInputs;