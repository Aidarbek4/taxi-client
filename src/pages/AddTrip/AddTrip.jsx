import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LocationInputs from '../../components/LocationInputs/LocationInputs';
import styles from './AddTrip.module.scss';
import { TextField, Button } from '@mui/material';

function AddTrip() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { date, existingTrips } = state || {};
  const [newStart, setNewStart] = useState(null);
  const [newEnd, setNewEnd] = useState(null);
  const [newTime, setNewTime] = useState('');
  const [selecting, setSelecting] = useState(null);

  const handleSelectLocation = (type) => {
    setSelecting(type);
  };

  const handleAddTrip = () => {
    if (!newStart || !newEnd || !newTime) {
      alert('Пожалуйста, выберите места отправки, назначения и время');
      return;
    }
    const updatedTrips = [...existingTrips, { start: newStart, end: newEnd, time: newTime }];
    navigate('/request', {
      state: {
        start: existingTrips[0].start,
        end: existingTrips[0].end,
        date,
        time: existingTrips[0].time,
        additionalTrips: updatedTrips.slice(1),
      },
    });
  };

  return (
    <div className={styles.addTripContainer}>
      <h1 className={styles.title}>Добавить поездку</h1>
      <div className={styles.dateTimeContainer}>
        <TextField
          label="Дата"
          value={date || ''}
          InputProps={{ readOnly: true }}
          InputLabelProps={{ shrink: true }}
          className={styles.dateInput}
        />
        <TextField
          label="Время"
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          className={styles.timeInput}
        />
      </div>
      <LocationInputs
        start={newStart}
        setStart={setNewStart}
        end={newEnd}
        setEnd={setNewEnd}
        selecting={selecting}
        setSelecting={setSelecting}
        onSelectLocation={handleSelectLocation}
      />
      <Button className={styles.confirmButton} onClick={handleAddTrip}>
        Подтвердить
      </Button>
    </div>
  );
}

export default AddTrip;