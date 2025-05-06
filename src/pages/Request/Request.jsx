import React, { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ruRU } from '@mui/x-date-pickers/locales';
import { ru } from 'date-fns/locale';
import { TextField } from '@mui/material';
import styles from './Request.module.scss';

function Request() {
  const [tripDate, setTripDate] = useState(null);
  const [tripTime, setTripTime] = useState(null);
  const [tripPurpose, setTripPurpose] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tripDate || !tripTime || !tripPurpose) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    setIsSubmitted(true);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
      setTripDate(null);
      setTripTime(null);
      setTripPurpose('');
      setIsSubmitted(false);
    }, 3000);
  };

  if (showSuccessMessage) {
    return (
      <div className={styles.successMessage}>
        <div className={styles.successIcon}>✓</div>
        <h2>ЗАЯВКА ОТПРАВЛЕНА</h2>
        <p>Заявка находится в обработке. Вы будете перенаправлены на главную страницу в течение нескольких секунд.</p>
      </div>
    );
  }

  return (
    <div className={styles.requestPage}>
      <div className={styles.formContainer}>
        <h2>Заявка</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Введите цель поездки:</label>
            <TextField
              fullWidth
              value={tripPurpose}
              onChange={(e) => setTripPurpose(e.target.value)}
              placeholder="Деловая встреча"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Выберите дату поездки:</label>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={ru}
              localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
            >
              <DatePicker
                value={tripDate}
                onChange={setTripDate}
                minDate={new Date()}
                slotProps={{ textField: { className: styles.input } }}
              />
            </LocalizationProvider>
          </div>

          <div className={styles.formGroup}>
            <label>Время отправки:</label>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
              <TimePicker
                value={tripTime}
                onChange={setTripTime}
                slotProps={{ textField: { className: styles.input } }}
              />
            </LocalizationProvider>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitted}
          >
            {isSubmitted ? 'Отправка...' : 'Подать заявку'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Request;
