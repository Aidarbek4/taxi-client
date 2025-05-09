import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
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
          <div className={styles.inputGroup}>
            <label className={styles.label}>Введите цель поездки:</label>
            <TextField
              className={styles.inputField}
              placeholder="Деловая встреча"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              fullWidth
              margin="none"
              variant="outlined"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Дата поездки:</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={formData.date ? dayjs(formData.date) : null}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className={styles.inputField}
                    placeholder="Выберите дату"
                    margin="none"
                    variant="outlined"
                  />
                )}
              />
            </LocalizationProvider>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Место отправки:</label>
            <TextField
              className={styles.inputField}
              placeholder="Откуда?"
              name="departure"
              value={formData.departure}
              onChange={handleChange}
              fullWidth
              margin="none"
              variant="outlined"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Место назначения:</label>
            <TextField
              className={styles.inputField}
              placeholder="Куда?"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              fullWidth
              margin="none"
              variant="outlined"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Время отправки:</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={formData.time ? dayjs(formData.time, 'HH:mm') : null}
                onChange={handleTimeChange}
                views={['hours', 'minutes']}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className={styles.inputField}
                    placeholder="Выберите время"
                    margin="none"
                    variant="outlined"
                  />
                )}
              />
            </LocalizationProvider>
          </div>

          <div className={styles.addRouteButton}>
            <IconButton className={styles.addRoutePlus}>
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