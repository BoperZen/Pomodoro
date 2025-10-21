import React, { useState, useEffect, useRef } from 'react';
import styles from './QuickSettings.module.css';

/**
 * Componente de panel colapsable con configuración rápida
 * Diseño minimalista integrado con los controles
 * 
 * @param {Object} props
 * @param {string} props.clockSize - Tamaño actual del reloj
 * @param {Function} props.onClockSizeChange - Callback al cambiar tamaño
 * @param {Object} props.duration - { studyTime, restTime, cycles }
 * @param {Function} props.onDurationChange - Callback al cambiar duración
 * @param {Function} props.onReset - Callback para resetear el timer
 */
const QuickSettings = ({
  clockSize,
  onClockSizeChange,
  duration,
  onDurationChange,
  onReset
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef(null);
  
  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);
  
  const handleDurationChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    onDurationChange({
      ...duration,
      [field]: numValue
    });
  };
  
  return (
    <div className={styles.container} ref={containerRef}>
      {/* Botón de configuración integrado */}
      <button
        className={styles.toggleButton}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="quick-settings-panel"
        aria-label={isExpanded ? "Ocultar configuración" : "Mostrar configuración"}
        title="Configuración rápida"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/>
        </svg>
        Config
      </button>
      
      {/* Panel de configuración */}
      <div 
        id="quick-settings-panel"
        className={`${styles.panel} ${isExpanded ? styles.expanded : ''}`}
        aria-hidden={!isExpanded}
      >
        <div className={styles.grid}>
          {/* Botón Reset */}
          <div className={styles.section}>
            <button
              className={styles.resetButton}
              onClick={onReset}
              aria-label="Resetear temporizador"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/>
              </svg>
              Reset Timer
            </button>
          </div>
          
          {/* Sección: Tamaño del reloj */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Clock Size</h3>
            <div className={styles.buttonGroup} role="group" aria-label="Seleccionar tamaño del reloj">
              {['small', 'medium', 'large'].map(size => (
                <button
                  key={size}
                  className={`${styles.button} ${clockSize === size ? styles.active : ''}`}
                  onClick={() => onClockSizeChange(size)}
                  aria-pressed={clockSize === size}
                  aria-label={`Tamaño ${size}`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Sección: Configuración de duración */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Timer Config</h3>
            <div className={styles.inputGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="study-time" className={styles.label}>
                  Focus (min)
                </label>
                <input
                  id="study-time"
                  type="number"
                  min="1"
                  max="120"
                  value={duration.studyTime}
                  onChange={(e) => handleDurationChange('studyTime', e.target.value)}
                  className={styles.input}
                  aria-label="Minutos de enfoque"
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="rest-time" className={styles.label}>
                  Break (min)
                </label>
                <input
                  id="rest-time"
                  type="number"
                  min="1"
                  max="60"
                  value={duration.restTime}
                  onChange={(e) => handleDurationChange('restTime', e.target.value)}
                  className={styles.input}
                  aria-label="Minutos de descanso"
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="cycles" className={styles.label}>
                  Rounds
                </label>
                <input
                  id="cycles"
                  type="number"
                  min="1"
                  max="10"
                  value={duration.cycles}
                  onChange={(e) => handleDurationChange('cycles', e.target.value)}
                  className={styles.input}
                  aria-label="Número de rondas"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSettings;
