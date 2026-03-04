import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskModal from "./TaskModal";
import MainLayouts from "../MainLayouts";
import { gooeyToast } from "goey-toast";
import { useTasks } from "../../hooks/useTasks";

const columns = ["Todo", "Doing", "Done"];

const TaskPage = () => {
  const {
    tasks,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    formData,
    openModal,
    handleChange,
    handleSubmit,
    onDragEnd,
    handleDelete,
  } = useTasks();

  return (
    <MainLayouts>
      <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-black text-indigo-600 tracking-tight">
                Smart Kanban
              </h1>
              <p className="text-slate-500 text-sm italic">
                Klik kartu untuk mengedit detail tugas.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => openModal()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition active:scale-95"
              >
                + Tambah Tugas
              </button>
              <button
                onClick={() => gooeyToast.success("Saved!")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition active:scale-95"
              >
                Save
              </button>
            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {columns.map((col) => (
                <div
                  key={col}
                  className="bg-slate-200/40 rounded-3xl p-4 flex flex-col min-h-[60vh] h-full border border-slate-200"
                >
                  <div className="flex justify-between mb-5 px-3">
                    <h2 className="font-bold uppercase text-xs text-slate-600 tracking-widest">
                      {col}
                    </h2>
                    <span className="bg-white text-xs px-2 py-1 rounded-lg shadow font-bold text-indigo-600">
                      {tasks.filter((t) => t.status === col).length}
                    </span>
                  </div>

                  <Droppable droppableId={col}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 transition rounded-2xl h-full p-2 ${
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
                                  className={`group bg-white p-5 mb-5 rounded-3xl border transition-all duration-300 cursor-pointer relative ${
                                    snapshot.isDragging
                                      ? "rotate-3 shadow-2xl ring-2 ring-indigo-500 scale-105"
                                      : "shadow-sm border-slate-100 hover:shadow-md hover:border-indigo-200"
                                  } ${task.done ? "opacity-60 bg-slate-50/50" : ""}`}
                                >
                                  <div className="flex justify-between items-start mb-4">
                                    <div
                                      className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${
                                        task.finalScore > 0.7
                                          ? "bg-red-50 text-red-600 border-red-100"
                                          : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                      }`}
                                    >
                                      Score: {task.finalScore}
                                    </div>
                                    <button
                                      onClick={(e) => handleDelete(e, task.id)}
                                      className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
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
                                    className={`text-slate-800 font-bold leading-snug mb-4 text-base ${
                                      task.done
                                        ? "line-through text-slate-400"
                                        : ""
                                    }`}
                                  >
                                    {task.title}
                                  </h4>
                                  <div className="flex items-center justify-between border-t border-slate-50 pt-4 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                                    <span>📅 {task.date_deadline}</span>
                                    {task.done && (
                                      <span className="text-orange-500 animate-pulse">
                                        Auto-Archive
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

        {isModalOpen && (
          <TaskModal
            isEditMode={isEditMode}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </div>
    </MainLayouts>
  );
};

export default TaskPage;
