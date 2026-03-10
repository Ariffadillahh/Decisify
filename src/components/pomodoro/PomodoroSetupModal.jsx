import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdTimer } from "react-icons/md";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import ThemeSelector from "./ThemeSelector";
import { StatusBadge, TimeBadge } from "../TaskBadge";

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
              <MdTimer className="text-[#007BFF] md:text-4xl" size={26} />
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
                      className="flex items-center gap-1.5 text-xs font-bold text-[#007BFF] hover:text-indigo-800 transition-colors bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md"
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

                <div className="overflow-y-auto space-y-2 p-1.5 max-h-[200px] md:max-h-[300px] custom-scrollbar border border-slate-100 rounded-2xl bg-slate-50/50 flex-1">
                  {availableTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center opacity-70">
                      {/* Tambahan Icon agar Empty State tidak membosankan */}
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-100">
                        <svg
                          className="w-6 h-6 text-slate-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-extrabold text-slate-500 mb-1">
                        Todo Kosong
                      </p>
                      <p className="text-xs text-slate-400">
                        Kamu bisa langsung mulai timer tanpa task.
                      </p>
                    </div>
                  ) : (
                    availableTasks.map((task) => (
                      <label
                        key={task.id}
                        className={`flex items-start gap-3 p-3.5 md:p-4 rounded-xl cursor-pointer transition-all duration-200 border group active:scale-[0.99] ${
                          selectedTaskIds.includes(task.id)
                            ? "bg-indigo-50/80 border-indigo-200 shadow-sm shadow-indigo-100/50"
                            : "bg-white border-transparent hover:border-slate-200 shadow-sm shadow-black/[0.03] hover:shadow-md hover:shadow-black/[0.05]"
                        }`}
                      >
                        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                          <input
                            type="checkbox"
                            checked={selectedTaskIds.includes(task.id)}
                            onChange={() => handleToggleTaskSelection(task.id)}
                            className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-[#007BFF] checked:border-[#007BFF] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer"
                          />
                          <svg
                            className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>

                        <div className="flex flex-col flex-1 min-w-0">
                          <span
                            className={`text-sm font-bold leading-tight truncate transition-colors ${
                              selectedTaskIds.includes(task.id)
                                ? "text-indigo-900"
                                : "text-slate-700 group-hover:text-slate-900"
                            }`}
                          >
                            {task.title}
                          </span>

                          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                            <TimeBadge date_deadline={task.date_deadline} />
                            <StatusBadge status={task.status} />
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
                        className="w-full mt-1 bg-transparent p-1 rounded-lg font-black text-[#007BFF] outline-none text-center text-xl md:text-3xl tabular-nums focus:ring-0 focus:border-0"
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
                className="flex-[2] bg-[#007BFF] hover:bg-indigo-700 transition py-3 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-lg text-white font-black shadow-xl shadow-indigo-200/50 active:scale-[0.98]"
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
