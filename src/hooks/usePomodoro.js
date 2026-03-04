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

  const [focusDuration, setFocusDuration] = useState(23);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
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
    let timer = null;
    if (isFocusMode && !isPaused && !isFinished && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isFocusMode && !isFinished) {
      if (!isRest) {
        saveSessionRecord("completed");

        setIsRest(true);
        setTimeLeft(breakDuration * 60);
      } else {
        setIsFinished(true);
      }
    }
    return () => clearInterval(timer);
  }, [isFocusMode, isPaused, timeLeft, isFinished, isRest, breakDuration]);

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
