import React from 'react'
import LogoImage from '../../assets/Logo.png';
import { Link } from 'react-router-dom';
import styles from './Logo.module.scss';

function Logo() {
  return (
    <Link to="/" className={styles.Logo}>
      <img src={LogoImage} alt="Logo" className={styles.LogoImage} />
    </Link>
  )
}

export default Logo;