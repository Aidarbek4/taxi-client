// Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.scss';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        email,
        password
      });

      localStorage.setItem('userData', JSON.stringify(response.data));
      navigate('/');
    } catch (err) {
      setError('Invalid credentials or unverified email');
    }
  };

  return (
    <div className={styles.Login}>
      <div className={styles.LoginWrapper}>
        <h1 className={styles.LoginTitle}>Login</h1>
        <form className={styles.LoginForm} onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.LoginInput}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.LoginInput}
          />
          {error && <div className={styles.LoginError}>{error}</div>}
          <button className={styles.LoginButton}>Login</button>
        </form>
        <div className={styles.LoginLinks}>
          <Link to="/reset-password" className={styles.LoginForgot}>Forgot Password?</Link>
          <span className={styles.LoginRegister}>Don't have an account? <Link to="/register">Register</Link></span>
        </div>
      </div>
    </div>
  );
}

export default Login;
