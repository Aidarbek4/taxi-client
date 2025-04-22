import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Map from '../components/Map/Map';
import LocationInputs from '../components/LocationInputs/LocationInputs';
import styles from './HomePage.module.scss';

const HomePage = () => {
  const [from, setFrom] = useState(null);
  const [to,   setTo]   = useState(null);

  return (
    <div className={styles.Homepage}>
      <Map from={from} to={to} />
      <Navbar />
      <LocationInputs
        onFromSelect={setFrom}
        onToSelect={setTo}
      />
    </div>
  );
};

export default HomePage;
