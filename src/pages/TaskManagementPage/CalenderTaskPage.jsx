import React, { useState, useMemo } from "react";
import MainLayouts from "../MainLayouts";
import TaskLayouts from "./TaskLayouts";
import { useTasks } from "../../hooks/useTasks";

import CalendarWidget from "../../components/CalendarComponents/CalendarWidget";
import SuggestionWidget from "../../components/CalendarComponents/SuggestionWidget";
import AgendaList from "../../components/CalendarComponents/AgendaList";
import TaskModal from "./TaskModal"; 

import { formatDateForDB } from "../../helpers/calendarUtils";
import { gooeyToast } from "goey-toast";
import { updateTask } from "../../services/taskServices";

const CalenderTaskPage = () => {
  const { tasks, fetchTasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    date_deadline: "",
    tingkat_kesulitan: 1,
    estimasi_jam: 1,
  });

  const formattedSelectedDate = formatDateForDB(selectedDate);

  const tasksOnSelectedDate = useMemo(() => {
    return tasks.filter((t) => t.date_deadline === formattedSelectedDate);
  }, [tasks, formattedSelectedDate]);

  const suggestedTasks = useMemo(() => {
    return tasks
      .filter((t) => !t.done && t.status !== "Done")
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 3);
  }, [tasks]);

  // Handlers Kalender
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditTaskClick = (task) => {
    setFormData({
      id: task.id,
      title: task.title,
      date_deadline: task.date_deadline,
      tingkat_kesulitan: task.tingkat_kesulitan || 1,
      estimasi_jam: task.estimasi_jam || 1,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      try {
        await updateTask(formData.id, formData);
  
        if (fetchTasks) {
          await fetchTasks();
        }

      } catch (error) {
        console.error("Gagal update:", error);
        gooeyToast.error("Gagal menyimpan perubahan");
      }
    } else {
      gooeyToast.error("error");
    }

    setIsModalOpen(false);
  };

  return (
    <MainLayouts>
      <TaskLayouts>
        <div className="min-h-screen bg-[#f8fafc] w-full flex flex-col py-6 md:py-8 px-4 md:px-8 relative">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
            <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
              <CalendarWidget
                currentViewDate={currentViewDate}
                selectedDate={selectedDate}
                tasks={tasks}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onSelectDate={setSelectedDate}
              />
              <SuggestionWidget suggestedTasks={suggestedTasks} />
            </div>

            <AgendaList
              selectedDate={selectedDate}
              tasks={tasksOnSelectedDate}
              onTaskClick={handleEditTaskClick}
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
    </MainLayouts>
  );
};

export default CalenderTaskPage;
