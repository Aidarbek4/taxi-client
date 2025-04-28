import React, { useState, useRef } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Map from '../../components/Map/Map';
import LocationInputs from '../../components/LocationInputs/LocationInputs';
import styles from './HomePage.module.scss';

const reverseGeocode = async ([lat, lon]) => {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
  const data = await res.json();
  return data.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
};

const HomePage = () => {
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState('');
  const mapRef = useRef();

  const handleFromSelect = async (coords) => {
    setFromCoords(coords);
    const text = await reverseGeocode(coords);
    setFromText(text);
  };

  const handleToSelect = async (coords) => {
    setToCoords(coords);
    const text = await reverseGeocode(coords);
    setToText(text);
  };

  return (
    <div className={styles.HomePage}>
      <Map
        ref={mapRef}
        from={fromCoords}
        to={toCoords}
        onFromSelect={handleFromSelect}
        onToSelect={handleToSelect}
      />
      <Navbar />
      <LocationInputs
        fromText={fromText}
        toText={toText}
        setFromText={setFromText}
        setToText={setToText}
        onFromSelect={handleFromSelect}
        onToSelect={handleToSelect}
        onFromByClick={(v) => mapRef.current?.setSelectingFrom?.(v)}
        onToByClick={(v) => mapRef.current?.setSelectingTo?.(v)}
      />
    </div>
  );
};

export default HomePage;