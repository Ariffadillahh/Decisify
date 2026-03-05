import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdTimer } from "react-icons/md";
import ThemeSelector from "./ThemeSelector";

const PomodoroSetupModal = ({
  pomodoro,
  availableTasks,
  selectedTaskIds,
  handleToggleTaskSelection,
  handleStartFocus,
}) => {
  const {
    isOpen,
    setIsOpen,
    focusDuration,
    setFocusDuration,
    breakDuration,
    setBreakDuration,
    totalSessions,
    setTotalSessions,
    theme,
    setTheme,
  } = pomodoro;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-4 right-4 md:bottom-24 md:right-6 z-[70] w-[calc(100%-2rem)] max-w-sm md:w-[360px] bg-white p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto hide-scrollbar flex flex-col custom-scrollbar"
        >
          <h3 className="text-lg md:text-2xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight flex items-center justify-between">
            <span>Pomodoro Setup</span>
            <MdTimer className="text-indigo-600" size={26} />
          </h3>

          {/* Custom Waktu dan Sesi */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-5 md:mb-6 shrink-0">
            <div className="bg-slate-50 border border-slate-100 p-2 rounded-2xl">
              <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center block">
                Fokus (Mnt)
              </label>
              <input
                type="number"
                value={focusDuration}
                onChange={(e) =>
                  setFocusDuration(parseInt(e.target.value) || 0)
                }
                min="1"
                className="w-full mt-1 bg-transparent p-1 rounded-lg font-black text-indigo-600 outline-none text-center text-xl md:text-2xl tabular-nums focus:ring-0 focus:border-0"
              />
            </div>
            <div className="bg-slate-50 border border-slate-100 p-2 rounded-2xl">
              <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center block">
                Rest (Mnt)
              </label>
              <input
                type="number"
                value={breakDuration}
                onChange={(e) =>
                  setBreakDuration(parseInt(e.target.value) || 0)
                }
                min="1"
                className="w-full mt-1 bg-transparent p-1 rounded-lg font-black text-emerald-600 outline-none text-center text-xl md:text-2xl tabular-nums focus:ring-0 focus:border-0"
              />
            </div>
            <div className="bg-slate-50 border border-slate-100 p-2 rounded-2xl">
              <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center block">
                Sesi
              </label>
              <input
                type="number"
                value={totalSessions}
                onChange={(e) =>
                  setTotalSessions(parseInt(e.target.value) || 1)
                }
                min="1"
                className="w-full mt-1 bg-transparent p-1 rounded-lg font-black text-amber-600 outline-none text-center text-xl md:text-2xl tabular-nums focus:ring-0 focus:border-0"
              />
            </div>
          </div>

          {/* Pilih Task (Checklist) */}
          <div className="mb-5 md:mb-6 flex-1 min-h-0 flex flex-col">
            <p className="text-[11px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5 text-left shrink-0">
              Pilih Task (Checklist)
            </p>
            <div className="overflow-y-auto space-y-2.5 p-1 max-h-[180px] custom-scrollbar border border-slate-100 rounded-2xl bg-slate-50/50">
              {availableTasks.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-4 text-center bg-white rounded-lg border">
                  Belum ada tugas di papan Kanban.
                </p>
              ) : (
                availableTasks.map((task) => (
                  <label
                    key={task.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all border group ${
                      selectedTaskIds.includes(task.id)
                        ? "bg-indigo-50 border-indigo-200 shadow-sm shadow-indigo-100"
                        : "bg-white border-white hover:bg-slate-50 hover:border-slate-100 shadow shadow-black/5 hover:shadow-black/10"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTaskIds.includes(task.id)}
                      onChange={() => handleToggleTaskSelection(task.id)}
                      className="mt-1 rounded text-indigo-600 focus:ring-indigo-500 w-4.5 h-4.5 shrink-0 cursor-pointer border-slate-200"
                    />
                    <div className="flex flex-col flex-1 truncate">
                      <span className="text-xs md:text-sm font-semibold text-slate-900 leading-snug truncate group-hover:text-indigo-950">
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 mt-1 shrink-0 opacity-70">
                        <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-100/50 px-1.5 py-0.5 rounded shadow-inner">
                          Sc: {task.finalScore.toFixed(4)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          📅 {task.date_deadline}
                        </span>
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Tema Background */}
          <div className="mb-6 md:mb-8 shrink-0">
            <p className="text-[11px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-3 md:mb-4 text-center">
              Atur Tema Background
            </p>
            <ThemeSelector theme={theme} setTheme={setTheme} />
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-slate-100 hover:bg-slate-200 transition py-3 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-base font-bold text-slate-600 active:scale-[0.98]"
            >
              Batal
            </button>
            <button
              onClick={handleStartFocus}
              className="flex-[2] bg-indigo-600 hover:bg-indigo-700 transition py-3 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-base text-white font-black shadow-xl shadow-indigo-200/50 active:scale-[0.98]"
            >
              Mulai Sesi
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PomodoroSetupModal;
