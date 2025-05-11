// RegisterVerify.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './RegisterVerify.module.scss';

function RegisterVerify() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('registerEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      navigate('/register');
    }
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/verify/', {
        email,
        code,
      });

      localStorage.removeItem('registerEmail');
      navigate('/login');
    } catch (err) {
      setError('Invalid or expired verification code');
    }
  };

  return (
    <div className={styles.RegisterVerify}>
      <div className={styles.VerifyWrapper}>
        <h1 className={styles.VerifyTitle}>Verify Your Email</h1>
        <form className={styles.VerifyForm} onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.VerifyInput}
          />
          {error && <div className={styles.VerifyError}>{error}</div>}
          <button type="submit" className={styles.VerifyButton}>Verify</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterVerify;
