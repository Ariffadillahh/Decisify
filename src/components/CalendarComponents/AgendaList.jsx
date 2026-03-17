import React, { useState } from "react";
import { FiPlus, FiClock, FiArrowUpCircle } from "react-icons/fi";
import { BsCalendarEvent, BsTrash } from "react-icons/bs";
import { motion } from "framer-motion";
import { CategoryBadge, ScoreBadge } from "../TaskBadge";
import { db } from "../../services/db";
import ConfirmModal from "../Modal/ConfirmModal";

const AnimatedDeleteButton = ({ onClick }) => {
  return (
    <div className="relative flex items-center justify-center group/delete">
      <motion.button
        initial="rest"
        whileHover="hover"
        animate="rest"
        onClick={onClick}
        className="relative w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-red-50 transition-colors opacity-100 md:opacity-0 md:translate-x-4 md:group-hover:translate-x-0 md:group-hover:opacity-100 duration-300 shrink-0 shadow-sm border border-slate-100 hover:border-red-100"
      >
        <div className="relative w-[14px] h-[14px]">
          <BsTrash
            className="absolute inset-0 text-slate-400 group-hover/delete:text-red-400 transition-colors duration-300"
            size={14}
          />
          <motion.div
            variants={{
              rest: { clipPath: "inset(100% 0% 0% 0%)" },
              hover: { clipPath: "inset(0% 0% 0% 0%)" },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 text-red-500"
          >
            <BsTrash size={14} className="fill-current" />
          </motion.div>
        </div>
      </motion.button>

      <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover/delete:opacity-100 group-hover/delete:visible transition-all duration-200 z-50 pointer-events-none translate-y-1 group-hover/delete:translate-y-0">
        <div className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-md shadow-md whitespace-nowrap">
          Hapus Tugas
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[4px] border-x-transparent border-t-[4px] border-t-red-500"></div>
        </div>
      </div>
    </div>
  );
};

const AgendaList = ({
  selectedDate,
  tasks = [],
  allTasks = [],
  onTaskClick,
  onDeleteTask,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const activeTasks = tasks.filter(
    (task) => !task.done && task.status !== "Done",
  );

  const totalTasksCount = allTasks.length;
  const completedTasksCount = allTasks.filter(
    (task) => task.done || task.status === "Done",
  ).length;

  const progressPercentage =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;

  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

  const dayName = days[selectedDate.getDay()];
  const dateNum = selectedDate.getDate();
  const monthName = months[selectedDate.getMonth()];
  const yearNum = selectedDate.getFullYear();
  const formattedDateString = `${dayName}, ${dateNum} ${monthName} ${yearNum}`;

  const today = new Date();
  const isToday =
    selectedDate.getDate() === today.getDate() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear();

  const extractTime = (dateString) => {
    if (!dateString) return "23:59";
    if (dateString.includes("T")) return dateString.split("T")[1].substring(0, 5);
    if (dateString.includes(" ")) return dateString.split(" ")[1].substring(0, 5);
    return "23:59";
  };

  const getUrgencyBorder = (score = 0) => {
    if (score >= 1) return "border-red-500";
    if (score > 0.7) return "border-amber-400";
    return "border-blue-500";
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setTaskToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      const fakeEvent = { 
        stopPropagation: () => {}, 
        preventDefault: () => {} 
      };
      
      onDeleteTask(fakeEvent, taskToDelete);
    }
    setDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleForceToBacklog = async (e, task) => {
    e.stopPropagation();
    try {
      await db.tasks.update(task.id, { forceShow: true });
      window.dispatchEvent(new Event("tasks_updated"));
    } catch (error) {
      console.error("Gagal menampilkan ke Kanban", error);
    }
  };

  const now = new Date().getTime();

  return (
    <>
      <div className="flex-1 w-full max-w-full lg:max-w-md bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-100 font-sans lg:sticky lg:top-8 h-fit self-start">
        
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Jadwal & Tenggat
          </h2>
          <button
            className="bg-[#007BFF] hover:bg-blue-600 text-white p-2 md:px-4 md:py-2 rounded-full md:rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-blue-500/20 shrink-0"
            onClick={() => onTaskClick(null)}
            title="Tambah Tugas"
          >
            <FiPlus size={18} />
            <span className="hidden md:inline">Tambah</span>
          </button>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4 md:mb-5">
              <span
                className={`text-white text-[9px] md:text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider shadow-sm ${
                  isToday ? "bg-slate-800" : "bg-[#007BFF]"
                }`}
              >
                {isToday ? "HARI INI" : "TERPILIH"}
              </span>
              <h3 className="font-bold text-slate-800 text-sm md:text-base">
                {formattedDateString}
              </h3>
            </div>

            <div className="flex flex-col gap-3 md:gap-4">
              {activeTasks.length === 0 ? (
                <div className="bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-2xl py-10 text-center flex flex-col items-center justify-center">
                  <BsCalendarEvent className="text-3xl text-slate-200 mb-2" />
                  <p className="text-xs md:text-sm text-slate-400 font-medium">
                    Tidak ada agenda untuk tanggal ini
                  </p>
                </div>
              ) : (
                activeTasks.map((task, index) => {
                  const time = extractTime(task.date_deadline);
                  const score = task.finalScore || 0;
                  const borderColor = getUrgencyBorder(score);
                  const deadlineTime = new Date(task.date_deadline).getTime();
                  const diffDays = Math.ceil((deadlineTime - now) / (1000 * 60 * 60 * 24));

                  const isHiddenFromKanban =
                    task.status === "Backlog" &&
                    diffDays > 7 &&
                    score <= 0.7 &&
                    !task.forceShow;

                  return (
                    <div
                      key={task.id || index}
                      onClick={() => onTaskClick(task)}
                      className={`group flex items-center justify-between pl-4 pr-3 border-l-[4px] cursor-pointer hover:bg-blue-50/40 py-3 md:py-4 rounded-r-xl transition-all duration-200 ${borderColor} hover:shadow-sm`}
                    >
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900 text-sm md:text-base truncate pr-2">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-3">
                          <p className="text-[11px] text-slate-500 flex items-center gap-1.5 font-semibold">
                            <FiClock size={12} className="text-[#007BFF]" /> {time}
                          </p>
                          <div className="scale-90 origin-left hidden sm:block">
                            <CategoryBadge category={task.categoryName} />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <ScoreBadge finalScore={score} />
                        
                        {isHiddenFromKanban && (
                          <div className="relative flex items-center justify-center group/force">
                            <button
                              onClick={(e) => handleForceToBacklog(e, task)}
                              className="text-slate-300 hover:text-[#007BFF] transition-colors p-1.5 rounded-full hover:bg-blue-50"
                            >
                              <FiArrowUpCircle size={18} />
                            </button>
                            <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover/force:opacity-100 group-hover/force:visible transition-all duration-200 z-50 pointer-events-none">
                              <div className="bg-[#007BFF] text-white text-[9px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
                                Tampilkan di Kanban
                              </div>
                            </div>
                          </div>
                        )}

                        <AnimatedDeleteButton
                          onClick={(e) => handleDeleteClick(e, task.id)}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-[#f8fbff] rounded-2xl p-5 border border-blue-50/50 mt-4">
            <div className="flex justify-between items-end mb-3">
              <div>
                <h3 className="text-[#007BFF] font-black tracking-widest text-[10px] uppercase mb-1">
                  Semua Tugas
                </h3>
                <p className="text-slate-900 font-extrabold text-sm md:text-base">Tugas Selesai</p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-100/50 px-2 py-1 rounded-lg">
                {completedTasksCount} / {totalTasksCount}
              </span>
            </div>
            <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#10b981] h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default AgendaList;