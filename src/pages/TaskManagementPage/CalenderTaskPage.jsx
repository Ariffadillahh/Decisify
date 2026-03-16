import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TaskLayouts from "./TaskLayouts";
import { useTasks } from "../../hooks/useTasks";

import CalendarWidget from "../../components/CalendarComponents/CalendarWidget";
import SuggestionWidget from "../../components/CalendarComponents/SuggestionWidget";
import AgendaList from "../../components/CalendarComponents/AgendaList";
import TaskModal from "./TaskModal";

import { formatDateForDB } from "../../helpers/calendarUtils";

const CalenderTaskPage = () => {
  const [searchParams] = useSearchParams();

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
    fetchTasks,
  } = useTasks();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  const formattedSelectedDate = formatDateForDB(selectedDate);

  useEffect(() => {
    const dateParam = searchParams.get("date");

    if (dateParam) {
      const parsedDate = new Date(dateParam);

      if (!isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate); 
        setCurrentViewDate(parsedDate); 
      }
    }
  }, [searchParams]); 

  useEffect(() => {
    const handleDataUpdate = () => {
      if (fetchTasks) {
        fetchTasks();
      }
    };

    window.addEventListener("tasks_updated", handleDataUpdate);

    return () => {
      window.removeEventListener("tasks_updated", handleDataUpdate);
    };
  }, [fetchTasks]);

  const tasksOnSelectedDate = useMemo(() => {
    return allRawTasks.filter(
      (t) =>
        t.date_deadline && t.date_deadline.startsWith(formattedSelectedDate),
    );
  }, [tasks, formattedSelectedDate, allRawTasks]);

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
      <div className="min-h-screen bg-[#f8fafc] w-full flex flex-col px-4 py-3 md:px-10">
        <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:flex-1 shrink-0">
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
