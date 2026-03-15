import React from "react";
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
import { MdFullscreen, MdFullscreenExit, MdOutlineClose } from "react-icons/md";
import { BsCalendarDate } from "react-icons/bs";
import ThemeSelector from "./ThemeSelector";
import { PLAYLIST } from "../../helpers/pomodoroUtils";
import { ScoreBadge, StatusBadge, TimeBadge } from "../TaskBadge";

const PomodoroFocusScreen = ({
  pomodoro,
  activeTasks,
  handleMarkTaskDone,
  handleStopAndRevert,
  showTasksMobile,
  setShowTasksMobile,
}) => {
  const {
    isFocusMode,
    isPaused,
    setIsPaused,
    isRest,
    isFinished,
    isFullscreen,
    theme,
    setTheme,
    currentSongIndex,
    isMusicPlaying,
    setIsMusicPlaying,
    handleStartNewSession,
    nextSong,
    prevSong,
    toggleFullscreen,
    minutes,
    seconds,
    currentSession,
    totalSessions,
    setCurrentSession,
  } = pomodoro;

  const getTimeRemaining = (deadlineDate) => {
    const total = Date.parse(deadlineDate) - Date.parse(new Date());
    if (total <= 0) return "Telah Berakhir";

    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);

    if (days > 0) return `${days} Hari ${hours} Jam lagi`;
    if (hours > 0) return `${hours} Jam ${minutes} Mnt lagi`;
    return `${minutes} Menit lagi`;
  };

  return (
    <AnimatePresence>
      {isFocusMode && (
        <motion.div
          initial={{ clipPath: "circle(0% at 99% 99%)" }}
          animate={{ clipPath: "circle(150% at 99% 99%)" }}
          exit={{ clipPath: "circle(0% at 99% 99%)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center text-white bg-cover bg-center ${theme.colorClass || ""}`}
          style={{ backgroundImage: theme.bg !== "none" ? theme.bg : "none" }}
        >
          <div
            className={`absolute inset-0 z-[-1] transition-all duration-1000 ${isRest ? "bg-black/85 backdrop-blur-md" : "bg-black/60"}`}
          ></div>

          <button
            onClick={toggleFullscreen}
            className="absolute top-4 hidden md:flex right-4 md:top-8 md:right-8 z-50 p-2 md:p-3 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-xl md:rounded-2xl text-white transition-all border border-white/10 shadow-lg"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <MdFullscreenExit className="text-xl md:text-3xl" />
            ) : (
              <MdFullscreen className="text-xl md:text-3xl" />
            )}
          </button>

          {!isFinished && activeTasks.length > 0 && (
            <div className="absolute top-20 z-50 md:hidden flex justify-center w-full">
              <button
                onClick={() => setShowTasksMobile(!showTasksMobile)}
                className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white px-5 py-2.5 rounded-full border border-white/20 text-xs font-bold tracking-widest shadow-xl flex items-center gap-2 transition-all active:scale-95"
              >
                {showTasksMobile ? "Sembunyikan Tugas" : "Lihat Tugas Sesi Ini"}
                {!showTasksMobile && (
                  <span className="bg-indigo-600 px-2 py-0.5 rounded-full text-[10px]">
                    {activeTasks.filter((t) => t.done).length}/
                    {activeTasks.length}
                  </span>
                )}
              </button>
            </div>
          )}

          {!isFinished && activeTasks.length > 0 && (
            <div
              className={`absolute left-4 md:left-10 top-36 md:top-1/2 md:-translate-y-1/2 z-40 bg-slate-990 md:bg-slate-990 backdrop-blur-2xl p-5 md:p-6 rounded-[2rem] border border-white/10 shadow-2xl shadow-black/50 w-[calc(100%-2rem)] md:w-[360px] max-h-[50vh] md:max-h-[75vh] flex flex-col transition-all duration-500 origin-top
              ${showTasksMobile ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95 md:opacity-100 md:visible md:scale-100"}`}
            >
              <div className="flex justify-between items-center mb-5 shrink-0 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-inner">
                    <span className="text-indigo-300 text-lg">🎯</span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-white font-extrabold text-sm md:text-base tracking-wide leading-none mb-1">
                      Target Sesi
                    </h3>
                    <p className="text-slate-400 text-[10px] md:text-xs font-medium">
                      <span className="text-indigo-400 font-bold">
                        {activeTasks.filter((t) => t.done).length}
                      </span>{" "}
                      dari {activeTasks.length} selesai
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTasksMobile(false)}
                  className="md:hidden text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
                >
                  <MdOutlineClose size={18} />
                </button>
              </div>

              <div className="overflow-y-auto space-y-3 pr-1.5 flex-1 custom-scrollbar">
                {activeTasks.map((task) => {
                  const timeLeftString = getTimeRemaining(task.date_deadline);

                  return (
                    <label
                      key={task.id}
                      className={`flex items-start gap-3.5 p-4 md:p-4 rounded-2xl border transition-all duration-300 cursor-pointer group active:scale-[0.98] ${
                        task.done
                          ? "bg-white/5 border-white/5 opacity-50 grayscale"
                          : "bg-white/[0.08] border-white/10 hover:bg-white/[0.12] hover:border-white/20 shadow-lg shadow-black/20"
                      }`}
                    >
                      <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => handleMarkTaskDone(task)}
                          className="peer appearance-none w-5 h-5 md:w-5 md:h-5 border-2 border-slate-400/50 rounded-md checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                        />
                        <FaCheck className="absolute text-white opacity-0 peer-checked:opacity-100 text-[10px] pointer-events-none transition-transform scale-50 peer-checked:scale-100 duration-200" />
                      </div>

                      <div className="flex flex-col flex-1 min-w-0">
                        <span
                          className={`text-sm font-bold transition-colors leading-snug truncate ${
                            task.done
                              ? "line-through text-slate-500"
                              : "text-slate-100 group-hover:text-white"
                          }`}
                          title={task.title}
                        >
                          {task.title}
                        </span>

                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                          <TimeBadge date_deadline={task.date_deadline} />
                          <ScoreBadge finalScore={task.finalScore} />

                          {!task.done && (
                            <span className="text-[10px] md:text-[11px] text-slate-400 italic ml-0.5 truncate">
                              ({timeLeftString})
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col items-center justify-center z-10 w-full mt-24 md:mt-0 transition-transform duration-500">
            <p
              className={`text-sm md:text-xl uppercase tracking-[0.3em] mb-2 md:mb-4 font-light text-center transition-colors duration-1000 ${
                isRest
                  ? "text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                  : "opacity-80"
              }`}
            >
              {isFinished ? (
                "Selesai!"
              ) : (
                <>
                  <span>
                    {isRest ? "Istirahat dan Bersantai" : "Tetap Fokus"}
                  </span>
                  <br />
                  <span>
                    Sesi {currentSession}/{totalSessions}
                  </span>
                </>
              )}
            </p>

            {isFinished ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center mt-4 w-full max-w-lg px-4"
              >
                <div className="bg-black/30 backdrop-blur-md p-4 md:p-6 rounded-2xl md:rounded-3xl mb-6 md:mb-10 w-full border border-white/10 shadow-2xl">
                  <p className="text-center text-xs md:text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">
                    Ganti Suasana Sesi Berikutnya?
                  </p>
                  <div className="mx-auto">
                    <ThemeSelector theme={theme} setTheme={setTheme} />
                  </div>
                </div>

                <div className="flex flex-row gap-4">
                  <button
                    onClick={handleStopAndRevert}
                    className="w-fit py-3 px-4 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-all font-bold border border-white/10 shadow-lg"
                  >
                    <MdOutlineClose className="text-xl md:text-2xl" />
                  </button>
                  <button
                    onClick={() => {
                      handleStartNewSession();
                      setCurrentSession(1);
                    }}
                    className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl md:rounded-2xl transition-all font-bold shadow-lg shadow-indigo-500/50"
                  >
                    Mulai Sesi Baru
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                <div
                  className={`flex text-[6rem] sm:text-[9rem] md:text-[12rem] font-black tabular-nums leading-none font-mono tracking-tighter transition-all duration-1000 ${isRest ? "text-emerald-100 drop-shadow-[0_0_40px_rgba(52,211,153,0.4)]" : "drop-shadow-2xl"}`}
                >
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
                  <span className="animate-pulse relative -top-2">:</span>
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

                <div className="mt-8 md:mt-12 flex gap-4 md:gap-6 items-center">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-4 md:p-6 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-all border border-white/30 shadow-xl"
                  >
                    {isPaused ? (
                      <FaPlay className="text-lg md:text-2xl" />
                    ) : (
                      <FaPause className="text-lg md:text-2xl" />
                    )}
                  </button>

                  <button
                    onClick={handleStopAndRevert}
                    className="p-4 md:p-6 bg-red-500/90 hover:bg-red-600 rounded-full shadow-2xl transition-all"
                  >
                    <FaStop className="text-lg md:text-2xl" />
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="absolute bottom-4 right-0 md:bottom-10 md:right-10 flex items-center gap-2 md:gap-4 bg-black/50 backdrop-blur-xl p-2 pr-4 md:p-3 md:pr-5 rounded-full border border-white/10 shadow-2xl transition-all hover:bg-black/70 scale-90 sm:scale-100 origin-bottom-left z-50">
            <div
              className={`w-10 h-10 md:w-14 md:h-14 rounded-full bg-slate-900 border-[3px] md:border-4 border-slate-700 flex items-center justify-center shadow-inner relative ${isMusicPlaying ? "animate-[spin_4s_linear_infinite]" : ""}`}
            >
              <FaCompactDisc className="text-slate-500 opacity-50 text-2xl md:text-4xl" />
              <div className="absolute w-2.5 h-2.5 md:w-4 md:h-4 bg-red-500 rounded-full border-2 border-slate-800 shadow"></div>
            </div>

            <div className="flex flex-col w-20 md:w-28 truncate">
              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-indigo-300">
                Sedang diputar
              </p>
              <p className="font-bold text-xs md:text-sm truncate text-white">
                {PLAYLIST[currentSongIndex].title}
              </p>
            </div>

            <div className="flex items-center gap-1 md:gap-3 border-l border-white/20 pl-2 md:pl-4 ml-0 md:ml-1">
              <button
                onClick={prevSong}
                className="text-slate-300 hover:text-white transition hover:scale-110 p-1.5"
              >
                <FaStepBackward className="text-xs md:text-sm" />
              </button>
              <button
                onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                className="w-8 h-8 md:w-11 md:h-11 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition shadow-lg ring-4 ring-white/10 hover:ring-white/20"
              >
                {isMusicPlaying ? (
                  <FaPause className="text-[10px] md:text-xs" />
                ) : (
                  <FaPlay className="text-[10px] md:text-xs ml-0.5 md:ml-1" />
                )}
              </button>
              <button
                onClick={nextSong}
                className="text-slate-300 hover:text-white transition hover:scale-110 p-1.5"
              >
                <FaStepForward className="text-xs md:text-sm" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PomodoroFocusScreen;
