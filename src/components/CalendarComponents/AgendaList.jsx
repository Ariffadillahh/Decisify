import React from "react";
import { BsCalendarEvent, BsArrowRight } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { MONTH_NAMES, TASK_COLORS } from "../../helpers/calendarUtils";

const AgendaList = ({ selectedDate, tasks, onTaskClick }) => {
  const activeTasks = tasks.filter((task) => !task.done);

  return (
    <div className="flex-1 w-full bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-slate-100 min-h-[500px]">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
            {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getDate()},{" "}
            {selectedDate.getFullYear()}
          </h2>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Agenda & Tugas yang belum diselesaikan
          </p>
        </div>
        <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-inner">
          <BsCalendarEvent />
          <span>{activeTasks.length} Tasks</span>
        </div>
      </div>

      <div className="space-y-4">
        {activeTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <BsCalendarEvent className="text-3xl text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-600">
              Tidak ada agenda tersisa
            </h3>
            <p className="text-slate-400 text-sm">
              Hebat! Semua tugas di hari ini sudah selesai atau tidak ada
              jadwal.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {activeTasks.map((task, index) => {
              const theme = TASK_COLORS[index % TASK_COLORS.length];

              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className={`group p-4 md:p-5 rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${theme.bg} ${theme.border} ${theme.hoverBorder}`}
                >
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex flex-col">
                      <h3
                        className={`font-bold text-base md:text-lg mb-2 leading-tight ${theme.title}`}
                      >
                        {task.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {task.finalScore > 0.7 && (
                          <span className="flex items-center gap-1 bg-red-100/90 text-red-700 border-red-200 border text-[10px] md:text-xs font-black uppercase tracking-widest px-2 py-1 rounded-lg">
                            <span>🔥</span> Hampir Telat
                          </span>
                        )}

                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest bg-white/60 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-sm">
                          Status: {task.status}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 w-8 h-8 rounded-full bg-white/50 border border-white/60 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <BsArrowRight className={`text-lg ${theme.title}`} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default AgendaList;
