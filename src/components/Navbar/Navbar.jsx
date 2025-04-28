import React from 'react'
import Logo from '../Logo/Logo'
import styles from './Navbar.module.scss'

function Navbar() {
  return (
    <nav className={styles.Navbar}>
      <ul className={styles.NavbarList}>
        <li className={styles.NavbarItem}>
          <Logo />
        </li>
      </ul>
    </nav>
  )
}

export default Navbar