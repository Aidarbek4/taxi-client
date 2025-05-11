import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Map from '../../components/Map/Map';
import LocationInputs from '../../components/LocationInputs/LocationInputs';
import LocationConverter from '../../components/LocationConverter/LocationConverter'; 
import styles from './ClientDashboard.module.scss';
import { IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

function ClientDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [selecting, setSelecting] = useState(null);
  const [convertedLocations, setConvertedLocations] = useState({ start: '', end: '' });
  const [conversionDone, setConversionDone] = useState(false);
  const [confirmedData, setConfirmedData] = useState(null);

  // данные с бэка
  const [status, setStatus] = useState('pending');
  const [driverName, setDriverName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleName, setVehicleName] = useState('');

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
      }, 1000);
      setConversionDone(false); 
    }
  }, [start, end, navigate, convertedLocations, conversionDone]);

  useEffect(() => {
    if (location.state?.confirmedData) {
      const newConfirmedData = location.state.confirmedData;
      setConfirmedData(newConfirmedData);
      console.log('Confirmed Data:', newConfirmedData);

      if (newConfirmedData.routes && newConfirmedData.routes.length > 0) {
        const firstRoute = newConfirmedData.routes[0];
        setStart({ lat: 42.8746, lng: 74.5698 }); // need to replace then with geocoding
        setEnd({ lat: 42.8851, lng: 74.5753 }); // need to replace then with geocoding
        setConvertedLocations({
          start: firstRoute.departure || '',
          end: firstRoute.destination || '',
        });
      }
      // api-simulating call to fetch status and driver/vehicle details
      const fetchRequestStatus = async () => {
        try {
          // const response = await fetch(`/api/request-status/${confirmedData.id}`); 
          // const data = await response.json();
          const data = {
            status: 'approved', 
            driverName: 'Петров Руслем Викторович',
            vehicleNumber: '01KG000',
            vehicleName: 'Kia K7',
          };
          setStatus(data.status);
          setDriverName(data.driverName);
          setVehicleNumber(data.vehicleNumber);
          setVehicleName(data.vehicleName);
        } catch (error) {
          console.error('Error fetching request status:', error);
          setStatus('pending'); 
        }
      };
      fetchRequestStatus();
    }
  }, [location.state]);

  const handleSelectLocation = (type) => {
    setSelecting(type);
  };

  const handleSubmit = () => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    // console.log('Manual navigation with locations:', convertedLocations);
    navigate('/request', { state: { start: start, end: end, date: today, time: null } });
  };

  // по крайней мере перенаправляет обратно на страницу ClientDashboard
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

        {confirmedData && (
          <div className={styles.requestInfoOverlay}>
            <div className={styles.requestInfo}>
              <h3>ВАША ЗАЯВКА {status.toUpperCase()}</h3>
              {status === 'approved' && (
                <>
                  <p>Водитель уже в пути.</p>
                  <p>Водитель: {driverName}</p>
                  <p>Машина: {vehicleName} {vehicleNumber}</p>
                </>
              )}
              <p>Место отправки: {confirmedData.routes[0].departure || 'Не указано'}</p>
              <p>Место назначения: {confirmedData.routes[0].destination || 'Не указано'}</p>
              <button className={styles.optionButton}>Откуда?</button>
              <button className={styles.optionButton}>Куда?</button>
            </div>
          </div>
        )}
      </div>
  
      <LocationConverter start={start} end={end} onConvert={handleLocationConvert} />
    </div>
  );
  
}

export default ClientDashboard;