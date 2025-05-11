import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewPassword.module.scss';

function NewPassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNewPassword = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    // TODO: отправить новый пароль на сервер с email
    const email = localStorage.getItem('resetEmail');
    // await updatePassword(email, password);

    alert('Password changed successfully!');
    localStorage.removeItem('resetEmail');
    navigate('/');
  };

  return (
    <div className={styles.Login}>
      <div className={styles.LoginWrapper}>
        <h1 className={styles.LoginTitle}>Create New Password</h1>
        <form className={styles.LoginForm} onSubmit={handleNewPassword}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.LoginInput}
          />
          {error && <p className={styles.Error}>{error}</p>}
          <button className={styles.LoginButton}>Change Password</button>
        </form>
      </div>
    </div>
  );
}

export default NewPassword;
