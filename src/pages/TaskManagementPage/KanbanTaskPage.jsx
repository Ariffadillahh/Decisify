import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useTasks } from "../../hooks/useTasks";
import TaskLayouts from "./TaskLayouts";
import TaskModal from "./TaskModal";
import { ScoreBadge, CategoryBadge } from "../../components/TaskBadge";

import { FiPlus, FiCornerUpLeft } from "react-icons/fi";
import { db } from "../../services/db";
import { BsTrash } from "react-icons/bs";
import ConfirmModal from "../../components/Modal/ConfirmModal";

const columns = ["Backlog", "Todo", "Doing", "Done"];

const columnAccent = {
  Backlog: {
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-500",
    label: "text-slate-500",
    drag: "bg-slate-50",
  },
  Todo: {
    dot: "bg-blue-400",
    badge: "bg-blue-50 text-blue-600",
    label: "text-blue-500",
    drag: "bg-blue-50/40",
  },
  Doing: {
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-600",
    label: "text-amber-500",
    drag: "bg-amber-50/40",
  },
  Done: {
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-600",
    label: "text-emerald-500",
    drag: "bg-emerald-50/40",
  },
};

const getRelativeTimeString = (dateString) => {
  if (!dateString) return { text: "No Date", color: "text-slate-400" };

  const deadline = new Date(dateString);
  const now = new Date();

  const deadlineDate = new Date(deadline.setHours(0, 0, 0, 0));
  const todayDate = new Date(now.setHours(0, 0, 0, 0));

  const diffTime = deadlineDate - todayDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: "Terlewat", color: "text-red-600" };
  if (diffDays === 0)
    return { text: "Hari Ini", color: "text-red-500 font-bold" };
  if (diffDays === 1)
    return { text: "Besok", color: "text-orange-500 font-bold" };
  if (diffDays <= 3)
    return { text: `${diffDays} hari lagi`, color: "text-blue-500 font-bold" };

  const options = { day: "numeric", month: "short" };
  return {
    text: new Date(dateString).toLocaleDateString("id-ID", options),
    color: "text-slate-500",
  };
};

const extractTime = (dateString) => {
  if (!dateString) return "23:59";
  if (dateString.includes("T")) return dateString.split("T")[1].substring(0, 5);
  if (dateString.includes(" ")) return dateString.split(" ")[1].substring(0, 5);
  return "23:59";
};

