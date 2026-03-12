import React from "react";
import { BsClock } from "react-icons/bs";
import { FiBook, FiClock } from "react-icons/fi";

export const ScoreBadge = ({ finalScore = 0 }) => {
  let text = "Rutin";
  let colorClass = "bg-blue-100 text-blue-600";

  if (finalScore === 1) {
    text = "Telat";
    colorClass = "bg-[#fee2e2] text-[#dc2626]";
  } else if (finalScore >= 0.7) {
    text = "Penting";
    colorClass = "bg-orange-100 text-orange-600";
  }

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide w-fit ${colorClass}`}
    >
      {text}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  let config = {
    bg: "bg-slate-100",
    textCol: "text-slate-600",
    dot: "bg-slate-400",
  };

  switch (status.toLowerCase()) {
    case "todo":
      config = {
        bg: "bg-blue-50",
        textCol: "text-blue-600",
        dot: "bg-blue-500",
      };
      break;
    case "doing":
      config = {
        bg: "bg-amber-50",
        textCol: "text-amber-600",
        dot: "bg-amber-500",
      };
      break;
    case "done":
      config = {
        bg: "bg-emerald-50",
        textCol: "text-emerald-600",
        dot: "bg-emerald-500",
      };
      break;
    case "backlog":
    default:
      config = {
        bg: "bg-slate-100",
        textCol: "text-slate-500",
        dot: "bg-slate-400",
      };
      break;
  }

  return (
    <span
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 cursor-default transition-colors w-fit ${config.bg} ${config.textCol}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {status}
    </span>
  );
};

export const TimeBadge = ({ date_deadline }) => {
  let displayDate = "";
  let displayTime = "23:59 WIB";
  let hoverText = "Tidak ada tenggat waktu";

  if (date_deadline) {
    if (date_deadline.includes("T")) {
      const [datePart, timePart] = date_deadline.split("T");
      const [year, month, day] = datePart.split("-");

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Ags",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];
      const monthName = monthNames[parseInt(month, 10) - 1];

      const cleanDay = parseInt(day, 10);

      displayDate = `${cleanDay} ${monthName} ${year}`;
      displayTime = `${timePart.substring(0, 5)} WIB`;

      hoverText = `Tenggat: ${displayDate} pukul ${displayTime}`;
    } else {
      displayDate = date_deadline;
      displayTime = "";
      hoverText = `Tenggat: ${date_deadline}`;
    }
  }

  return (
    <span
      title={hoverText}
      className="flex items-center gap-1.5 text-[11px] md:text-xs font-medium text-slate-500 shrink-0 cursor-default"
    >
      <FiClock size={13} className="text-slate-400 stroke-[2.5]" />
      <span className="tracking-wide">
        {displayDate}
        {displayDate && displayTime && (
          <span className="mx-1 text-slate-300">•</span>
        )}
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
      className="flex items-center gap-1.5 text-[11px] md:text-xs font-medium text-slate-500 shrink-0 cursor-default"
    >
      <FiBook size={13} className="text-slate-400 stroke-[2.5]" />
      <span className="truncate max-w-[100px] md:max-w-[150px] capitalize">
        {category}
      </span>
    </span>
  );
};

export const GetUrgencyTheme = (score = 0) => {
  if (score >= 1) {
    return {
      dot: "bg-red-500 shadow-red-500/50",
      tooltip: "bg-red-600",
      arrow: "border-r-red-600",
      label: "Telat",
    };
  }
  if (score > 0.7) {
    return {
      dot: "bg-orange-500 shadow-orange-500/50",
      tooltip: "bg-orange-600",
      arrow: "border-r-orange-600",
      label: "Penting",
    };
  }
  return {
    dot: "bg-[#007BFF] shadow-blue-500/50",
    tooltip: "bg-slate-800",
    arrow: "border-r-slate-800",
    label: "Rutin",
  };
};
