import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './TripInfo.module.scss';

function TripInfo() {
  const [request, setRequest] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequest = async () => {
      const requestId = localStorage.getItem('requestId'); // убедись, что он туда сохраняется

      if (!requestId) {
        setError('Request ID not found in localStorage');
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8000/api/requests/${requestId}/`);
        setRequest(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch request data');
      }
    };

    fetchRequest();
  }, []);

  if (error) {
    return <div className={styles.TripInfo}>{error}</div>;
  }

  if (!request) {
    return <div className={styles.TripInfo}>Loading...</div>;
  }

  return (
    <div className={styles.TripInfo}>
      <h2 className={styles.TripInfoTitle}>Trip Information</h2>
      {request.routes.map((route, index) => (
        <div key={index} className={styles.TripInfoContainer}>
          <div className={styles.TripInfoItem}>
            <span className={styles.TripInfoItemLabel}>Departure:</span>
            <span className={styles.TripInfoItemValue}>{route.departure}</span>
          </div>
          <div className={styles.TripInfoItem}>
            <span className={styles.TripInfoItemLabel}>Destination:</span>
            <span className={styles.TripInfoItemValue}>{route.destination}</span>
          </div>
          <div className={styles.TripInfoItem}>
            <span className={styles.TripInfoItemLabel}>Date:</span>
            <span className={styles.TripInfoItemValue}>{request.date}</span>
          </div>
          <div className={styles.TripInfoItem}>
            <span className={styles.TripInfoItemLabel}>Time:</span>
            <span className={styles.TripInfoItemValue}>{route.time}</span>
          </div>
          <div className={styles.TripInfoItem}>
            <span className={styles.TripInfoItemLabel}>Goal:</span>
            <span className={styles.TripInfoItemValue}>{route.goal}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TripInfo;
