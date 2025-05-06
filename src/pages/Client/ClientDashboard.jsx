import React, { useState } from 'react';
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

  const handleSelectLocation = (type) => {
    setSelecting(type);
  };

  const handleSubmit = () => {
    if (!start || !end) {
      alert('Пожалуйста, выберите места отправки и назначения');
      return;
    }
    navigate('/request', { state: { start, end } });
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