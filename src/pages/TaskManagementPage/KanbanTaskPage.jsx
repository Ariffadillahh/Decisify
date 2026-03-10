import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useTasks } from "../../hooks/useTasks";
import TaskLayouts from "./TaskLayouts";
import TaskModal from "./TaskModal";
import {
  ScoreBadge,
  TimeBadge,
  StatusBadge,
  CategoryBadge,
} from "../../components/TaskBadge";
import ConfirmDeleteModal from "../../components/Modal/ConfirmDeleteModal";

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
      // FIX ERROR: Mengirim fake event agar useTasks.js tidak crash saat memanggil e.stopPropagation()
      const fakeEvent = { stopPropagation: () => {} };
      handleDelete(fakeEvent, taskToDelete);
    }
    setDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  return (
    <TaskLayouts>
      <div className="min-h-screen font-sans text-slate-900 w-full flex flex-col py-2 md:py-8 pb-24 md:pb-8 px-0 md:px-6 relative">
        <DragDropContext onDragEnd={onDragEnd}>
          {/* ── MOBILE: 4 rows, each scrolls horizontally ── */}
          {isMobile && (
            <div className="flex flex-col gap-3 px-3">
              {columns.map((col) => {
                const accent = columnAccent[col];
                const colTasks = tasks.filter((t) => t.status === col);

                return (
                  <div key={col} className="flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <span className={`w-2 h-2 rounded-full ${accent.dot}`} />

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

                    {/* Horizontal lane */}
                    <Droppable droppableId={col} direction="horizontal">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex gap-3 overflow-x-auto pb-3 px-1 min-h-[140px] rounded-xl hide-scrollbar
                ${snapshot.isDraggingOver ? accent.drag : ""}`}
                        >
                          {colTasks.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={provided.draggableProps.style}
                                  onClick={() => openModal(task)}
                                  className={`bg-white rounded-xl border w-[200px] shrink-0
                        ${
                          snapshot.isDragging
                            ? "rotate-2 shadow-xl ring-2 ring-indigo-400"
                            : "shadow-sm border-slate-100"
                        }`}
                                >
                                  <div className="p-3 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-2">
                                      {!task.done && (
                                        <ScoreBadge
                                          finalScore={task.finalScore}
                                        />
                                      )}

                                      <button
                                        onClick={(e) =>
                                          handleDeleteClick(e, task.id)
                                        }
                                        className="text-slate-300 hover:text-red-400"
                                      >
                                        ✕
                                      </button>
                                    </div>

                                    <h4 className="text-xs font-semibold mb-2">
                                      {task.title}
                                    </h4>

                                    <div className="mt-auto flex flex-wrap gap-1">
                                      <CategoryBadge
                                        category={task.categoryName}
                                      />
                                      <TimeBadge
                                        date_deadline={task.date_deadline}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    <div className="mt-2 border-b border-slate-100" />
                  </div>
                );
              })}
            </div>
          )}

          {/* ── TABLET: 2x2 grid ── */}
          {isTablet && (
            <div className="grid grid-cols-2 gap-4 px-4">
              {columns.map((col) => {
                const accent = columnAccent[col];
                const colTasks = tasks.filter((t) => t.status === col);

                return (
                  <div
                    key={col}
                    className="flex flex-col bg-slate-100/50 rounded-2xl border border-slate-200/70 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${accent.dot}`}
                        />
                        <h2
                          className={`font-bold uppercase text-[11px] tracking-widest ${accent.label}`}
                        >
                          {col}
                        </h2>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${accent.badge}`}
                      >
                        {colTasks.length}
                      </span>
                    </div>

                    <Droppable droppableId={col} direction="vertical">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex flex-col gap-2.5 p-2.5 min-h-[160px] transition-colors duration-150 ${
                            snapshot.isDraggingOver
                              ? accent.drag
                              : "bg-transparent"
                          }`}
                        >
                          {colTasks.length === 0 &&
                            !snapshot.isDraggingOver && (
                              <div className="flex flex-col items-center justify-center py-8 text-slate-300 gap-2 select-none">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-6 h-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={1.5}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                  />
                                </svg>
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
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={provided.draggableProps.style}
                                  onClick={() => openModal(task)}
                                  className={`group bg-white rounded-xl border transition-all duration-200 cursor-pointer ${
                                    snapshot.isDragging
                                      ? "rotate-1 shadow-2xl ring-2 ring-indigo-400 scale-[1.03] z-50"
                                      : "shadow-sm border-slate-100 hover:shadow-md hover:-translate-y-0.5"
                                  } ${task.done ? "opacity-60 bg-slate-50" : ""}`}
                                >
                                  <div className="p-3">
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        {!task.done && (
                                          <ScoreBadge
                                            finalScore={task.finalScore}
                                          />
                                        )}
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(e, task.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all p-1 rounded-lg -mt-0.5 -mr-0.5 focus:opacity-100"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3.5 w-3.5"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2.5}
                                            d="M6 18L18 6M6 6l12 12"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                    <h4
                                      className={`text-sm font-semibold leading-snug mb-2.5 ${task.done ? "line-through text-slate-400" : "text-slate-800"}`}
                                    >
                                      {task.title}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <CategoryBadge
                                        category={task.categoryName}
                                      />
                                      <TimeBadge
                                        date_deadline={task.date_deadline}
                                      />
                                      <StatusBadge status={task.status} />
                                    </div>
                                  </div>
                                  {task.done && (
                                    <div className="flex items-center border-t border-slate-100 px-3 py-2">
                                      <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                        Archive
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
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

          {/* ── DESKTOP: 4 columns grid ── */}
          {!isMobile && !isTablet && (
            <div className="grid grid-cols-4 gap-5 items-start ml-10">
              {columns.map((col) => {
                const accent = columnAccent[col];
                const colTasks = tasks.filter((t) => t.status === col);

                return (
                  <div
                    key={col}
                    className="flex flex-col bg-slate-100/50 rounded-2xl border border-slate-200/70 overflow-hidden"
                  >
                    {/* Column header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${accent.dot}`}
                        />
                        <h2
                          className={`font-bold uppercase text-[11px] tracking-widest ${accent.label}`}
                        >
                          {col}
                        </h2>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${accent.badge}`}
                      >
                        {colTasks.length}
                      </span>
                    </div>

                    <Droppable droppableId={col} direction="vertical">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex flex-col gap-2.5 p-2.5 min-h-[200px] transition-colors duration-150 ${
                            snapshot.isDraggingOver
                              ? accent.drag
                              : "bg-transparent"
                          }`}
                        >
                          {colTasks.length === 0 &&
                            !snapshot.isDraggingOver && (
                              <div className="flex flex-col items-center justify-center py-10 text-slate-300 gap-2 select-none">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-7 h-7"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={1.5}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                  />
                                </svg>
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
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={provided.draggableProps.style}
                                  onClick={() => openModal(task)}
                                  className={`group bg-white rounded-xl border transition-all duration-200 cursor-pointer ${
                                    snapshot.isDragging
                                      ? "rotate-1 shadow-2xl ring-2 ring-indigo-400 scale-[1.03] z-50"
                                      : "shadow-sm border-slate-100 hover:shadow-md hover:-translate-y-0.5"
                                  } ${task.done ? "opacity-60 bg-slate-50" : ""}`}
                                >
                                  <div className="p-3.5">
                                    <div className="flex justify-between items-start mb-2.5">
                                      <div>
                                        {!task.done && (
                                          <ScoreBadge
                                            finalScore={task.finalScore}
                                          />
                                        )}
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log(task.finalScore);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all p-1 rounded-lg -mt-0.5 -mr-0.5 focus:opacity-100"
                                        title="Hapus Tugas"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3.5 w-3.5"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2.5}
                                            d="M6 18L18 6M6 6l12 12"
                                          />
                                        </svg>
                                      </button>
                                    </div>

                                    <h4
                                      className={`text-sm font-semibold leading-snug mb-3 ${task.done ? "line-through text-slate-400" : "text-slate-800"}`}
                                    >
                                      {task.title}
                                    </h4>

                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <CategoryBadge
                                        category={task.categoryName}
                                      />
                                      <TimeBadge
                                        date_deadline={task.date_deadline}
                                      />
                                      <StatusBadge status={task.status} />
                                    </div>
                                  </div>

                                  {task.done && (
                                    <div className="flex items-center border-t border-slate-100 px-3.5 py-2">
                                      <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                        Archive
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
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

        <ConfirmDeleteModal
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
