import React, { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  archiveOldTasks,
} from "../../services/taskServices";
import TaskModal from "./TaskModal";

const columns = ["Todo", "Doing", "Done"];

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    date_deadline: "",
    tingkat_kesulitan: 1,
    estimasi_jam: 1,
  });

  const fetchTasks = useCallback(async () => {
    const data = await getAllTasks();

    const normalized = data.map((task) => ({
      ...task,
      status: task.status || "Todo",
      done: task.status === "Done",
    }));

    const todoDoing = normalized
      .filter((t) => t.status !== "Done")
      .sort((a, b) => b.finalScore - a.finalScore);

    const done = normalized
      .filter((t) => t.status === "Done")
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

    setTasks([...todoDoing, ...done]);
  }, []);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(async () => {
      await archiveOldTasks();
      fetchTasks();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const openModal = (task = null) => {
    if (task) {
      setIsEditMode(true);
      setCurrentTaskId(task.id);
      setFormData({
        title: task.title,
        date_deadline: task.date_deadline,
        tingkat_kesulitan: task.tingkat_kesulitan,
        estimasi_jam: task.estimasi_jam,
      });
    } else {
      setIsEditMode(false);
      setFormData({
        title: "",
        date_deadline: "",
        tingkat_kesulitan: 1,
        estimasi_jam: 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tingkat_kesulitan: parseInt(formData.tingkat_kesulitan),
      estimasi_jam: parseInt(formData.estimasi_jam),
    };

    if (isEditMode) {
      const originalTask = tasks.find((t) => t.id === currentTaskId);
      await updateTask(currentTaskId, { ...originalTask, ...payload });
    } else {
      await createTask({ ...payload, status: "Todo", done: false });
    }

    setIsModalOpen(false);
    fetchTasks();
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedTasks = Array.from(tasks);
    const draggedIndex = updatedTasks.findIndex(
      (t) => t.id.toString() === draggableId,
    );
    if (draggedIndex === -1) return;

    const draggedTask = updatedTasks[draggedIndex];

    updatedTasks.splice(draggedIndex, 1);

    const isDone = destination.droppableId === "Done";
    const updatedTask = {
      ...draggedTask,
      status: destination.droppableId,
      done: isDone,
      completedAt: isDone ? Date.now() : null,
    };

    if (isDone) {
      const firstDoneIndex = updatedTasks.findIndex((t) => t.status === "Done");
      const insertAt =
        firstDoneIndex === -1
          ? updatedTasks.length
          : firstDoneIndex + destination.index;
      updatedTasks.splice(insertAt, 0, updatedTask);
    } else {
      updatedTasks.push(updatedTask);
    }

    const todoAndDoing = updatedTasks
      .filter((t) => t.status !== "Done")
      .sort((a, b) => b.finalScore - a.finalScore);

    const doneTasks = updatedTasks.filter((t) => t.status === "Done");

    const finalTasks = [...todoAndDoing, ...doneTasks];

    setTasks(finalTasks);

    await updateTask(updatedTask.id, updatedTask);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Hapus tugas ini?")) {
      await deleteTask(id);
      fetchTasks();
    }
  };

  return (
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
          <button
            onClick={() => openModal()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition active:scale-95"
          >
            + Tambah Tugas
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((col) => (
              <div
                key={col}
                className="bg-slate-200/40 rounded-3xl p-4 flex flex-col min-h-[650px] border border-slate-200"
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
                      className={`flex-1 transition rounded-2xl ${snapshot.isDraggingOver ? "bg-slate-200/70" : ""}`}
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
                                    className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${task.finalScore > 0.7 ? "bg-red-50 text-red-600 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}
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
                                  className={`text-slate-800 font-bold leading-snug mb-4 text-base ${task.done ? "line-through text-slate-400" : ""}`}
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
  );
};

export default TaskPage;
