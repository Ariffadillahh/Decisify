import React from "react";
import { BsClock } from "react-icons/bs";

export const ScoreBadge = ({ finalScore }) => {
  if (finalScore >= 1) {
    return (
      <span className="flex items-center gap-1 bg-red-600 text-white border-red-700 border text-[10px] md:text-xs font-black uppercase tracking-widest px-2 py-1 rounded-lg shadow-sm shrink-0">
        <span>🚨</span> Telat
      </span>
    );
  }

  if (finalScore > 0.7) {
    return (
      <span className="flex items-center gap-1 bg-orange-100/90 text-orange-700 border-orange-200 border text-[10px] md:text-xs font-black uppercase tracking-widest px-2 py-1 rounded-lg shrink-0">
        <span>🔥</span> Urgent
      </span>
    );
  }

  return null;
};

export const StatusBadge = ({ status }) => {
  return (
    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest bg-white/80 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-sm shrink-0">
      Status: {status}
    </span>
  );
};

export const TimeBadge = ({ date_deadline }) => {
  let displayTime = "23:59 WIB";
  let displayDate = "";
  let hoverText = "Tidak ada tenggat waktu";

  if (date_deadline) {
    if (date_deadline.includes("T")) {
      const [datePart, timePart] = date_deadline.split("T");

      const [year, month, day] = datePart.split("-");
      displayDate = `${day}/${month}/${year}`;
      displayTime = `${timePart} WIB`;

      hoverText = `Waktu Deadline: ${displayDate} pukul ${displayTime}`;
    } else {
      displayDate = date_deadline;
      displayTime = "";
      hoverText = `Waktu Deadline: ${date_deadline}`;
    }
  }

  return (
    <span
      title={hoverText}
      className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold bg-white/80 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-sm shrink-0 cursor-help transition-colors hover:bg-slate-50"
    >
      <BsClock className="text-indigo-500 font-black shrink-0" />
      <span>
        {displayDate && `${displayDate} • `}
        {displayTime}
      </span>
    </span>
  );
};

export const CategoryBadge = ({ category }) => {
  if (!category) return null;

  return (
    <span
      title={`Kategori: ${category}`}
      className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest bg-blue-50/80 text-blue-600 px-2.5 py-1 rounded-lg border border-blue-200/80 shadow-sm shrink-0 cursor-default"
    >
      <span>📁</span>
      <span className="truncate max-w-[100px] md:max-w-[150px]">
        {category}
      </span>
    </span>
  );
};
