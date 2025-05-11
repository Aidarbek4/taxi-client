import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ResetPassword.module.scss';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError('Введите почту');
      return;
    }

    // TODO: Здесь должна быть логика отправки кода на email
    // Например, через API: await sendResetCode(email);

    localStorage.setItem('resetEmail', email); // сохраняем email
    navigate('/verify-code');
  };

  return (
    <div className={styles.Login}>
      <div className={styles.LoginWrapper}>
        <h1 className={styles.LoginTitle}>Reset Password</h1>
        <form className={styles.LoginForm} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.LoginInput}
          />
          {error && <p className={styles.Error}>{error}</p>}
          <button className={styles.LoginButton}>Send Code</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
