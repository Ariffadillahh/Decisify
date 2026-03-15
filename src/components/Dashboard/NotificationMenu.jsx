import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell } from "react-icons/fi";
import { ScoreBadge } from "../TaskBadge";

const NotificationMenu = ({
  urgentTasks,
  isNotifOpen,
  setIsNotifOpen,
  navigate,
}) => {
  const getBadgeConfig = (diffDays) => {
    if (diffDays < 0)
      return {
        text: `Telat ${Math.abs(diffDays)} Hari`,
        style: "bg-red-50 text-red-600 border-red-200",
      };
    if (diffDays === 0)
      return {
        text: "Hari Ini",
        style: "bg-orange-50 text-orange-600 border-orange-200",
      };
    return { text: "Besok", style: "bg-blue-50 text-blue-600 border-blue-200" };
  };

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setIsNotifOpen(!isNotifOpen)}
        className={`transition-colors p-2 md:p-2.5 rounded-full relative ${isNotifOpen ? "bg-blue-50 text-[#007BFF]" : "text-slate-500 hover:text-[#007BFF] hover:bg-blue-50"}`}
      >
        <FiBell size={22} />
        {urgentTasks.length > 0 && (
          <span className="absolute top-1 right-1.5 md:top-1.5 md:right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>

      <AnimatePresence>
        {isNotifOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed inset-x-4 top-20 sm:absolute sm:inset-x-auto sm:right-0 sm:top-14 sm:w-80 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 z-[100] overflow-hidden flex flex-col"
          >
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">
                  Perlu Perhatian
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Tenggat Waktu Mendesak
                </p>
              </div>
              {urgentTasks.length > 0 && (
                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {urgentTasks.length} Tugas
                </span>
              )}
            </div>

            <div className="max-h-[60vh] sm:max-h-[350px] overflow-y-auto p-2 scrollbar-hide">
              {urgentTasks.length > 0 ? (
                urgentTasks.map((task) => {
                  const badge = getBadgeConfig(task.diffDays);
                  return (
                    <div
                      key={task.id}
                      onClick={() => {
                        if (task.date_deadline)
                          //   navigate(
                          //     `/calendar?date=${task.date_deadline.split("T")[0]}`,
                          //   );
                          navigate("/tasks");
                        setIsNotifOpen(false);
                      }}
                      className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer mb-1 group"
                    >
                      <p className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-[#007BFF] transition-colors">
                        {task.title}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex gap-1 items-center">
                          <ScoreBadge finalScore={task.finalScore} />
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badge.style}`}
                          >
                            {badge.text}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-semibold truncate max-w-[120px]">
                          {task.categoryName || "Tanpa Kategori"}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-6 py-10 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3">
                    <FiBell size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-600">
                    Kerja Bagus!
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Tidak ada tugas yang mendesak atau terlewat.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationMenu;
