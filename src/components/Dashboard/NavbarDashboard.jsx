import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FiMenu, FiX, FiClock } from "react-icons/fi";
import { BiTask } from "react-icons/bi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoArchiveOutline } from "react-icons/io5";

const NavbarDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getDesktopLinkClass = (path) => {
    return location.pathname === path
      ? "text-[#007BFF]"
      : "text-slate-500 hover:text-slate-900 transition-colors";
  };

  const mobileMenuItems = [
    { label: "Dasbor", path: "/dashboard", icon: MdOutlineSpaceDashboard },
    { label: "Daftar Tugas", path: "/tasks", icon: BiTask, badge: 12 },
    { label: "Kalender", path: "/calendar", icon: FiClock },
    { label: "Catatan", path: "/notes", icon: HiOutlineDocumentText },
    { label: "Arsip", path: "/archive", icon: IoArchiveOutline },
  ];

  return (
    <nav className="relative flex items-center justify-between px-5 md:px-8 py-4 bg-white border-b border-slate-100 font-sans w-full drop-shadow">
      <div className="flex items-center gap-6 md:gap-10">
        <button
          className="md:hidden text-slate-500 hover:text-slate-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="bg-[#007BFF] p-1.5 rounded-lg text-white">
            <MdOutlineSpaceDashboard size={20} />
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight hidden sm:block">
            Decisify
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <p className="">Beranda</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end cursor-pointer">
          <span className="text-sm font-bold text-slate-900 leading-tight">
            {user?.name || "Guest"}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {user?.role || "Mahasiswa"}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-[100%] left-0 w-full bg-white border-b border-slate-100 shadow-xl md:hidden z-50 flex flex-col px-4 py-6 gap-2"
          >
            <h3 className="text-[11px] font-bold text-slate-400 mb-2 px-3 tracking-wider uppercase">
              Menu Utama
            </h3>

            {mobileMenuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
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
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavbarDashboard;
