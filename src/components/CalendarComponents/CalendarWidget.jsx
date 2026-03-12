import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MONTH_NAMES, formatDateForDB } from "../../helpers/calendarUtils";

const CalendarWidget = ({
  currentViewDate,
  selectedDate,
  tasks = [],
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onGoToToday,
}) => {
  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonthDays = Array.from(
    { length: firstDayOfMonth },
    (_, i) => daysInPrevMonth - firstDayOfMonth + i + 1,
  );
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const totalSlots = 42;
  const nextMonthDaysCount =
    totalSlots - (prevMonthDays.length + currentMonthDays.length);
  const nextMonthDays = Array.from(
    { length: nextMonthDaysCount },
    (_, i) => i + 1,
  );

  const getTasksForDay = (day) => {
    const dateToCheck = formatDateForDB(new Date(year, month, day));

    return tasks.filter(
      (t) =>
        t.date_deadline &&
        t.date_deadline.startsWith(dateToCheck) &&
        !t.done &&
        t.status !== "Done",
    );
  };

  const getTaskColor = (score = 0) => {
    if (score >= 1) return "bg-red-100 text-red-700"; 
    if (score > 0.7) return "bg-orange-100 text-orange-700"; 
    return "bg-blue-100 text-blue-700"; 
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 font-sans w-full">
      <div className="flex justify-between items-center p-6 border-b border-slate-50">
        <h2 className="text-2xl font-extrabold text-[#1c2331]">
          {MONTH_NAMES[month]} {year}
        </h2>

        <div className="flex items-center gap-3 bg-slate-50 rounded-full px-4 py-1.5 border border-slate-100">
          <button
            onClick={onPrevMonth}
            className="p-1 text-slate-400 hover:text-slate-800 transition"
          >
            <FaChevronLeft size={12} />
          </button>

          <span
            onClick={onGoToToday}
            className="text-sm font-bold text-slate-700 px-2 cursor-pointer hover:text-[#007BFF]"
          >
            Hari Ini
          </span>

          <button
            onClick={onNextMonth}
            className="p-1 text-slate-400 hover:text-slate-800 transition"
          >
            <FaChevronRight size={12} />
          </button>
        </div>
      </div>

      <div className="p-2">
        <div className="grid grid-cols-7 border-b border-slate-50">
          {["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"].map((day) => (
            <div
              key={day}
              className="text-center py-4 text-[11px] font-bold text-slate-400 tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 border-l border-t border-slate-50">
          {prevMonthDays.map((day, i) => (
            <div
              key={`prev-${i}`}
              className="min-h-[90px] p-2 border-r border-b border-slate-50 flex flex-col items-start bg-slate-50/30"
            >
              <span className="text-sm font-medium text-slate-300 ml-1 mt-1">
                {day}
              </span>
            </div>
          ))}

          {currentMonthDays.map((day) => {
            const isSelected =
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === month &&
              selectedDate.getFullYear() === year;

            const today = new Date();
            const isToday =
              today.getDate() === day &&
              today.getMonth() === month &&
              today.getFullYear() === year;

            const dayTasks = getTasksForDay(day);
            const visibleTasks = dayTasks.slice(0, 2);
            const remainingTasksCount = dayTasks.length - 2;

            return (
              <div
                key={day}
                onClick={() => onSelectDate(new Date(year, month, day))}
                className="min-h-[90px] p-2 border-r border-b border-slate-50 flex flex-col items-start cursor-pointer hover:bg-slate-50 transition-colors group relative overflow-hidden"
              >
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-sm ml-0.5 mt-0.5 font-bold transition-all
                  ${isSelected ? "bg-[#007BFF] text-white" : "text-slate-800 group-hover:text-[#007BFF]"}
                `}
                >
                  {day}
                </div>

                {isToday && (
                  <div className="w-6 h-0.5 bg-yellow-400 rounded-full ml-1 mt-1"></div>
                )}

                <div className="mt-2 flex flex-col gap-1 w-full px-1">
                  {visibleTasks.map((task, idx) => {
                    const colorClass = getTaskColor(task.finalScore);

                    return (
                      <div
                        key={task.id || idx}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-left truncate ${colorClass}`}
                      >
                        {task.title || task.nama_tugas || "Tugas"}
                      </div>
                    );
                  })}

                  {remainingTasksCount > 0 && (
                    <div className="text-[9px] font-bold text-slate-400 pl-1 mt-0.5">
                      +{remainingTasksCount} lagi
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {nextMonthDays.map((day, i) => (
            <div
              key={`next-${i}`}
              className="min-h-[90px] p-2 border-r border-b border-slate-50 flex flex-col items-start bg-slate-50/30"
            >
              <span className="text-sm font-medium text-slate-300 ml-1 mt-1">
                {day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
