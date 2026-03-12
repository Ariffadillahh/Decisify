import React from "react";
import TaskModal from "./TaskModal";
import { useTasks } from "../../hooks/useTasks";
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
      <div className="h-full bg-gray-50 relative">
        <main>{children}</main>

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
