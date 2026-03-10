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
    handleChange,
    handleSubmit,
  } = useTasks();

  return (
    <MainLayouts>
      <div className="min-h-screen bg-gray-50">
        <main className="">{children}</main>

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
