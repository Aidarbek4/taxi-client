import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ResetPassword.module.scss';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/forgot-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        localStorage.setItem('resetEmail', email);
        navigate('/new-password');
      } else if (response.status === 404) {
        setError('User not found');
      } else {
        const data = await response.json();
        setError(data?.detail || 'Error while sending the request');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.ResetPassword}>
      <div className={styles.ResetPasswordWrapper}>
        <h1 className={styles.ResetPasswordTitle}>Reset Password</h1>
        <form className={styles.ResetPasswordForm} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.ResetPasswordInput}
          />
          {error && <p className={styles.ResetPasswordError}>{error}</p>}
          <button className={styles.ResetPasswordButton} disabled={loading}>
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
        <div className={styles.ResetPasswordCancel}>
          <Link to="/login">Cancel</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
