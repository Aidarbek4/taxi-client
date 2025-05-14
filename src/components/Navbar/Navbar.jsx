import React, { useState, useEffect, useRef } from 'react';
import Logo from '../Logo/Logo';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import styles from './Navbar.module.scss';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profileRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={styles.Navbar}>
      <ul className={styles.NavbarList}>
        <li className={styles.NavbarItem}>
          <Logo />
        </li>
        <li className={styles.NavbarItem} ref={profileRef}>
          <div className={styles.Profile}>
            <button
              className={styles.ProfileButton}
              onClick={toggleMenu}
              aria-label="Toggle profile menu"
            >
              <AccountCircleIcon className={styles.ProfileButtonIcon} />
            </button>

            {isMenuOpen && (
              <ul className={styles.ProfileList}>
                <li className={styles.ProfileItem}>
                  <Link to="/history" className={styles.ProfileLink}>
                    <span className={styles.ProfileLinkText}>Rides history</span>
                    <HistoryIcon className={styles.ProfileLinkIcon} />
                  </Link>
                </li>
                <li className={styles.ProfileItem}>
                  <Link to="/profile" className={styles.ProfileLink}>
                    <span className={styles.ProfileLinkText}>Profile settings</span>
                    <SettingsIcon className={styles.ProfileLinkIcon} />
                  </Link>
                </li>
                <li className={styles.ProfileItem}>
                  <Link to="/logout" className={styles.ProfileLink}>
                    <span className={styles.ProfileLinkText}>Logout</span>
                    <LogoutIcon className={styles.ProfileLinkIcon} />
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
