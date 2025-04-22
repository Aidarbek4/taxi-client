import React from 'react'
import Logo from '../Logo/Logo';
import styles from './Navbar.module.scss'

function Navbar() {
  return (
    <div className={styles.Navbar}>
      <nav className={styles.NavbarWrapper}>
        <ul className={styles.NavbarList}>
          <li className={styles.NavbarItem}>
            <Logo />
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar;