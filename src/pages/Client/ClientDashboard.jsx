import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from '../../components/Map/Map';
import LocationInputs from '../../components/LocationInputs/LocationInputs';
import LocationConverter from '../../components/LocationConverter/LocationConverter'; 
import styles from './ClientDashboard.module.scss';
import { IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

function ClientDashboard() {
  const navigate = useNavigate();
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [selecting, setSelecting] = useState(null);
  const [convertedLocations, setConvertedLocations] = useState({ start: '', end: '' });
  const [conversionDone, setConversionDone] = useState(false);

  const handleLocationConvert = (locations) => {
    setConvertedLocations(locations);
    setConversionDone(true);
  };

  useEffect(() => {
    console.log('Start object:', start, 'End object:', end);
    if (start && end && conversionDone) {
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      // console.log('Navigating with locations:', convertedLocations);
      setTimeout(() => {
        navigate('/request', { state: { start: convertedLocations.start, end: convertedLocations.end, date: today, time: null } });
      }, 1200);
      setConversionDone(false); 
    }
  }, [start, end, navigate, convertedLocations, conversionDone]);

  const handleSelectLocation = (type) => {
    setSelecting(type);
  };

  const handleSubmit = () => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    // console.log('Manual navigation with locations:', convertedLocations);
    navigate('/request', { state: { start: start, end: end, date: today, time: null } });
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <button className={styles.submitButton} onClick={handleSubmit} >
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
      <LocationConverter start={start} end={end} onConvert={handleLocationConvert} />
    </div>
  );
}

export default ClientDashboard;