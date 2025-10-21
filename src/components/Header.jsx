import React from 'react';
import styles from './Header.module.css';

/**
 * Componente de cabecera fija con navegación
 * Muestra el logo "Pomodoro" y enlaces a Home y Settings
 */
const Header = ({ isRunning }) => {
  return (
    <header className={`${styles.header} ${isRunning ? styles.dimmed : ''}`} role="banner">
      <div className={styles.container}>
        <h1 className={styles.logo}>Pomodoro</h1>
      </div>
    </header>
  );
};

export default Header;