const KanbanTaskPage = () => {
  const {
    tasks,
    openModal,
    onDragEnd,
    handleDelete,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    formData,
    handleChange,
    handleSubmit,
    fetchTasks,
  } = useTasks();

  const [screenSize, setScreenSize] = useState("mobile");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) setScreenSize("mobile");
      else if (w < 1024) setScreenSize("tablet");
      else setScreenSize("desktop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenSize === "mobile";
  const isTablet = screenSize === "tablet";

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setTaskToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      const fakeEvent = { stopPropagation: () => {} };
      handleDelete(fakeEvent, taskToDelete);
    }
    setDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleMoveToBacklog = async (e, task) => {
    e.stopPropagation();
    try {
      await db.tasks.update(task.id, {
        status: "Backlog",
        done: false,
        completedAt: null,
      });
      fetchTasks();
      window.dispatchEvent(new Event("tasks_updated"));
    } catch (error) {
      console.error("Gagal memindah tugas", error);
    }
  };

  const renderTaskCard = (task, provided, snapshot) => {
    const timeInfo = getRelativeTimeString(task.date_deadline);
    const clockTime = extractTime(task.date_deadline);

    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={provided.draggableProps.style}
        onClick={() => openModal(task)}
        className={`group bg-white rounded-[1.25rem] border border-slate-100 p-4 transition-all duration-200 cursor-pointer relative shrink-0
          ${isMobile ? "w-[280px]" : "w-full"} 
          ${snapshot.isDragging ? "rotate-2 shadow-2xl ring-2 ring-indigo-400 scale-[1.02] z-50" : "shadow-sm hover:shadow-md hover:border-slate-200"} 
          ${task.done ? "opacity-60 bg-slate-50" : ""}
        `}
      >
        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all z-10 backdrop-blur-sm rounded-md px-1.5 py-1 bg-white">
          {task.done && (
            <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center h-fit">
              Done
            </span>
          )}

          {task.status !== "Backlog" && (
            <button
              onClick={(e) => handleMoveToBacklog(e, task)}
              className="flex items-center justify-center text-slate-400 hover:text-indigo-500 p-1 transition-colors"
              title="Kembalikan ke Backlog"
            >
              <FiCornerUpLeft size={14} />
            </button>
          )}

          <button
            onClick={(e) => handleDeleteClick(e, task.id)}
            className="flex items-center justify-center text-slate-400 hover:text-red-500 p-1 transition-colors"
            title="Hapus Tugas"
          >
            <BsTrash size={13} />
          </button>
        </div>

        {!task.done && (
          <div className="mb-3">
            <ScoreBadge finalScore={task.finalScore} />
          </div>
        )}

        <div className="mb-4 pr-6">
          <h4
            className={`text-sm md:text-[15px] truncate font-bold text-slate-800 leading-snug tracking-tight ${task.done ? "line-through text-slate-400" : ""}`}
          >
            {task.title}
          </h4>
        </div>

        <CategoryBadge category={task.categoryName} />

        <div className="flex items-center justify-between text-[11px] mt-3">
          <span className={`font-semibold ${timeInfo.color}`}>
            {timeInfo.text}
          </span>

          <span className="text-slate-400 font-medium">{clockTime} WIB</span>
        </div>
      </div>
    );
  };

  return (
    <TaskLayouts>
      <div className="min-h-screen font-sans text-slate-900 w-full flex flex-col py-2 md:py-6 pb-24 md:pb-6 px-0 md:px-6 relative">
        <div className="flex justify-between items-center ml-3 md:ml-10 mb-6 mt-2 pr-4 md:pr-0">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800">
              Kanban Board
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Kelola dan pantau progres tugas Anda.
            </p>
          </div>
          <button
            onClick={() => openModal(null)}
            className="flex items-center gap-2 bg-[#007BFF] hover:bg-blue-600 text-white px-4 md:px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <FiPlus size={18} />
            <span className="hidden sm:block">Buat Tugas</span>
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          {isMobile && (
            <div className="flex flex-col gap-5 px-3">
              {columns.map((col) => {
                const accent = columnAccent[col];
                const colTasks = tasks.filter((t) => t.status === col);

                return (
                  <div key={col} className="flex flex-col">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${accent.dot}`}
                        />
                        <h2
                          className={`font-bold uppercase text-[11px] tracking-widest ${accent.label}`}
                        >
                          {col}
                        </h2>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${accent.badge}`}
                        >
                          {colTasks.length}
                        </span>
                      </div>
                    </div>

                    <Droppable droppableId={col} direction="horizontal">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex gap-3 overflow-x-auto pb-4 px-1 min-h-[160px] rounded-xl hide-scrollbar snap-x ${
                            snapshot.isDraggingOver ? accent.drag : ""
                          }`}
                        >
                          {colTasks.length === 0 &&
                            !snapshot.isDraggingOver && (
                              <div className="flex items-center justify-center w-full text-slate-300 text-xs font-medium select-none border-2 border-dashed border-slate-200 rounded-[1.25rem]">
                                Kosong
                              </div>
                            )}

                          {colTasks.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) =>
                                renderTaskCard(task, provided, snapshot)
                              }
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── DESKTOP & TABLET: Grid Layout ── */}
          {!isMobile && (
            <div
              className={`grid gap-5 items-start ml-4 md:ml-10 ${isTablet ? "grid-cols-2 px-4 pb-8" : "grid-cols-4"}`}
            >
              {columns.map((col) => {
                const accent = columnAccent[col];
                const colTasks = tasks.filter((t) => t.status === col);

                return (
                  <div
                    key={col}
                    className={`flex flex-col bg-slate-50/50 rounded-3xl border border-slate-200/60 overflow-hidden ${isTablet ? "h-[450px]" : ""}`}
                  >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/50">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${accent.dot}`}
                        />
                        <h2
                          className={`font-bold uppercase text-xs tracking-widest ${accent.label}`}
                        >
                          {col}
                        </h2>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${accent.badge}`}
                      >
                        {colTasks.length}
                      </span>
                    </div>

                    <Droppable droppableId={col} direction="vertical">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex flex-col flex-1 overflow-y-auto overflow-x-hidden gap-3 p-3 min-h-[200px] transition-colors duration-150 custom-scrollbar ${
                            snapshot.isDraggingOver
                              ? accent.drag
                              : "bg-transparent"
                          }`}
                        >
                          {colTasks.length === 0 &&
                            !snapshot.isDraggingOver && (
                              <div className="flex flex-col items-center justify-center py-10 text-slate-300 select-none">
                                <span className="text-xs font-medium">
                                  Kosong
                                </span>
                              </div>
                            )}

                          {colTasks.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) =>
                                renderTaskCard(task, provided, snapshot)
                              }
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          )}
        </DragDropContext>

        {isModalOpen && (
          <TaskModal
            isEditMode={isEditMode}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setIsModalOpen={setIsModalOpen}
          />
        )}
        <ConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setTaskToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </TaskLayouts>
  );
};

export default KanbanTaskPage;
