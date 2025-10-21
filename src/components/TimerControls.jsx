import React from 'react';
import styles from './TimerControls.module.css';

/**
 * Componente con los controles principales del temporizador
 * Diseño minimalista: Solo Play/Pause toggle
 * 
 * @param {Object} props
 * @param {boolean} props.isRunning - Indica si el timer está corriendo
 * @param {Function} props.onStart - Callback para iniciar
 * @param {Function} props.onPause - Callback para pausar
 */
const TimerControls = ({ 
  isRunning, 
  onStart, 
  onPause
}) => {
  return (
    <div className={styles.container}>
      {/* Botón Play/Pause toggle */}
      <button
        className={styles.controlButton}
        onClick={isRunning ? onPause : onStart}
        aria-label={isRunning ? "Pausar temporizador" : "Iniciar temporizador"}
        title={isRunning ? "Pausar" : "Iniciar"}
      >
        {isRunning ? (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/>
              <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>
            </svg>
            Pause
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5.14v13.72L19 12L8 5.14z" fill="currentColor"/>
            </svg>
            Start
          </>
        )}
      </button>
    </div>
  );
};

export default TimerControls;
