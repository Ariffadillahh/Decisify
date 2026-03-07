import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdDashboard, MdClose } from "react-icons/md";
import { GrTasks } from "react-icons/gr";
import { CgNotes } from "react-icons/cg";
import { IoArchiveSharp } from "react-icons/io5";
import { LuUniversity } from "react-icons/lu";

const menu = [
  { icon: MdDashboard, label: "Dashboard", path: "/dashboard", type: "link" },
  { icon: GrTasks, label: "Task Management", path: "/tasks", type: "link" },
  { icon: CgNotes, label: "Notes", path: "/notes", type: "link" },
  {
    icon: IoArchiveSharp,
    label: "Task Archive",
    path: "/archive",
    type: "modal",
  },
];

const Sidebars = ({ tasks = [] }) => {
  const location = useLocation();
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  const archivedTasks = tasks.filter((task) => task.archived === true);

  return (
    <>
      <div className="fixed z-[60] bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] md:bottom-auto md:left-4 md:top-1/2 md:-translate-y-1/2 md:-translate-x-0 md:w-auto transition-all duration-500">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 flex flex-row items-center justify-around px-4 h-16 md:flex-col md:w-16 md:h-auto md:py-5 md:px-0 md:gap-6 md:justify-start">
          <Link to="/dashboard" className="hidden md:flex">
            <div className="relative group p-2">
              <LuUniversity className="text-gray-800" size={26} />
            </div>
          </Link>

          <div className="w-px h-8 bg-gray-200 md:w-8 md:h-px hidden md:flex"></div>

          {menu.map((item, index) => {
            const Icon = item.icon;
            const active =
              location.pathname === item.path && item.type !== "modal";

            return (
              <div key={index} className="flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    item.type === "modal"
                      ? setIsArchiveOpen(!isArchiveOpen)
                      : null
                  }
                  className={`relative group p-2.5 rounded-xl transition-all duration-300 cursor-pointer
                  ${
                    active || (item.type === "modal" && isArchiveOpen)
                      ? "bg-black text-white shadow-md shadow-black/20"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.type === "modal" ? (
                    <Icon size={22} />
                  ) : (
                    <Link to={item.path}>
                      <Icon size={22} />
                    </Link>
                  )}
                  <span className="hidden md:block absolute left-14 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 bg-gray-800 text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none shadow-md transition-all duration-300">
                    {item.label}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isArchiveOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/5"
              onClick={() => setIsArchiveOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              className="fixed z-50 left-2 md:left-24 bottom-24 md:top-1/2 md:-translate-y-1/2 w-[95%] md:w-80 h-[400px] md:h-[500px] bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 flex flex-col overflow-hidden"
            >
              <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-center bg-white/50">
                <div>
                  <h2 className="text-xl font-black text-gray-800">Archive</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Tugas Selesai ({archivedTasks.length})
                  </p>
                </div>
                <button
                  onClick={() => setIsArchiveOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MdClose size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {archivedTasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-30">
                    <IoArchiveSharp size={40} className="mb-2" />
                    <p className="text-xs font-bold uppercase tracking-widest">
                      Kosong
                    </p>
                  </div>
                ) : (
                  archivedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-white/50 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                    >
                      <h4 className="text-sm font-bold text-slate-600 line-through opacity-60 truncate">
                        {task.title}
                      </h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase">
                          📅 {task.date_deadline?.split("T")[0]}
                        </span>
                        <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase">
                          Done
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebars;
