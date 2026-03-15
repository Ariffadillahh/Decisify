import React from "react";
import { FiBook, FiClock } from "react-icons/fi";

const BaseBadge = ({
  children,
  bgClass,
  textClass,
  title,
  icon: Icon,
  dotClass,
  className = "",
}) => (
  <span
    title={title}
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wide w-fit shrink-0 cursor-default transition-colors ${bgClass} ${textClass} ${className}`}
  >
    {Icon && <Icon size={13} className="stroke-[2.5]" />}
    {dotClass && (
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
    )}
    {children}
  </span>
);

export const ScoreBadge = ({ finalScore = 0 }) => {
  const getConfig = () => {
    if (finalScore === 1)
      return { text: "Telat", bg: "bg-[#fee2e2]", textCol: "text-[#dc2626]" };
    if (finalScore >= 0.7)
      return {
        text: "Penting",
        bg: "bg-orange-100",
        textCol: "text-orange-600",
      };
    return { text: "Mendatang", bg: "bg-blue-100", textCol: "text-blue-600" };
  };

  const { text, bg, textCol } = getConfig();
  return (
    <BaseBadge bgClass={bg} textClass={textCol}>
      {text}
    </BaseBadge>
  );
};

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const statusConfig = {
    todo: { bg: "bg-blue-50", textCol: "text-blue-600", dot: "bg-blue-500" },
    doing: {
      bg: "bg-amber-50",
      textCol: "text-amber-600",
      dot: "bg-amber-500",
    },
    done: {
      bg: "bg-emerald-50",
      textCol: "text-emerald-600",
      dot: "bg-emerald-500",
    },
    backlog: {
      bg: "bg-slate-100",
      textCol: "text-slate-500",
      dot: "bg-slate-400",
    },
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.backlog;

  return (
    <BaseBadge
      bgClass={config.bg}
      textClass={config.textCol}
      dotClass={config.dot}
      className="uppercase"
    >
      {status}
    </BaseBadge>
  );
};

export const TimeBadge = ({ date_deadline }) => {
  if (!date_deadline) return null;

  let displayDate = date_deadline;
  let displayTime = "23:59 WIB";

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

    displayDate = `${parseInt(day, 10)} ${monthNames[parseInt(month, 10) - 1]} ${year}`;
    displayTime = `${timePart.substring(0, 5)} WIB`;
  } else {
    displayTime = "";
  }

  const hoverText = `Tenggat: ${displayDate} ${displayTime ? `pukul ${displayTime}` : ""}`;

  return (
    <BaseBadge
      bgClass="bg-transparent"
      textClass="text-slate-500 font-medium"
      icon={FiClock}
      title={hoverText}
    >
      <span>
        {displayDate}{" "}
        {displayTime && <span className="mx-1 text-slate-300">•</span>}{" "}
        {displayTime}
      </span>
    </BaseBadge>
  );
};

export const CategoryBadge = ({ category }) => {
  if (!category) return null;

  return (
    <BaseBadge
      bgClass="bg-transparent"
      textClass="text-slate-500 font-medium capitalize"
      icon={FiBook}
      title={`Kategori: ${category}`}
      className="min-w-0 border border-gray-200"
    >
      <span className="truncate w-full max-w-[80px] md:max-w-[100px]">
        {category}
      </span>
    </BaseBadge>
  );
};

export const GetUrgencyTheme = (score = 0) => {
  if (score >= 1)
    return {
      dot: "bg-red-500 shadow-red-500/50",
      tooltip: "bg-red-600",
      arrow: "border-r-red-600",
      label: "Telat",
    };
  if (score > 0.7)
    return {
      dot: "bg-orange-500 shadow-orange-500/50",
      tooltip: "bg-orange-600",
      arrow: "border-r-orange-600",
      label: "Penting",
    };
  return {
    dot: "bg-[#007BFF] shadow-blue-500/50",
    tooltip: "bg-slate-800",
    arrow: "border-r-slate-800",
    label: "Rutin",
  };
};
