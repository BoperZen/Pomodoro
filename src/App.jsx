import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import QuickSettings from './components/QuickSettings';
import useTimer from './hooks/useTimer';
import styles from './App.module.css';

/**
 * Componente principal de la aplicación Pomodoro
 * Diseño minimalista oscuro tipo iOS/Nirvana
 */
function App() {
  // Estado de configuración visual
  const [clockSize, setClockSize] = useState('small');
  
  // Estado de configuración del timer
  const [duration, setDuration] = useState({
    studyTime: 25,
    restTime: 5,
    cycles: 4
  });
  
  // Estado para controlar el dimmed después de 5 segundos
  const [shouldDim, setShouldDim] = useState(false);
  
  // Hook del temporizador
  const {
    formattedTime,
    isRunning,
    currentCycle,
    totalCycles,
    isStudyMode,
    isCompleted,
    isBlinking,
    start,
    pause,
    reset
  } = useTimer(duration);
  
  // Efecto para activar el dimmed después de 5 segundos
  useEffect(() => {
    let timeoutId;
    
    if (isRunning) {
      timeoutId = setTimeout(() => {
        setShouldDim(true);
      }, 5000); // 5 segundos
    } else {
      setShouldDim(false);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isRunning]);
  
  // Cargar configuración desde localStorage al montar
  useEffect(() => {
    const savedConfig = localStorage.getItem('pomodoroConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setClockSize(config.clockSize || 'small');
        setDuration(config.duration || { studyTime: 25, restTime: 5, cycles: 4 });
      } catch (e) {
        console.error('Error al cargar configuración:', e);
      }
    }
  }, []);
  
  // Guardar configuración en localStorage cuando cambia
  useEffect(() => {
    const config = {
      clockSize,
      duration
    };
    localStorage.setItem('pomodoroConfig', JSON.stringify(config));
  }, [clockSize, duration]);
  
  // Cambiar título de la página según el estado
  useEffect(() => {
    if (isCompleted) {
      document.title = '✅ Pomodoro - ¡Completado!';
    } else if (isRunning) {
      document.title = `${formattedTime.minutes}:${formattedTime.seconds} - Pomodoro`;
    } else {
      document.title = 'Pomodoro Timer';
    }
  }, [isRunning, isCompleted, formattedTime]);
  
  return (
    <div className={styles.app}>
      <Header isRunning={shouldDim} />
      
      <main className={styles.main}>
        {/* Contenedor compacto: timer + controles + settings */}
        <div className={styles.timerContainer}>
          <TimerDisplay
            formattedTime={formattedTime}
            size={clockSize}
            currentCycle={currentCycle}
            totalCycles={totalCycles}
            isStudyMode={isStudyMode}
            isBlinking={isBlinking}
          />
          
          {/* Mensaje de completado */}
          {isCompleted && (
            <div 
              className={`${styles.completedMessage} ${shouldDim ? styles.dimmed : ''}`}
              role="alert"
              aria-live="assertive"
            >
              <h2 className={styles.completedTitle}>All rounds completed!</h2>
              <p className={styles.completedText}>Great work! 🎉</p>
            </div>
          )}
          
          {/* Controles y configuración en la misma línea */}
          <div className={`${styles.controlsContainer} ${shouldDim ? styles.dimmed : ''}`}>
            <TimerControls
              isRunning={isRunning}
              onStart={start}
              onPause={pause}
            />
            
            <QuickSettings
              clockSize={clockSize}
              onClockSizeChange={setClockSize}
              duration={duration}
              onDurationChange={setDuration}
              onReset={reset}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
