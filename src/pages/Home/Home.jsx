import React, { useState } from 'react';
import Map from '../../components/Map/Map';
import LocationInputs from '../../components/LocationInputs/LocationInputs';
import styles from './Home.module.scss';
import Navbar from '../../components/Navbar/Navbar';

function Home() {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [selecting, setSelecting] = useState(null);

  return (
    <div className={styles.Home}>
      <Map
        start={start}
        end={end}
        setStart={setStart}
        setEnd={setEnd}
        selecting={selecting}
        setSelecting={setSelecting}
      />
      <Navbar />
      <LocationInputs
        start={start}
        setStart={setStart}
        end={end}
        setEnd={setEnd}
        selecting={selecting}
        setSelecting={setSelecting}
      />
    </div>
  );
}

export default Home;
