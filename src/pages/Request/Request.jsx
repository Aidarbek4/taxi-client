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
    routes: [{ departure: '', destination: '', time: '' }],
  });

  const handleChange = (e, routeIndex = null) => {
    const { name, value } = e.target;
    if (routeIndex !== null) {
      setFormData(prev => ({
        ...prev,
        routes: prev.routes.map((route, index) =>
          index === routeIndex ? { ...route, [name]: value } : route
        ),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (newDate) => {
    setFormData(prev => ({ ...prev, date: newDate?.toDate() || null }));
  };

  const handleTimeChange = (newTime, routeIndex) => {
    setFormData(prev => ({
      ...prev,
      routes: prev.routes.map((route, index) =>
        index === routeIndex
          ? { ...route, time: newTime?.format('HH:mm') || '' }
          : route
      ),
    }));
  };

  const handleAddRoute = () => {
    setFormData(prev => ({
      ...prev,
      routes: [...prev.routes, { departure: '', destination: '', time: '' }],
    }));
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

          {formData.routes.map((route, index) => (
            <div key={index} className={styles.routeGroup}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Место отправки:</label>
                <TextField
                  className={styles.inputField}
                  placeholder="Откуда?"
                  name="departure"
                  value={route.departure}
                  onChange={(e) => handleChange(e, index)}
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
                  value={route.destination}
                  onChange={(e) => handleChange(e, index)}
                  fullWidth
                  margin="none"
                  variant="outlined"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Время отправки:</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    value={route.time ? dayjs(route.time, 'HH:mm') : null}
                    onChange={(newTime) => handleTimeChange(newTime, index)}
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
            </div>
          ))}

          <div className={styles.addRouteButton}>
            <IconButton className={styles.addRoutePlus} onClick={handleAddRoute}>
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