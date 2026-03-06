import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdTimer } from "react-icons/md";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
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

  const isAllSelected =
    availableTasks.length > 0 &&
    selectedTaskIds.length === availableTasks.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      selectedTaskIds.forEach((id) => handleToggleTaskSelection(id));
    } else {
      availableTasks.forEach((task) => {
        if (!selectedTaskIds.includes(task.id)) {
          handleToggleTaskSelection(task.id);
        }
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[60]"
          />

          <motion.div
            initial={{
              opacity: 0,
              y: 50,
              scale: 0.95,
              transformOrigin: "bottom right",
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-4 right-4 left-4 md:left-auto md:bottom-24 md:right-6 z-[70] w-auto md:w-[700px] bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto hide-scrollbar flex flex-col custom-scrollbar"
          >
            <h3 className="text-lg md:text-3xl font-black text-slate-900 mb-6 md:mb-8 tracking-tight flex items-center justify-between">
              <span>Pomodoro Setup</span>
              <MdTimer className="text-indigo-600 md:text-4xl" size={26} />
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 flex-1 min-h-0">
              <div className="flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <p className="text-[11px] md:text-sm font-black text-slate-400 uppercase tracking-widest">
                    Pilih Task 
                  </p>
                  {availableTasks.length > 0 && (
                    <button
                      onClick={handleToggleSelectAll}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md"
                    >
                      {isAllSelected ? (
                        <>
                          <FaCheckSquare /> <span>Batal Pilih</span>
                        </>
                      ) : (
                        <>
                          <FaRegSquare /> <span>Pilih Semua</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="overflow-y-auto space-y-2.5 p-1 max-h-[200px] md:max-h-[300px] custom-scrollbar border border-slate-100 rounded-2xl bg-slate-50/50 flex-1">
                  {availableTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <p className="text-sm font-bold text-slate-400 mb-1">
                        Todo Kosong
                      </p>
                      <p className="text-xs text-slate-400 italic">
                        Kamu bisa langsung mulai timer tanpa task.
                      </p>
                    </div>
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
                          className="mt-1 rounded text-indigo-600 focus:ring-indigo-500 w-4.5 h-4.5 md:w-5 md:h-5 shrink-0 cursor-pointer border-slate-200"
                        />
                        <div className="flex flex-col flex-1 truncate">
                          <span className="text-xs md:text-sm font-semibold text-slate-900 leading-snug truncate group-hover:text-indigo-950">
                            {task.title}
                          </span>
                          <div className="flex items-center gap-2 mt-1.5 shrink-0 opacity-70">
                            <span className="text-[9px] md:text-[10px] font-black uppercase text-indigo-400 bg-indigo-100/50 px-1.5 py-0.5 rounded shadow-inner">
                              Sc: {task.finalScore.toFixed(4)}
                            </span>
                            <span className="text-[9px] md:text-[10px] text-slate-400">
                              📅 {task.date_deadline}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-6 order-1 md:order-2">
                <div>
                  <p className="text-[11px] md:text-sm font-black text-slate-400 uppercase tracking-widest mb-3 text-left">
                    Pengaturan Sesi
                  </p>
                  <div className="grid grid-cols-3 gap-2 md:gap-3 shrink-0">
                    <div className="bg-slate-50 border border-slate-100 p-2 md:p-3 rounded-2xl">
                      <label className="text-[9px] md:text-[8.5px] font-bold text-slate-400 uppercase tracking-widest text-center block">
                        Fokus (Mnt)
                      </label>
                      <input
                        type="number"
                        value={focusDuration}
                        onChange={(e) =>
                          setFocusDuration(parseInt(e.target.value) || 0)
                        }
                        min="1"
                        className="w-full mt-1 bg-transparent p-1 rounded-lg font-black text-indigo-600 outline-none text-center text-xl md:text-3xl tabular-nums focus:ring-0 focus:border-0"
                      />
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-2 md:p-3 rounded-2xl">
                      <label className="text-[9px] md:text-[8.5px] font-bold text-slate-400 uppercase tracking-widest text-center block">
                        Rest (Mnt)
                      </label>
                      <input
                        type="number"
                        value={breakDuration}
                        onChange={(e) =>
                          setBreakDuration(parseInt(e.target.value) || 0)
                        }
                        min="1"
                        className="w-full mt-1 bg-transparent p-1 rounded-lg font-black text-emerald-600 outline-none text-center text-xl md:text-3xl tabular-nums focus:ring-0 focus:border-0"
                      />
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-2 md:p-3 rounded-2xl">
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
                        className="w-full mt-1 bg-transparent p-1 rounded-lg font-black text-amber-600 outline-none text-center text-xl md:text-3xl tabular-nums focus:ring-0 focus:border-0"
                      />
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex-1">
                  <p className="text-[11px] md:text-sm font-black text-slate-400 uppercase tracking-widest mb-3 text-center md:text-left">
                    Tema Visual
                  </p>
                  <div className="md:flex md:justify-start">
                    <ThemeSelector theme={theme} setTheme={setTheme} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 shrink-0 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-100">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 transition py-3 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-lg font-bold text-slate-600 active:scale-[0.98]"
              >
                Batal
              </button>
              <button
                onClick={handleStartFocus}
                className="flex-[2] bg-indigo-600 hover:bg-indigo-700 transition py-3 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-lg text-white font-black shadow-xl shadow-indigo-200/50 active:scale-[0.98]"
              >
                Mulai Sesi Fokus
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PomodoroSetupModal;
