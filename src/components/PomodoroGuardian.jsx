import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay,
  FaPause,
  FaStop,
  FaCheck,
  FaStepBackward,
  FaStepForward,
  FaCompactDisc,
} from "react-icons/fa";
import { MdTimer, MdFullscreen, MdFullscreenExit } from "react-icons/md";

// 1. Import Images
import sakuraImg from "../assets/sakura.jpg";
import tokyoImg from "../assets/tokyo.jpg";

// 2. Import SFX (Musik)
import nightChill from "../assets/sfx/night-chill.mp3";
import winterCity from "../assets/sfx/winter-city.mp3";
import winterWalk from "../assets/sfx/winter-walk.mp3";

// Daftar Tema
const THEME_LIST = [
  { id: "tokyo", name: "Tokyo Night", bg: `url(${tokyoImg})` },
  { id: "sakura", name: "Spring Sakura", bg: `url(${sakuraImg})` },
  { id: "dark", name: "Deep Space", bg: "none", colorClass: "bg-slate-950" },
];

// Daftar Playlist Musik
const PLAYLIST = [
  { title: "Night Chill", src: nightChill },
  { title: "Winter City", src: winterCity },
  { title: "Winter Walk", src: winterWalk },
];

const PomodoroGuardian = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRest, setIsRest] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // State Fullscreen
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Timer State
  const [focusDuration, setFocusDuration] = useState(23);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [theme, setTheme] = useState(THEME_LIST[0]);

  // Music Player State
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  // --- LOGIC: Lock Scroll ---
  useEffect(() => {
    document.body.style.overflow = isFocusMode ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFocusMode]);

  // --- LOGIC: Sync Fullscreen ---
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // --- LOGIC: Timer Otomatis ---
  useEffect(() => {
    let timer = null;
    if (isFocusMode && !isPaused && !isFinished && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isFocusMode && !isFinished) {
      if (!isRest) {
        setIsRest(true);
        setTimeLeft(breakDuration * 60);
      } else {
        setIsFinished(true);
      }
    }
    return () => clearInterval(timer);
  }, [isFocusMode, isPaused, timeLeft, isFinished, isRest, breakDuration]);

  // --- LOGIC: Music Player ---
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

  // --- HANDLERS ---
  const handleStop = () => {
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

  const renderThemeSelectors = () => (
    <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
      {THEME_LIST.map((t) => {
        const isActive = theme.id === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t)}
            title={t.name}
            className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden bg-cover bg-center transition-all duration-300 ${
              isActive
                ? "ring-4 ring-indigo-500 scale-110 shadow-xl"
                : "hover:scale-105 opacity-70 hover:opacity-100"
            } ${t.colorClass || ""}`}
            style={{ backgroundImage: t.bg !== "none" ? t.bg : "none" }}
          >
            {isActive && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <FaCheck className="text-white drop-shadow-md" size={20} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <audio
        ref={audioRef}
        src={PLAYLIST[currentSongIndex].src}
        onEnded={nextSong}
        loop={false}
      />

      {!isFocusMode && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 p-3 md:p-4 bg-indigo-600 rounded-full shadow-lg text-white"
        >
          <MdTimer size={24} />
        </motion.button>
      )}

      <AnimatePresence>
        {isFocusMode && (
          <motion.div
            initial={{ clipPath: "circle(0% at 92% 92%)" }}
            animate={{ clipPath: "circle(150% at 92% 92%)" }}
            exit={{ clipPath: "circle(0% at 92% 92%)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center text-white bg-cover bg-center ${theme.colorClass || ""}`}
            style={{ backgroundImage: theme.bg !== "none" ? theme.bg : "none" }}
          >
            <div className="absolute inset-0 bg-black/50 z-[-1]"></div>

            {/* Tombol Fullscreen Reponsif */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-2 md:p-3 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-xl md:rounded-2xl text-white transition-all border border-white/10 shadow-lg"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <MdFullscreenExit className="text-xl md:text-3xl" />
              ) : (
                <MdFullscreen className="text-xl md:text-3xl" />
              )}
            </button>

            <p className="text-sm md:text-xl uppercase tracking-[0.3em] mb-2 md:mb-4 font-light opacity-80 mt-10 md:mt-0">
              {isRest && !isFinished
                ? "☕ Break"
                : !isFinished
                  ? "🎯 Focus"
                  : "✨ Selesai"}
            </p>

            {isFinished ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center mt-4 w-full max-w-lg px-4"
              >
                {/* Teks Finish Responsif */}
                <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-10 text-center drop-shadow-lg">
                  1 Sesi Selesai! Kerja Bagus.
                </h2>

                <div className="bg-black/30 backdrop-blur-md p-4 md:p-6 rounded-2xl md:rounded-3xl mb-6 md:mb-10 w-full border border-white/10">
                  <p className="text-center text-xs md:text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">
                    Ganti Suasana Sesi Berikutnya?
                  </p>
                  {renderThemeSelectors()}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
                  <button
                    onClick={handleStop}
                    className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-white/20 hover:bg-white/30 rounded-xl md:rounded-2xl backdrop-blur-md transition-all font-bold border border-white/30"
                  >
                    Tutup & Kembali
                  </button>
                  <button
                    onClick={handleStartNewSession}
                    className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl md:rounded-2xl transition-all font-bold shadow-lg shadow-indigo-500/50"
                  >
                    Mulai Sesi Baru
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Angka Timer Super Responsif */}
                <div className="flex text-[6rem] sm:text-[9rem] md:text-[12rem] font-black tabular-nums leading-none drop-shadow-2xl">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={minutes}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                    >
                      {minutes.toString().padStart(2, "0")}
                    </motion.span>
                  </AnimatePresence>
                  <span className="animate-pulse">:</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={seconds}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                    >
                      {seconds.toString().padStart(2, "0")}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* Tombol Play/Stop Responsif */}
                <div className="mt-8 md:mt-12 flex gap-4 md:gap-6 items-center">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-4 md:p-6 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-all border border-white/30"
                  >
                    {isPaused ? (
                      <FaPlay className="text-lg md:text-2xl" />
                    ) : (
                      <FaPause className="text-lg md:text-2xl" />
                    )}
                  </button>

                  <button
                    onClick={handleStop}
                    className="p-4 md:p-6 bg-red-500/90 hover:bg-red-600 rounded-full shadow-xl transition-all"
                  >
                    <FaStop className="text-lg md:text-2xl" />
                  </button>
                </div>
              </>
            )}

            {/* --- MUSIC PLAYER (Pindah ke Kiri Bawah & Responsif) --- */}
            <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 flex items-center gap-2 md:gap-4 bg-black/40 backdrop-blur-xl p-2 pr-4 md:p-3 md:pr-5 rounded-full border border-white/10 shadow-2xl transition-all hover:bg-black/60 scale-90 sm:scale-100 origin-bottom-left">
              <div
                className={`w-10 h-10 md:w-14 md:h-14 rounded-full bg-slate-900 border-[3px] md:border-4 border-slate-700 flex items-center justify-center shadow-inner ${
                  isMusicPlaying ? "animate-[spin_4s_linear_infinite]" : ""
                }`}
              >
                <FaCompactDisc className="text-slate-500 opacity-50 text-2xl md:text-4xl" />
                <div className="absolute w-2 h-2 md:w-4 md:h-4 bg-red-500 rounded-full border-2 border-slate-800"></div>
              </div>

              <div className="flex flex-col w-20 md:w-28">
                <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-indigo-300">
                  Now Playing
                </p>
                <p className="font-bold text-xs md:text-sm truncate text-white">
                  {PLAYLIST[currentSongIndex].title}
                </p>
              </div>

              <div className="flex items-center gap-2 md:gap-4 border-l border-white/20 pl-2 md:pl-4 ml-0 md:ml-1">
                <button
                  onClick={prevSong}
                  className="text-slate-300 hover:text-white transition hover:scale-110 p-1"
                >
                  <FaStepBackward className="text-xs md:text-sm" />
                </button>
                <button
                  onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition shadow-lg"
                >
                  {isMusicPlaying ? (
                    <FaPause className="text-[10px] md:text-xs" />
                  ) : (
                    <FaPlay className="text-[10px] md:text-xs ml-0.5 md:ml-1" />
                  )}
                </button>
                <button
                  onClick={nextSong}
                  className="text-slate-300 hover:text-white transition hover:scale-110 p-1"
                >
                  <FaStepForward className="text-xs md:text-sm" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            // Settings Modal Responsif (Bisa muat di HP)
            className="fixed bottom-20 right-4 md:bottom-24 md:right-6 z-[70] w-[calc(100%-2rem)] max-w-sm md:w-80 bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border border-slate-100"
          >
            <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 md:mb-6">
              Timer Setup
            </h3>

            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <div>
                <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">
                  Fokus (Menit)
                </label>
                <input
                  type="number"
                  value={focusDuration}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setFocusDuration(val);
                    setTimeLeft(val * 60);
                  }}
                  className="w-full mt-1 bg-slate-100 p-2 md:p-3 rounded-lg md:rounded-xl font-bold text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">
                  Istirahat (Menit)
                </label>
                <input
                  type="number"
                  value={breakDuration}
                  onChange={(e) =>
                    setBreakDuration(parseInt(e.target.value) || 0)
                  }
                  className="w-full mt-1 bg-slate-100 p-2 md:p-3 rounded-lg md:rounded-xl font-bold text-emerald-600 outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-2 md:mb-3 text-center">
                Pilih Tema Background
              </p>
              {renderThemeSelectors()}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 transition py-3 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-base font-bold text-slate-500"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsFocusMode(true);
                  setIsFinished(false);
                  setIsRest(false);
                  setTimeLeft(focusDuration * 60);
                }}
                className="flex-[2] bg-indigo-600 hover:bg-indigo-700 transition py-3 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-base text-white font-bold shadow-lg shadow-indigo-200/50"
              >
                Mulai Sesi
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PomodoroGuardian;
