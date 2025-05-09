import React, { useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from './Confirmation.module.scss';
import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/clientdashboard');
    }, 5300); // 5.3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

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