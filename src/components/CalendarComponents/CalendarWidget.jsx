import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MONTH_NAMES, formatDateForDB } from "../../helpers/calendarUtils";

const CalendarWidget = ({
  currentViewDate,
  selectedDate,
  tasks,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
}) => {
  const daysInMonth = new Date(
    currentViewDate.getFullYear(),
    currentViewDate.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    currentViewDate.getFullYear(),
    currentViewDate.getMonth(),
    1,
  ).getDay();
  const startDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const blanks = Array.from({ length: startDayOffset }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getTaskCount = (day) => {
    const dateToCheck = formatDateForDB(
      new Date(currentViewDate.getFullYear(), currentViewDate.getMonth(), day),
    );

    return tasks.filter(
      (t) =>
        t.date_deadline && t.date_deadline.startsWith(dateToCheck) && !t.done,
    ).length;
  };

  return (
    <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onPrevMonth}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
        >
          <FaChevronLeft size={14} />
        </button>
        <h2 className="font-bold text-slate-800">
          {MONTH_NAMES[currentViewDate.getMonth()]}{" "}
          {currentViewDate.getFullYear()}
        </h2>
        <button
          onClick={onNextMonth}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
        >
          <FaChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-3">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
          <div key={day} className="text-xs font-bold text-slate-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="w-10 h-10 mx-auto"></div>
        ))}

        {days.map((day) => {
          const isSelected =
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentViewDate.getMonth() &&
            selectedDate.getFullYear() === currentViewDate.getFullYear();
          const isToday =
            new Date().getDate() === day &&
            new Date().getMonth() === currentViewDate.getMonth() &&
            new Date().getFullYear() === currentViewDate.getFullYear();
          const taskCount = getTaskCount(day);

          return (
            <div
              key={day}
              className="relative w-10 h-10 mx-auto flex items-center justify-center"
            >
              <button
                onClick={() =>
                  onSelectDate(
                    new Date(
                      currentViewDate.getFullYear(),
                      currentViewDate.getMonth(),
                      day,
                    ),
                  )
                }
                className={`group relative w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all duration-200 z-10 ${
                  isSelected
                    ? "bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200 scale-110"
                    : isToday
                      ? "bg-indigo-50 text-indigo-600 font-bold border border-indigo-200"
                      : "text-slate-700 hover:bg-slate-100 border border-transparent"
                }`}
              >
                <span>{day}</span>
                {taskCount > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-black rounded-full border-2 transition-transform group-hover:scale-110 ${
                      isSelected
                        ? "bg-white text-indigo-600 border-indigo-600"
                        : "bg-red-500 text-white border-white"
                    }`}
                  >
                    {taskCount}
                  </span>
                )}
              </button>
              {taskCount > 3 && !isSelected && (
                <div className="absolute inset-0 bg-indigo-400/10 blur-xl rounded-full -z-10"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWidget;
