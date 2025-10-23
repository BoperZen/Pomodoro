import React from 'react';
import styles from './TimerDisplay.module.css';

/**
 * Componente para mostrar el temporizador en formato MM : SS
 * Diseño minimalista tipo iOS sin bloques de fondo
 * 
 * @param {Object} props
 * @param {Object} props.formattedTime - { minutes, seconds }
 * @param {string} props.size - 'small' | 'medium' | 'large'
 * @param {string} props.color - Color principal del theme
 * @param {boolean} props.isStudyMode - Si está en modo estudio o descanso
 * @param {number} props.currentCycle - Ciclo actual
 * @param {number} props.totalCycles - Total de ciclos
 * @param {boolean} props.isBlinking - Si debe parpadear (últimos 6 segundos)
 */
const TimerDisplay = ({ 
  formattedTime, 
  size = 'large', 
  color = '#FFFFFF',
  isStudyMode,
  currentCycle,
  totalCycles,
  isBlinking = false
}) => {
  const sizeClass = styles[size];
  
  return (
    <div className={styles.container}>
      {/* Display del temporizador - números limpios sin fondo */}
      <div 
        className={`${styles.timerDisplay} ${sizeClass} ${isBlinking ? styles.blinking : ''}`}
        aria-label={`Tiempo restante: ${formattedTime.minutes} minutos ${formattedTime.seconds} segundos`}
      >
        <span className={styles.digit}>{formattedTime.minutes}</span>
        <span className={styles.separator}>:</span>
        <span className={styles.digit}>{formattedTime.seconds}</span>
      </div>
      
      {/* Indicador de ciclo y modo - debajo del timer */}
      <div className={styles.statusBar}>
        <span 
          className={styles.cycle}
          role="status"
          aria-live="polite"
        >
          {currentCycle} / {totalCycles}
        </span>
        <span className={styles.mode}>
          {isStudyMode ? 'Focus' : 'Break'}
        </span>
      </div>
    </div>
  );
};

export default TimerDisplay;
