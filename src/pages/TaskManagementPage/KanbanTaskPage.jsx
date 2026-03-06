import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import MainLayouts from "../MainLayouts";
import { useTasks } from "../../hooks/useTasks";
import TaskLayouts from "./TaskLayouts";

const columns = ["Backlog", "Todo", "Doing", "Done"];

const KanbanTaskPage = () => {
  const { tasks, openModal, onDragEnd, handleDelete } = useTasks();

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <MainLayouts>
      <TaskLayouts>
        <div className="min-h-screen font-sans text-slate-900 w-full flex flex-col py-2 md:py-8 pb-24 md:pb-8 px-2 md:px-0">
          <div className="w-full flex-1 flex flex-col pb-2 md:pb-0">
            {/* <div className="flex flex-row justify-between items-center mb-2 md:mb-10 px-2 md:px-0 shrink-0">
              <div>
                <h1 className="text-xl md:text-3xl font-black text-indigo-600 tracking-tight">
                  Smart Kanban
                </h1>
                <p className="text-slate-500 text-xs md:text-sm italic hidden md:block">
                  Klik kartu untuk mengedit detail tugas.
                </p>
              </div>
            </div> */}

            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex flex-col md:grid md:grid-cols-4 gap-2 md:gap-6 flex-1 items-stretch">
                {columns.map((col) => (
                  <div
                    key={col}
                    className="bg-slate-200/40 rounded-2xl md:rounded-3xl p-2 md:p-4 flex flex-col border border-slate-200 relative h-full"
                  >
                    <div className="flex justify-between items-center mb-1 md:mb-5 px-1 md:px-2 shrink-0">
                      <h2 className="font-bold uppercase text-[10px] md:text-xs text-slate-600 tracking-widest flex items-center gap-2">
                        {col}
                        <span className="bg-white px-1.5 py-0.5 rounded shadow text-indigo-600">
                          {tasks.filter((t) => t.status === col).length}
                        </span>
                      </h2>
                    </div>

                    <Droppable
                      droppableId={col}
                      direction={isMobile ? "horizontal" : "vertical"}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex-1 flex flex-row md:flex-col overflow-x-auto overflow-y-hidden md:overflow-visible items-center md:items-start transition rounded-xl h-full p-1 gap-2 md:gap-0 hide-scrollbar ${
                            snapshot.isDraggingOver ? "bg-slate-200/70" : ""
                          }`}
                        >
                          {tasks
                            .filter((t) => t.status === col)
                            .map((task, index) => (
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
                                    className={`group bg-white p-3 md:p-5 rounded-xl md:rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between shrink-0 h-full md:h-auto w-[240px] md:w-full md:mb-5 ${
                                      snapshot.isDragging
                                        ? "rotate-2 shadow-xl ring-2 ring-indigo-500 scale-105 z-50 relative"
                                        : "shadow-sm border-slate-100 relative"
                                    } ${task.done ? "opacity-60 bg-slate-50/50" : ""}`}
                                  >
                                    <div className="flex-1">
                                      <div className="flex justify-between items-start mb-1 md:mb-4">
                                        <div
                                          className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full border text-[8px] md:text-[10px] font-black uppercase tracking-wider ${
                                            task.finalScore > 0.7
                                              ? "bg-red-50 text-red-600 border-red-100"
                                              : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                          }`}
                                        >
                                          Score: {task.finalScore}
                                        </div>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(e, task.id);
                                          }}
                                          className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-lg"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3 w-3 md:h-4 md:w-4"
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
                                        className={`text-slate-800 font-bold leading-tight mb-1 md:mb-4 text-xs md:text-base line-clamp-2 md:line-clamp-none ${
                                          task.done
                                            ? "line-through text-slate-400"
                                            : ""
                                        }`}
                                      >
                                        {task.title}
                                      </h4>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-50 pt-2 md:pt-4 text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-tighter shrink-0">
                                      <span>📅 {task.date_deadline}</span>
                                      {task.done && (
                                        <span className="text-orange-500 animate-pulse">
                                          Archive
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </div>
        </div>
      </TaskLayouts>
    </MainLayouts>
  );
};

export default KanbanTaskPage;
