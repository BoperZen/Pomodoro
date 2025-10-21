import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook personalizado para gestionar el temporizador Pomodoro
 * Maneja los ciclos de estudio/descanso, countdown y persistencia en localStorage
 * 
 * @param {Object} config - Configuración inicial del timer
 * @param {number} config.studyTime - Minutos de estudio
 * @param {number} config.restTime - Minutos de descanso
 * @param {number} config.cycles - Número de ciclos totales
 * @returns {Object} Estado y funciones del timer
 */
const useTimer = (config) => {
  const { studyTime = 25, restTime = 5, cycles = 4 } = config;
  
  // Estado del timer
  const [timeLeft, setTimeLeft] = useState(studyTime * 60); // En segundos
  const [isRunning, setIsRunning] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(true);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Ref para el intervalo
  const intervalRef = useRef(null);
  
  // Refs para valores actuales (evitar recrear intervalo)
  const isStudyModeRef = useRef(isStudyMode);
  const currentCycleRef = useRef(currentCycle);
  const studyTimeRef = useRef(studyTime);
  const restTimeRef = useRef(restTime);
  const cyclesRef = useRef(cycles);
  
  // Refs para rastrear valores anteriores
  const prevStudyTimeRef = useRef(studyTime);
  const prevRestTimeRef = useRef(restTime);
  
  // Actualizar refs cuando cambien los valores
  useEffect(() => {
    isStudyModeRef.current = isStudyMode;
    currentCycleRef.current = currentCycle;
    studyTimeRef.current = studyTime;
    restTimeRef.current = restTime;
    cyclesRef.current = cycles;
  }, [isStudyMode, currentCycle, studyTime, restTime, cycles]);
  
  // Efecto para ajustar el tiempo de forma sumativa/restativa cuando cambia la configuración
  useEffect(() => {
    const prevStudyTime = prevStudyTimeRef.current;
    const prevRestTime = prevRestTimeRef.current;
    
    if (isStudyMode && studyTime !== prevStudyTime) {
      // Calcular la diferencia y aplicarla al tiempo actual
      const diffMinutes = studyTime - prevStudyTime;
      const diffSeconds = diffMinutes * 60;
      setTimeLeft(prev => Math.max(1, prev + diffSeconds)); // No permitir valores negativos
      prevStudyTimeRef.current = studyTime;
    } else if (!isStudyMode && restTime !== prevRestTime) {
      // Calcular la diferencia y aplicarla al tiempo actual
      const diffMinutes = restTime - prevRestTime;
      const diffSeconds = diffMinutes * 60;
      setTimeLeft(prev => Math.max(1, prev + diffSeconds)); // No permitir valores negativos
      prevRestTimeRef.current = restTime;
    }
  }, [studyTime, restTime, isStudyMode]);
  
  /**
   * Formatea el tiempo en minutos y segundos
   * @returns {Object} { minutes, seconds }
   */
  const getFormattedTime = useCallback(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return {
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    };
  }, [timeLeft]);
  
  /**
   * Inicia el temporizador
   */
  const start = useCallback(() => {
    setIsRunning(true);
    setIsCompleted(false);
    // No resetear el timeLeft aquí - mantener el tiempo actual
  }, []);
  
  /**
   * Pausa el temporizador
   */
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);
  
  /**
   * Resetea el temporizador al estado inicial
   */
  const reset = useCallback(() => {
    setIsRunning(false);
    setIsStudyMode(true);
    setCurrentCycle(1);
    setTimeLeft(studyTime * 60);
    setIsCompleted(false);
    // Actualizar refs previas al resetear
    prevStudyTimeRef.current = studyTime;
    prevRestTimeRef.current = restTime;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [studyTime, restTime]);
  
  /**
   * Salta al siguiente ciclo (estudio/descanso)
   */
  const skip = useCallback(() => {
    if (isStudyMode) {
      // Cambiar a modo descanso
      setIsStudyMode(false);
      setTimeLeft(restTime * 60);
    } else {
      // Cambiar a modo estudio y avanzar ciclo
      if (currentCycle < cycles) {
        setCurrentCycle(prev => prev + 1);
        setIsStudyMode(true);
        setTimeLeft(studyTime * 60);
      } else {
        // Todos los ciclos completados
        setIsCompleted(true);
        setIsRunning(false);
        setTimeLeft(0);
      }
    }
  }, [isStudyMode, currentCycle, cycles, studyTime, restTime]);
  
  // Efecto para el countdown
  useEffect(() => {
    if (!isRunning) {
      // Si no está corriendo, limpiar intervalo
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    
    // Solo crear intervalo si está corriendo y no existe uno
    if (isRunning && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Tiempo agotado, cambiar automáticamente
            const currentIsStudyMode = isStudyModeRef.current;
            const currentCycleNum = currentCycleRef.current;
            const totalCycles = cyclesRef.current;
            
            if (currentIsStudyMode) {
              // Cambiar a descanso
              setIsStudyMode(false);
              prevRestTimeRef.current = restTimeRef.current; // Actualizar ref al cambiar de modo
              return restTimeRef.current * 60;
            } else {
              // Cambiar a estudio o completar
              if (currentCycleNum < totalCycles) {
                setCurrentCycle(c => c + 1);
                setIsStudyMode(true);
                prevStudyTimeRef.current = studyTimeRef.current; // Actualizar ref al cambiar de modo
                return studyTimeRef.current * 60;
              } else {
                // Completado
                setIsCompleted(true);
                setIsRunning(false);
                return 0;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);
  
  // Persistencia en localStorage
  useEffect(() => {
    const timerState = {
      timeLeft,
      isStudyMode,
      currentCycle,
      isCompleted
    };
    localStorage.setItem('timerState', JSON.stringify(timerState));
  }, [timeLeft, isStudyMode, currentCycle, isCompleted]);
  
  // Cargar estado desde localStorage al montar (solo una vez)
  useEffect(() => {
    const savedState = localStorage.getItem('timerState');
    if (savedState) {
      try {
        const { timeLeft: savedTime, isStudyMode: savedMode, currentCycle: savedCycle, isCompleted: savedCompleted } = JSON.parse(savedState);
        setTimeLeft(savedTime);
        setIsStudyMode(savedMode);
        setCurrentCycle(savedCycle);
        setIsCompleted(savedCompleted);
        // Actualizar refs previas con la configuración actual
        prevStudyTimeRef.current = studyTime;
        prevRestTimeRef.current = restTime;
      } catch (e) {
        console.error('Error al cargar estado del timer:', e);
      }
    } else {
      // Si no hay estado guardado, inicializar las refs previas
      prevStudyTimeRef.current = studyTime;
      prevRestTimeRef.current = restTime;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  return {
    timeLeft,
    formattedTime: getFormattedTime(),
    isRunning,
    isStudyMode,
    currentCycle,
    totalCycles: cycles,
    isCompleted,
    start,
    pause,
    reset,
    skip
  };
};

export default useTimer;
