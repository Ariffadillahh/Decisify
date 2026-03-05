import React from "react";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaCompactDisc,
} from "react-icons/fa";
import { PLAYLIST } from "../../hooks/usePomodoro";

const MusicPlayerWidget = ({
  isMusicPlaying,
  setIsMusicPlaying,
  currentSongIndex,
  prevSong,
  nextSong,
}) => {
  return (
    <div className="absolute bottom-4 right-0 md:bottom-10 md:right-10 flex items-center gap-2 md:gap-4 bg-black/50 backdrop-blur-xl p-2 pr-4 md:p-3 md:pr-5 rounded-full border border-white/10 shadow-2xl transition-all hover:bg-black/70 scale-90 sm:scale-100 origin-bottom-left z-50">
      <div
        className={`w-10 h-10 md:w-14 md:h-14 rounded-full bg-slate-900 border-[3px] md:border-4 border-slate-700 flex items-center justify-center shadow-inner relative ${
          isMusicPlaying ? "animate-[spin_4s_linear_infinite]" : ""
        }`}
      >
        <FaCompactDisc className="text-slate-500 opacity-50 text-2xl md:text-4xl" />
        <div className="absolute w-2.5 h-2.5 md:w-4 md:h-4 bg-red-500 rounded-full border-2 border-slate-800 shadow"></div>
      </div>

      <div className="flex flex-col w-20 md:w-28 truncate">
        <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-indigo-300">
          Now Playing
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
  );
};

export default MusicPlayerWidget;
