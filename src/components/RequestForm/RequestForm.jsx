import React, { useState } from 'react';
import axios from 'axios';
import LocationInputs from '../LocationInputs/LocationInputs';
import styles from './RequestForm.module.scss';

function RequestForm({ start, setStart, end, setEnd, selecting, setSelecting }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [goal, setGoal] = useState('');
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const userId = localStorage.getItem('userId');

      const requestRes = await axios.post('http://localhost:8000/api/requests/create/', {
        date,
        user: userId,
        routes: []
      });
    
      console.log('Request created:', requestRes.data);
      
      const requestId = requestRes.data.id;
      localStorage.setItem('requestId', requestId);

      await axios.post('http://localhost:8000/api/routes/create/', {
        goal,
        departure,
        destination,
        time,
        request: requestId
      });
    
      setMessage('Request and route created successfully!');
    } catch (error) {
      console.error('Request creation error:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        setMessage(`Error: ${JSON.stringify(error.response.data)}`);
      } else {
        setMessage('Failed to create request or route.');
      }
    }
     finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LocationInputs 
        start={start}
        setStart={setStart}
        end={end}
        setEnd={setEnd}
        selecting={selecting}
        setSelecting={setSelecting}
        setDeparture={setDeparture}
        setDestination={setDestination}
        departure={departure}
        destination={destination}
      />
      <form className={styles.RequestForm} onSubmit={handleSubmit}>
        <input 
          className={styles.RequestFormInput}
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Date of the ride"
          required
        />
        <input 
          className={styles.RequestFormInput}
          type="time" 
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Time of the ride"
          required
        />
        <input 
          className={styles.RequestFormInput}
          type="text" 
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Purpose of the ride"
          required
        />
        <button
          className={styles.RequestFormButton}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send request'}
        </button>
      </form>
    </>
  );
}

export default RequestForm;
