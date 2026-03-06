import React from "react";
import { motion } from "framer-motion";
import { BsStars } from "react-icons/bs";

const SuggestionWidget = ({ suggestedTasks }) => {
  return (
    <div className="bg-slate-900 p-5 md:p-6 rounded-3xl shadow-xl border border-slate-800 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-400 mb-5 relative z-10">
        <BsStars className="text-base" />
        Suggestion Focus
      </h3>

      {suggestedTasks.length === 0 ? (
        <div className="py-6 text-center relative z-10">
          <p className="text-slate-500 text-xs italic">
            Belum ada saran tugas mendesak saat ini.
          </p>
        </div>
      ) : (
        <div className="space-y-3 relative z-10">
          {suggestedTasks.map((task, index) => (
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              key={task.id}
              className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-200 truncate leading-tight mb-2.5">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2">
                    {task.finalScore > 0.7 && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-red-300 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-md shrink-0">
                        Score: {task.finalScore.toFixed(2)}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-medium">
                      📅 {task.date_deadline}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestionWidget;