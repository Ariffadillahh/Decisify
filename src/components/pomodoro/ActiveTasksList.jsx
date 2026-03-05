import React from "react";
import { FaCheck } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { BsCalendarDate } from "react-icons/bs";

const ActiveTasksList = ({
  activeTasks,
  showTasksMobile,
  setShowTasksMobile,
  handleMarkTaskDone,
  isFinished,
}) => {
  // Fungsi Helper dipindah ke sini karena hanya dipakai di daftar ini
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

  // Jangan render jika sesi sudah selesai atau tidak ada tugas
  if (isFinished || activeTasks.length === 0) return null;

  return (
    <>
      {/* TOMBOL TOGGLE TASK (Mobile) */}
      <div className="absolute top-20 z-50 md:hidden flex justify-center w-full">
        <button
          onClick={() => setShowTasksMobile(!showTasksMobile)}
          className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white px-5 py-2.5 rounded-full border border-white/20 text-xs font-bold tracking-widest shadow-xl flex items-center gap-2 transition-all active:scale-95"
        >
          {showTasksMobile ? "Sembunyikan Tugas" : "Lihat Tugas Sesi Ini"}
          {!showTasksMobile && (
            <span className="bg-indigo-600 px-2 py-0.5 rounded-full text-[10px]">
              {activeTasks.filter((t) => t.done).length}/{activeTasks.length}
            </span>
          )}
        </button>
      </div>

      {/* KOTAK TARGET SESI DI KIRI */}
      <div
        className={`absolute left-4 md:left-10 top-36 md:top-1/2 md:-translate-y-1/2 z-40 bg-black/50 md:bg-black/40 backdrop-blur-xl p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl w-[calc(100%-2rem)] md:w-80 max-h-[50vh] md:max-h-[70vh] flex flex-col transition-all duration-500 origin-top
        ${showTasksMobile ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95 md:opacity-100 md:visible md:scale-100"}`}
      >
        <h3 className="text-white font-bold mb-3 md:mb-5 uppercase tracking-widest text-xs md:text-sm flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 md:gap-3">
            <span>Target Sesi</span>
            <span className="bg-indigo-600 px-2.5 py-1 rounded-full text-[10px] tabular-nums shadow-inner shadow-black/30">
              {activeTasks.filter((t) => t.done).length}/{activeTasks.length}
            </span>
          </div>
          <button
            onClick={() => setShowTasksMobile(false)}
            className="md:hidden text-white/50 hover:text-white p-1"
          >
            <MdOutlineClose size={20} />
          </button>
        </h3>

        <div className="overflow-y-auto space-y-2.5 md:space-y-3.5 pr-1 flex-1 hide-scrollbar">
          {activeTasks.map((task) => {
            const timeLeftString = getTimeRemaining(task.date_deadline);
            const isOverdue = timeLeftString === "Telah Berakhir";

            return (
              <label
                key={task.id}
                className={`flex items-start gap-3.5 p-3.5 md:p-5 rounded-2xl border transition-all duration-500 cursor-pointer group shadow-lg ${
                  task.done
                    ? "bg-black/20 border-white/5 opacity-50 grayscale shadow-black/20"
                    : "bg-white/10 border-white/15 hover:bg-white/20 hover:scale-[1.02] shadow-white/5 hover:border-white/30"
                }`}
              >
                <div className="relative flex items-center justify-center mt-1 shrink-0">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => handleMarkTaskDone(task)}
                    className="peer appearance-none w-5 h-5 md:w-6 md:h-6 border-2 border-white/30 rounded-lg checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer ring-offset-black checked:ring-2 checked:ring-emerald-300"
                  />
                  <FaCheck className="absolute text-white opacity-0 peer-checked:opacity-100 text-[10px] md:text-xs pointer-events-none transition-opacity" />
                </div>

                <div className="flex flex-col flex-1">
                  <span
                    className={`text-white text-xs md:text-base font-semibold transition-all duration-300 leading-snug ${task.done ? "line-through text-slate-400 opacity-60" : ""}`}
                  >
                    {task.title}
                  </span>

                  <div className="flex items-center gap-3 mt-1.5 opacity-70">
                    {task.finalScore > 0.7 ? (
                      <span className="text-[10px] md:text-[11px] text-red-300 font-black uppercase tracking-widest bg-red-950/50 px-2 py-0.5 rounded shadow-inner">
                        URGENT
                      </span>
                    ) : null}
                  </div>

                  <p
                    className={`text-[10px] md:text-[11px] flex items-center gap-1.5 mt-1.5 font-medium ${isOverdue && !task.done ? "text-red-400" : "text-slate-300"}`}
                  >
                    <BsCalendarDate
                      className={
                        isOverdue && !task.done
                          ? "text-red-400"
                          : "text-slate-400"
                      }
                    />
                    <span>
                      {task.date_deadline}
                      {!task.done && (
                        <span className="opacity-70 ml-1 italic">
                          ({timeLeftString})
                        </span>
                      )}
                    </span>
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ActiveTasksList;
