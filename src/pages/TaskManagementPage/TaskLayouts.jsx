import React from "react";
import { Link } from "react-router-dom";
import TaskModal from "./TaskModal";
import { useTasks } from "../../hooks/useTasks";
import { BiPlus } from "react-icons/bi";
import PomodoroTimer from "../../components/pomodoro/PomodoroTimer";
import MainLayouts from "../MainLayouts";

const TaskLayouts = ({ children }) => {
  const {
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    formData,
    openModal,
    handleChange,
    handleSubmit,
  } = useTasks();

  return (
    <MainLayouts>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">
                Task Management
              </h1>

              <div className="flex items-center gap-4 text-sm font-medium">
                <Link
                  to="/tasks"
                  className="text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  Calendar
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  to="/tasks/kanban"
                  className="text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  Kanban
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  to="/tasks/archive"
                  className="text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  Archive
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-all active:scale-95"
              >
                <BiPlus size={18} />
                <span>Create Task</span>
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-4 md:p-6">{children}</main>

        {isModalOpen && (
          <TaskModal
            isEditMode={isEditMode}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setIsModalOpen={setIsModalOpen}
          />
        )}

        <PomodoroTimer />
      </div>
    </MainLayouts>
  );
};

export default TaskLayouts;
