import { useState, useEffect, useRef } from "react";
import { addFocusSession } from "../services/focusServices";
import { PLAYLIST, THEME_LIST } from "../helpers/pomodoroUtils";

export const usePomodoro = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRest, setIsRest] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [totalSessions, setTotalSessions] = useState(4);
  const [currentSession, setCurrentSession] = useState(1);
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  const [accumulatedFocusTime, setAccumulatedFocusTime] = useState(0);
  const [theme, setTheme] = useState(THEME_LIST[0]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  const saveSessionRecord = (status) => {
    const currentSessionTime = isRest ? 0 : focusDuration * 60 - timeLeft;

    const totalSetTime = accumulatedFocusTime + currentSessionTime;

    if (totalSetTime > 0) {
      addFocusSession(totalSetTime, status);
      setAccumulatedFocusTime(0);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isFocusMode ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFocusMode]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    let interval = null;

    if (isFocusMode && !isPaused && !isFinished && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isFocusMode && !isFinished) {
      if (!isRest) {
        // WAKTU FOKUS HABIS!

        // 1. Tambahkan durasi sesi ini ke akumulasi total SET
        setAccumulatedFocusTime((prev) => prev + focusDuration * 60);

        if (currentSession < totalSessions) {
          // Lanjut ke Istirahat
          setIsRest(true);
          setTimeLeft(breakDuration * 60);
        } else {
          // Selesai 1 FULL SET
          setIsFinished(true);
          // Karena sudah 1 full set (semua sesi selesai), langsung simpan rekornya
          // Note: Karena setState (setAccumulatedFocusTime) bersifat async, kita hitung manual untuk dikirim
          const finalTotalSetTime = accumulatedFocusTime + focusDuration * 60;
          addFocusSession(finalTotalSetTime, "completed");
          setAccumulatedFocusTime(0); // Reset untuk set berikutnya
        }
      } else {
        // Waktu Istirahat habis, kembali ke Fokus
        setIsRest(false);
        setCurrentSession((prev) => prev + 1);
        setTimeLeft(focusDuration * 60);
      }
    }

    return () => clearInterval(interval);
  }, [
    isFocusMode,
    isPaused,
    isFinished,
    timeLeft,
    isRest,
    currentSession,
    totalSessions,
    focusDuration,
    breakDuration,
    accumulatedFocusTime,
  ]);

  useEffect(() => {
    if (isMusicPlaying) {
      audioRef.current
        ?.play()
        .catch((e) => console.log("Audio play error:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isMusicPlaying, currentSongIndex]);

  useEffect(() => {
    if (isFocusMode && !isPaused && !isFinished) {
      setIsMusicPlaying(true);
    } else {
      setIsMusicPlaying(false);
    }
  }, [isFocusMode, isPaused, isFinished]);

  const handleStop = () => {
    if (!isFinished && isFocusMode) {
      saveSessionRecord("stopped");
    }

    setIsFocusMode(false);
    setIsPaused(false);
    setIsRest(false);
    setIsFinished(false);
    setCurrentSession(1);
    setTimeLeft(focusDuration * 60);
    setIsMusicPlaying(false);
    setAccumulatedFocusTime(0);

    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => console.log(err));
    }
  };

  const handleStartNewSession = () => {
    setIsRest(false);
    setIsFinished(false);
    setIsPaused(false);
    setCurrentSession(1);
    setTimeLeft(focusDuration * 60);
    setIsMusicPlaying(true);
    setAccumulatedFocusTime(0);
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsMusicPlaying(true);
  };

  const prevSong = () => {
    setCurrentSongIndex(
      (prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length,
    );
    setIsMusicPlaying(true);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return {
    isOpen,
    setIsOpen,
    isFocusMode,
    setIsFocusMode,
    isPaused,
    setIsPaused,
    isRest,
    setIsRest,
    isFinished,
    setIsFinished,
    isFullscreen,
    focusDuration,
    setFocusDuration,
    breakDuration,
    setBreakDuration,
    totalSessions,
    setTotalSessions,
    currentSession,
    setCurrentSession,
    timeLeft,
    setTimeLeft,
    theme,
    setTheme,
    currentSongIndex,
    isMusicPlaying,
    setIsMusicPlaying,
    audioRef,
    handleStop,
    handleStartNewSession,
    nextSong,
    prevSong,
    toggleFullscreen,
    minutes,
    seconds,
  };
};
