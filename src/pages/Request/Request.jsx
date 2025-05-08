import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import styles from './Request.module.scss';

const RequestForm = () => {
  const [formData, setFormData] = useState({
    purpose: '',
    date: null,
    departure: '',
    destination: '',
    time: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newDate) => {
    setFormData(prev => ({ ...prev, date: newDate?.toDate() || null }));
  };

  const handleTimeChange = (newTime) => {
    setFormData(prev => ({ ...prev, time: newTime?.format('HH:mm') || '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', formData);
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Заявка</h1>
      </header>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.requestForm}>
          <label className={styles.label}>Цель поездки:</label>
          <TextField
            className={styles.inputField}
            placeholder="Деловая встреча"
            value={formData.purpose}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              style: { borderRadius: '10px' },
            }}
          />

          <label className={styles.label}>Дата поездки:</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Дата"
              value={formData.date ? dayjs(formData.date) : null}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={styles.inputField}
                  InputProps={{
                    endAdornment: (
                      <IconButton>
                        <AccessTimeIcon color="primary" />
                      </IconButton>
                    ),
                  }}
                />
              )}
            />
          </LocalizationProvider>

          <label className={styles.label}>Место отправки:</label>
          <TextField
            className={styles.inputField}
            placeholder="Откуда?"
            value={formData.departure}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              style: { borderRadius: '10px' },
            }}
          />

          <label className={styles.label}>Место назначения:</label>
          <TextField
            className={styles.inputField}
            placeholder="Куда?"
            value={formData.destination}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              style: { borderRadius: '10px' },
            }}
          />

          <label className={styles.label}>Время отправки:</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Время"
              value={formData.time ? dayjs(formData.time, 'HH:mm') : null}
              onChange={handleTimeChange}
              views={['hours', 'minutes']}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={styles.inputField}
                  InputProps={{
                    endAdornment: (
                      <IconButton>
                        <AccessTimeIcon color="primary" />
                      </IconButton>
                    ),
                  }}
                />
              )}
            />
          </LocalizationProvider>

          <div className={styles.addRouteButton}>
            <IconButton>
              <AddIcon fontSize="large" color="primary" />
            </IconButton>
            <p>Нажмите +, чтобы добавить еще один маршрут поездки</p>
          </div>

          <Button
            type="submit"
            className={styles.submitButton}
            variant="contained"
            fullWidth
          >
            Подать заявку
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;