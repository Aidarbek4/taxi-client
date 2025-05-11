import React from 'react'
import { Link } from 'react-router-dom'
import styles from "./Welcome.module.scss"

function Welcome() {
  return (
    <div className={styles.Welcome}>
      <div className={styles.WelcomeWrapper}>
        <h1 className={styles.WelcomeTitle}>Welcome to Eldik Taxi</h1>
        <p className={styles.WelcomeText}>Please log in or register to continue.</p>
        <div className={styles.Buttons}>
          <Link to="/login" className={styles.LoginButton}>Login</Link>
          <Link to="/register" className={styles.RegisterButton}>Register</Link>
        </div>
      </div>
    </div>
  )
}

export default Welcome