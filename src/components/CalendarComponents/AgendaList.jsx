import React, { useState } from "react";
import { FiPlus, FiClock, FiArrowUpCircle } from "react-icons/fi";
import { BsCalendarEvent, BsTrash } from "react-icons/bs";
import { motion } from "framer-motion";
import { CategoryBadge, ScoreBadge } from "../TaskBadge";
import ConfirmDeleteModal from "../Modal/ConfirmDeleteModal";
import { db } from "../../services/db";

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
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Ags",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

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
    if (dateString.includes("T"))
      return dateString.split("T")[1].substring(0, 5);
    if (dateString.includes(" "))
      return dateString.split(" ")[1].substring(0, 5);
    return "23:59";
  };

  const getUrgencyBorder = (score = 0) => {
    if (score >= 1) return "border-[#ef4444]";
    if (score > 0.7) return "border-[#f59e0b]";
    return "border-[#007BFF]";
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setTaskToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      onDeleteTask(taskToDelete);
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
      <div className="flex-1 w-full bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 font-sans">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
            Jadwal & Tenggat
          </h2>
          <button
            className="bg-[#007BFF] hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 transition-colors shadow-sm shadow-blue-500/30 shrink-0"
            onClick={() => onTaskClick(null)}
          >
            <FiPlus size={16} /> Tambah
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span
                className={`text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider ${isToday ? "bg-[#1c2331]" : "bg-[#007BFF]"}`}
              >
                {isToday ? "HARI INI" : "TERPILIH"}
              </span>
              <h3 className="font-extrabold text-slate-900">
                {formattedDateString}
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              {activeTasks.length === 0 ? (
                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 text-center flex flex-col items-center justify-center">
                  <BsCalendarEvent className="text-3xl text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500 font-medium">
                    Tidak ada agenda untuk tanggal ini
                  </p>
                </div>
              ) : (
                activeTasks.map((task, index) => {
                  const time = extractTime(task.date_deadline);
                  const score = task.finalScore || 0;
                  const borderColor = getUrgencyBorder(score);

                  const deadlineTime = new Date(task.date_deadline).getTime();
                  const diffDays = Math.ceil(
                    (deadlineTime - now) / (1000 * 60 * 60 * 24),
                  );

                  const isHiddenFromKanban =
                    task.status === "Backlog" &&
                    diffDays > 7 &&
                    score <= 0.7 &&
                    !task.forceShow;

                  return (
                    <div
                      key={task.id || index}
                      onClick={() => onTaskClick(task)}
                      className={`group flex items-center justify-between pl-4 border-l-[4px] cursor-pointer hover:bg-slate-50 py-3 rounded-r-xl transition-colors ${borderColor}`}
                    >
                      <div className="flex flex-col gap-1.5">
                        <h4 className="font-bold text-slate-900 text-base leading-none">
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                          <FiClock size={12} /> {time}
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <ScoreBadge finalScore={score} />
                        <CategoryBadge category={task.categoryName} />
                        {isHiddenFromKanban && (
                          <div className="relative flex items-center justify-center group/force">
                            <button
                              onClick={(e) => handleForceToBacklog(e, task)}
                              className="text-slate-400 hover:text-[#007BFF] transition-colors p-1.5 rounded-full hover:bg-blue-50"
                            >
                              <FiArrowUpCircle size={18} />
                            </button>

                            <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover/force:opacity-100 group-hover/force:visible transition-all duration-200 z-50 pointer-events-none translate-y-1 group-hover/force:translate-y-0">
                              <div className="bg-[#007BFF] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-md shadow-md whitespace-nowrap">
                                Tampilkan di Kanban
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[4px] border-x-transparent border-t-[4px] border-t-[#007BFF]"></div>
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

          <div className="bg-[#f0f7ff] rounded-3xl p-6 mt-10 border border-blue-50">
            <h3 className="text-[#007BFF] font-black tracking-widest text-[11px] mb-5 uppercase">
              Semua Tugas
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-[13px] font-extrabold text-slate-900 mb-2">
                  <span>Tugas Selesai</span>
                  <span>
                    {completedTasksCount} / {totalTasksCount}
                  </span>
                </div>
                <div className="w-full bg-[#e1edff] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#10b981] h-2 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
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
