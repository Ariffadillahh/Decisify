import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import { FiClock } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { useTasks } from "../hooks/useTasks";
import { GetUrgencyTheme } from "./TaskBadge";

const mainMenu = [
  { label: "Dasbor", path: "/dashboard", icon: MdOutlineSpaceDashboard },
  { label: "Daftar Tugas", path: "/tasks", icon: BiTask},
  { label: "Kalender", path: "/calendar", icon: FiClock },
  { label: "Catatan", path: "/notes", icon: HiOutlineDocumentText },
];

const Sidebar = () => {
  const location = useLocation();
  const currentPath =
    location.pathname === "/" ? "/dashboard" : location.pathname;

  const { tasks } = useTasks();

  const suggestedTasks = useMemo(() => {
    return tasks
      .filter((t) => !t.done && t.status !== "Done")
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 3);
  }, [tasks]);

  return (
    <div className="w-[280px] bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 font-sans flex flex-col h-full overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h3 className="text-[11px] font-bold text-slate-400 mb-4 tracking-wider uppercase">
          Menu Utama
        </h3>

        <ul className="flex flex-col gap-1">
          {mainMenu.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "bg-[#007BFF] text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    size={22}
                    className={isActive ? "text-white" : "text-slate-500"}
                  />
                  <span className="font-medium text-sm">{item.label}</span>

                  {item.badge && (
                    <span
                      className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-md ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <hr className="border-t border-slate-100 mb-8 w-[85%] mx-auto" />

      <div>
        <h3 className="text-[11px] font-bold text-slate-400 mb-4 tracking-wider uppercase">
          Suggestion Focus
        </h3>

        {suggestedTasks.length === 0 ? (
          <div className="px-5 text-slate-400 text-xs font-medium">
            Belum ada tugas saat ini.
          </div>
        ) : (
          <ul className="flex flex-col gap-5 px-5 mt-2">
            {suggestedTasks.map((task, index) => {
              const score = task.finalScore || 0;
              const theme = GetUrgencyTheme(score);
              const category = task.categoryName || "";

              return (
                <li
                  key={task.id || index}
                  className="flex items-center gap-4 cursor-pointer group relative"
                >
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`w-3 h-3 rounded-full ${theme.dot} group-hover:scale-125 transition-transform duration-200 shadow-sm`}
                    ></div>

                    <div className="absolute left-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 whitespace-nowrap">
                      <div
                        className={`${theme.tooltip} text-white text-[10px] font-bold px-2.5 py-1.5 rounded-md shadow-lg flex items-center gap-1.5`}
                      >
                        {theme.label && <span>{theme.label}</span>}

                        {theme.label && category && (
                          <span className="text-white/40">|</span>
                        )}

                        {category && (
                          <span className="text-white/90">{category}</span>
                        )}

                        {!theme.label && !category && <span>Tugas</span>}

                        <div
                          className={`absolute top-1/2 -left-1 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 ${theme.arrow}`}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <span className="font-medium text-sm text-slate-600 group-hover:text-slate-900 transition-colors truncate">
                    {task.title}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
