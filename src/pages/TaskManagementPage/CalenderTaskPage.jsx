import React, { useState, useMemo, useEffect } from "react";
// 1. Import useSearchParams dari react-router-dom
import { useSearchParams } from "react-router-dom";
import TaskLayouts from "./TaskLayouts";
import { useTasks } from "../../hooks/useTasks";

import CalendarWidget from "../../components/CalendarComponents/CalendarWidget";
import SuggestionWidget from "../../components/CalendarComponents/SuggestionWidget";
import AgendaList from "../../components/CalendarComponents/AgendaList";
import TaskModal from "./TaskModal";

import { formatDateForDB } from "../../helpers/calendarUtils";

const CalenderTaskPage = () => {
  // 2. Inisialisasi useSearchParams
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

  // 3. Tambahkan useEffect khusus untuk membaca parameter URL
  useEffect(() => {
    // Ambil nilai "date" dari URL (contoh: ?date=2026-03-15)
    const dateParam = searchParams.get("date");

    if (dateParam) {
      // Ubah string dari URL menjadi objek Date
      const parsedDate = new Date(dateParam);

      // Validasi apakah tanggalnya valid (bukan NaN)
      if (!isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate); // Ubah sorotan tanggal (biru)
        setCurrentViewDate(parsedDate); // Geser bulan kalender agar sesuai
      }
    }
  }, [searchParams]); // Jalankan ulang setiap kali URL (searchParams) berubah

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
      <div className="min-h-screen bg-[#f8fafc] w-full flex flex-col px-4 py-3 md:py-0 md:pl-8 relative mb-10 md:mb-0">
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
