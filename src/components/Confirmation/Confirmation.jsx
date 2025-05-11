import React, { useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from './Confirmation.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const confirmedData = location.state?.confirmedData || {
    purpose: 'Поездка в университет',
    date: new Date().toISOString().split('T')[0],
    routes: [
      { departure: 'Пункт А', destination: 'Пункт Б', time: '10:00' },
    ],
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/client', { state: { confirmedData } });
    }, 5300);

    return () => clearTimeout(timer);
  }, [navigate, confirmedData]);

  return (
    <div className={styles.container}>
      <Typography variant="h3" className={styles.title}>
        Заявка отправлена
      </Typography>

      <Box className={styles.iconContainer}>
        <CheckCircleIcon className={styles.checkIcon} />
      </Box>

      <Typography variant="body1" className={styles.message}>
        Заявка находится в обработке. Вы будете перенаправлены на главную страницу в течение нескольких секунд.
      </Typography>
    </div>
  );
};

export default Confirmation;