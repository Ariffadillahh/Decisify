import React, { useState, useMemo } from "react";
import TaskLayouts from "./TaskLayouts";
import { useTasks } from "../../hooks/useTasks";

import CalendarWidget from "../../components/CalendarComponents/CalendarWidget";
import SuggestionWidget from "../../components/CalendarComponents/SuggestionWidget";
import AgendaList from "../../components/CalendarComponents/AgendaList";
import TaskModal from "./TaskModal";

import { formatDateForDB } from "../../helpers/calendarUtils";

const CalenderTaskPage = () => {
  const {
    tasks,
    handleDelete,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    formData,
    handleChange,
    handleSubmit,
    openModal,
    allRawTasks,
  } = useTasks();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  const formattedSelectedDate = formatDateForDB(selectedDate);

  const tasksOnSelectedDate = useMemo(() => {
    return allRawTasks.filter(
      (t) =>
        t.date_deadline && t.date_deadline.startsWith(formattedSelectedDate),
    );
  }, [tasks, formattedSelectedDate]);

  const suggestedTasks = useMemo(() => {
    return tasks
      .filter((t) => !t.done && t.status !== "Done")
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 3);
  }, [tasks]);

  const handlePrevMonth = () =>
    setCurrentViewDate(
      new Date(
        currentViewDate.getFullYear(),
        currentViewDate.getMonth() - 1,
        1,
      ),
    );
  const handleNextMonth = () =>
    setCurrentViewDate(
      new Date(
        currentViewDate.getFullYear(),
        currentViewDate.getMonth() + 1,
        1,
      ),
    );

  const handleGoToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentViewDate(today);
  };

  return (
    <TaskLayouts>
      <div className="min-h-screen bg-[#f8fafc] w-full flex flex-col pl-4 md:pl-8 relative">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
          <div className="w-full lg:w-[60%] flex flex-col gap-6 shrink-0">
            <CalendarWidget
              currentViewDate={currentViewDate}
              selectedDate={selectedDate}
              tasks={allRawTasks}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onSelectDate={setSelectedDate}
              onGoToToday={handleGoToToday}
            />
            {/* <SuggestionWidget suggestedTasks={suggestedTasks} /> */}
          </div>

          <AgendaList
            selectedDate={selectedDate}
            tasks={tasksOnSelectedDate}
            allTasks={allRawTasks}
            onTaskClick={openModal}
            onDeleteTask={handleDelete}
          />
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
    </TaskLayouts>
  );
};

export default CalenderTaskPage;
