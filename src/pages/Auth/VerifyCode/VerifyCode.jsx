import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './VerifyCode.module.scss';

function VerifyCode() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();

    // В реальном случае код нужно сверить с тем, что отправлен на сервере
    const validCode = '1234'; // Временный код для теста

    if (code === validCode) {
      navigate('/new-password');
    } else {
      setError('Неверный код');
    }
  };

  return (
    <div className={styles.Login}>
      <div className={styles.LoginWrapper}>
        <h1 className={styles.LoginTitle}>Enter Verification Code</h1>
        <form className={styles.LoginForm} onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="4-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={4}
            className={styles.LoginInput}
          />
          {error && <p className={styles.Error}>{error}</p>}
          <button className={styles.LoginButton}>Verify</button>
        </form>
      </div>
    </div>
  );
}

export default VerifyCode;
