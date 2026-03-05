import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import { MdDashboard } from "react-icons/md";
import { GrTasks } from "react-icons/gr";
import { CgNotes } from "react-icons/cg";
import { IoArchiveSharp } from "react-icons/io5";
import { LuUniversity } from "react-icons/lu";

const menu = [
  { icon: MdDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: GrTasks, label: "Task Management", path: "/task" },
  { icon: CgNotes, label: "Notes", path: "/notes" },
  { icon: IoArchiveSharp, label: "Archive", path: "/archive" },
];

const Sidebars = () => {
  const location = useLocation();

  return (
    <div
      className="fixed z-50 
      bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px]
      md:bottom-auto md:left-4 md:top-1/2 md:-translate-y-1/2 md:-translate-x-0 md:w-auto md:max-w-none
      transition-all duration-500"
    >
      <div
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 
        flex flex-row items-center justify-around px-4 h-16
        md:flex-col md:w-16 md:h-auto md:py-5 md:px-0 md:gap-6 md:justify-start"
      >
        <Link to="/dashboard" className="items-center justify-center hidden md:flex">
          <div className="relative group p-2">
            <LuUniversity
              className="text-gray-800 transition-colors group-hover:text-black"
              size={26}
            />

            <span
              className="hidden md:block absolute left-14 top-1/2 -translate-y-1/2 
              opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0
              bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg
              whitespace-nowrap pointer-events-none shadow-md transition-all duration-300"
            >
              Home
            </span>
          </div>
        </Link>

        <div className="w-px h-8 bg-gray-200 md:w-8 md:h-px hidden md:flex"></div>

        {menu.map((item, index) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              className="flex items-center justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`relative group p-2.5 rounded-xl transition-all duration-300
                ${
                  active
                    ? "bg-black text-white shadow-md shadow-black/20"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={22} />

                <span
                  className="hidden md:block absolute left-14 top-1/2 -translate-y-1/2
                  opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0
                  bg-gray-800 text-white text-xs px-3 py-1.5
                  rounded-lg whitespace-nowrap pointer-events-none shadow-md transition-all duration-300"
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebars;
