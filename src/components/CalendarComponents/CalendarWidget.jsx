import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MONTH_NAMES, formatDateForDB } from "../../helpers/calendarUtils";

const CalendarWidget = ({
  currentViewDate,
  selectedDate,
  tasks = [], // Beri default array kosong jaga-jaga jika data belum siap
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onGoToToday, // 1. PASTIKAN MENGAMBIL PROPS INI DARI PARENT
}) => {
  // --- PERHITUNGAN TANGGAL ---

  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();

  // Total hari di bulan ini
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Total hari di bulan sebelumnya
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  // Hari pertama di bulan ini (0 = Minggu, 1 = Senin, dst.)
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Array untuk tanggal bulan sebelumnya (yang pudar)
  const prevMonthDays = Array.from(
    { length: firstDayOfMonth },
    (_, i) => daysInPrevMonth - firstDayOfMonth + i + 1,
  );
  // Array untuk tanggal bulan ini
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Array untuk sisa kotak (tanggal bulan berikutnya)
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

  // Palet warna otomatis untuk label tugas
  const colorPalette = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-red-100 text-red-700",
    "bg-green-100 text-green-700",
    "bg-orange-100 text-orange-700",
  ];

  // 2. FUNGSI INI SUDAH DIHAPUS KARENA SUDAH DIGANTIKAN OLEH PROPS onGoToToday
  // const handleGoToToday = () => { ... }

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

          {/* 3. PANGGIL PROPS onGoToToday KETIKA DIKLIK */}
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

      {/* KALENDER GRID */}
      <div className="p-2">
        {/* Header Hari (MIN, SEN, SEL...) */}
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

        {/* Grid Tanggal */}
        <div className="grid grid-cols-7 border-l border-t border-slate-50">
          {/* Render Tanggal Bulan Sebelumnya */}
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

          {/* Render Tanggal Bulan Ini */}
          {currentMonthDays.map((day) => {
            // Cek apakah ini tanggal yang sedang diklik user
            const isSelected =
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === month &&
              selectedDate.getFullYear() === year;

            // Cek Hari Ini SECARA OTOMATIS
            const today = new Date();
            const isToday =
              today.getDate() === day &&
              today.getMonth() === month &&
              today.getFullYear() === year;

            // Ambil daftar tugas yang sesuai dengan tanggal ini
            const dayTasks = getTasksForDay(day);
            // Ambil maksimal 2 tugas agar kotak tidak terlalu panjang
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

                {/* Indikator Garis Kuning untuk Hari Ini */}
                {isToday && (
                  <div className="w-6 h-0.5 bg-yellow-400 rounded-full ml-1 mt-1"></div>
                )}

                {/* Render Label Tugas */}
                <div className="mt-2 flex flex-col gap-1 w-full px-1">
                  {visibleTasks.map((task, idx) => {
                    const colorClass = colorPalette[idx % colorPalette.length];

                    return (
                      <div
                        key={task.id || idx}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-left truncate ${colorClass}`}
                      >
                        {task.title || task.nama_tugas || "Tugas"}
                      </div>
                    );
                  })}

                  {/* Tampilkan indikator jika masih ada sisa tugas */}
                  {remainingTasksCount > 0 && (
                    <div className="text-[9px] font-bold text-slate-400 pl-1 mt-0.5">
                      +{remainingTasksCount} lagi
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Render Tanggal Bulan Berikutnya */}
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
