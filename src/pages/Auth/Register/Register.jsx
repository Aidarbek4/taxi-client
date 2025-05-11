import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Register.module.scss';

function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        email: email,
        name: name,
        number: phone,
        password: password,
        role: 'user'
      });

      localStorage.setItem('registerEmail', email);
      console.log('Registration successful:', response.data);
      navigate('/register-verify'); // переходим на страницу логина
    } catch (err) {
      console.error('Registration failed:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className={styles.Register}>
      <div className={styles.RegisterWrapper}>
        <h1 className={styles.RegisterTitle}>Register</h1>
        <form className={styles.RegisterForm} onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.RegisterInput}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={styles.RegisterInput}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.RegisterInput}
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.RegisterInput}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.RegisterInput}
          />

          {error && <div className={styles.RegisterError}>{error}</div>}

          <button className={styles.RegisterButton}>Register</button>
        </form>
        <div className={styles.RegisterLogin}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
