import { useState, useEffect, useRef } from "react";

import sakuraImg from "../assets/sakura.jpg";
import tokyoImg from "../assets/tokyo.jpg";

import nightChill from "../assets/sfx/night-chill.mp3";
import winterCity from "../assets/sfx/winter-city.mp3";
import winterWalk from "../assets/sfx/winter-walk.mp3";
import { addFocusSession } from "../services/focusServices";

export const THEME_LIST = [
  { id: "tokyo", name: "Tokyo Night", bg: `url(${tokyoImg})` },
  { id: "sakura", name: "Spring Sakura", bg: `url(${sakuraImg})` },
  { id: "dark", name: "Deep Space", bg: "none", colorClass: "bg-slate-950" },
];

export const PLAYLIST = [
  { title: "Night Chill", src: nightChill },
  { title: "Winter City", src: winterCity },
  { title: "Winter Walk", src: winterWalk },
];

export const usePomodoro = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRest, setIsRest] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Inisialisasi duration & session terlebih dahulu sebelum dipakai oleh timeLeft
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [totalSessions, setTotalSessions] = useState(4);
  const [currentSession, setCurrentSession] = useState(1);

  // Sekarang aman untuk mengeset timeLeft
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [theme, setTheme] = useState(THEME_LIST[0]);

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  const saveSessionRecord = (status) => {
    const totalSecondsFocused = focusDuration * 60 - timeLeft;
    if (totalSecondsFocused > 0) {
      addFocusSession(totalSecondsFocused, status);
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
        // Waktu Fokus habis
        if (currentSession < totalSessions) {
          // Jika sesi belum maksimal, lanjut ke waktu Istirahat
          setIsRest(true);
          setTimeLeft(breakDuration * 60);
        } else {
          // Jika ini sesi terakhir, tampilkan layar Finish
          setIsFinished(true);
        }
      } else {
        // Waktu Istirahat habis, kembali ke Fokus dan tambah 1 sesi
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
    if (!isRest && !isFinished && isFocusMode) {
      saveSessionRecord("stopped");
    }

    setIsFocusMode(false);
    setIsPaused(false);
    setIsRest(false);
    setIsFinished(false);
    setCurrentSession(1); // Reset sesi ke 1 jika di-stop
    setTimeLeft(focusDuration * 60);
    setIsMusicPlaying(false);

    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => console.log(err));
    }
  };

  const handleStartNewSession = () => {
    setIsRest(false);
    setIsFinished(false);
    setIsPaused(false);
    setCurrentSession(1); // Mulai sesi baru dari awal
    setTimeLeft(focusDuration * 60);
    setIsMusicPlaying(true);
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
