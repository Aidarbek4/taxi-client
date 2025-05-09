import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from '../../components/Map/Map';
import LocationInputs from '../../components/LocationInputs/LocationInputs';
import styles from './ClientDashboard.module.scss';
import { IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

function ClientDashboard() {
  const navigate = useNavigate();
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [selecting, setSelecting] = useState(null);
  const [startLabel, setStartLabel] = useState('');
  const [endLabel, setEndLabel] = useState('');

  // Function to fetch street name from coordinates using Nominatim API
  const fetchStreetName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lng=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        return data.display_name; // Full address (e.g., "123 Main St, City, Country")
      } else {
        return `Lat: ${lat}, Lng: ${lng}`; // Fallback to coordinates if geocoding fails
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      return `Lat: ${lat}, Lng: ${lng}`; // Fallback to coordinates on error
    }
  };

  useEffect(() => {
    const updateLabelsAndNavigate = async () => {
      console.log('Start object:', start, 'End object:', end); // Debug raw data
      if (start && end) {
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Fetch street names for start and end
        const newStartLabel = await fetchStreetName(start.lat, start.lng);
        const newEndLabel = await fetchStreetName(end.lat, end.lng);

        setStartLabel(newStartLabel);
        setEndLabel(newEndLabel);

        console.log('Fetched labels:', { startLabel: newStartLabel, endLabel: newEndLabel });

        // Navigate to /request after a delay, passing the street names
        setTimeout(() => {
          navigate('/request', { state: { start: newStartLabel, end: newEndLabel, date: today, time: null } });
        }, 1500);
      }
    };

    updateLabelsAndNavigate();
  }, [start, end, navigate]);

  const handleSelectLocation = (type) => {
    setSelecting(type);
  };

  const handleSubmit = async () => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    if (start && end) {
      const newStartLabel = await fetchStreetName(start.lat, start.lng);
      const newEndLabel = await fetchStreetName(end.lat, end.lng);
      console.log('Submit labels:', { startLabel: newStartLabel, endLabel: newEndLabel });
      navigate('/request', { state: { start: newStartLabel, end: newEndLabel, date: today, time: null } });
    } else {
      alert('Please select both start and end locations.');
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <button className={styles.submitButton} onClick={handleSubmit}>
          ПОДАТЬ ЗАЯВКУ
        </button>
        <IconButton onClick={() => navigate('/profile')} className={styles.profileIcon}>
          <PersonIcon />
        </IconButton>
      </div>
      <div className={styles.formContainer}>
        <LocationInputs
          start={start}
          setStart={setStart}
          end={end}
          setEnd={setEnd}
          selecting={selecting}
          setSelecting={setSelecting}
          onSelectLocation={handleSelectLocation}
        />
      </div>
      <div className={styles.mapContainer}>
        <Map
          start={start}
          end={end}
          setStart={setStart}
          setEnd={setEnd}
          selecting={selecting}
          setSelecting={setSelecting}
        />
      </div>
    </div>
  );
}

export default ClientDashboard;