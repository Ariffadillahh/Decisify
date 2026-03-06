export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const TASK_COLORS = [
  {
    bg: "bg-blue-50",
    border: "border-blue-200",
    hoverBorder: "hover:border-blue-400",
    title: "text-blue-800",
  },
  {
    bg: "bg-rose-50",
    border: "border-rose-200",
    hoverBorder: "hover:border-rose-400",
    title: "text-rose-800",
  },
  {
    bg: "bg-amber-50",
    border: "border-amber-200",
    hoverBorder: "hover:border-amber-400",
    title: "text-amber-800",
  },
  {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    hoverBorder: "hover:border-emerald-400",
    title: "text-emerald-800",
  },
  {
    bg: "bg-purple-50",
    border: "border-purple-200",
    hoverBorder: "hover:border-purple-400",
    title: "text-purple-800",
  },
];

export const formatDateForDB = (date) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};
