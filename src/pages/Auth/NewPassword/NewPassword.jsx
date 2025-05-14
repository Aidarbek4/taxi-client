import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewPassword.module.scss';

function NewPassword() {
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNewPassword = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!code.trim()) {
      setError('Please enter the verification code');
      return;
    }

    const email = localStorage.getItem('resetEmail');
    if (!email) {
      setError('Email not found. Please try password recovery again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          code,
          new_password: password
        })
      });

      if (response.ok) {
        alert('Password changed successfully!');
        localStorage.removeItem('resetEmail');
        navigate('/');
      } else {
        const data = await response.json();
        setError(data?.detail || 'Failed to change password');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Server unavailable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.NewPassword}>
      <div className={styles.NewPasswordWrapper}>
        <h1 className={styles.NewPasswordTitle}>Create New Password</h1>
        <form className={styles.NewPasswordForm} onSubmit={handleNewPassword}>
          <input
            type="text"
            placeholder="Verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.NewPasswordInput}
          />
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.NewPasswordInput}
          />
          {error && <p className={styles.NewPasswordError}>{error}</p>}
          <button className={styles.NewPasswordButton} disabled={loading}>
            {loading ? 'Submitting...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewPassword;
