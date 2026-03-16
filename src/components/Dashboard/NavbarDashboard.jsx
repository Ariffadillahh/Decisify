import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import {
  FiMenu,
  FiX,
  FiClock,
  FiChevronDown,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import { BiTask } from "react-icons/bi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoArchiveOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

import { useTasks } from "../../hooks/useTasks";
import { useNotes } from "../../hooks/useNotes";
import { db } from "../../services/db"; // Import dexie instance

import DesktopSearch from "./DesktopSearch";
import NotificationMenu from "./NotificationMenu";
import MobileMenu from "./MobileMenu";
import LogoutModal from "./LogoutModal";

import logo from "../../assets/images/logo.png";

const MENU_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: MdOutlineSpaceDashboard },
  { label: "Progres Tugas", path: "/tasks", icon: BiTask },
  { label: "Kalender", path: "/calendar", icon: FiClock },
  { label: "Catatan", path: "/notes", icon: HiOutlineDocumentText },
  { label: "Arsip", path: "/archive", icon: IoArchiveOutline },
];

const NavbarDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { allRawTasks } = useTasks();
  const { notes } = useNotes();

  const handleLogout = async () => {
    try {
      await db.delete();

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      navigate("/");
    } catch (err) {
      console.error("Gagal menghapus database saat logout:", err);
      navigate("/");
    }
  };

  const userInitial = (user?.name || "Guest").charAt(0).toUpperCase();

  const pageTitle = useMemo(() => {
    const path = location.pathname;
    const currentMenu = MENU_ITEMS.find((item) => path.includes(item.path));
    return currentMenu ? currentMenu.label : "Dasbor";
  }, [location.pathname]);

  const urgentTasks = useMemo(() => {
    if (!allRawTasks) return [];
    return allRawTasks
      .map((task) => {
        if (task.status === "Done" || !task.date_deadline) return null;
        const today = new Date().setHours(0, 0, 0, 0);
        const deadline = new Date(task.date_deadline).setHours(0, 0, 0, 0);
        const diffDays = Math.round((deadline - today) / (1000 * 3600 * 24));
        return { ...task, diffDays };
      })
      .filter((task) => task !== null && task.diffDays <= 1)
      .sort((a, b) => a.diffDays - b.diffDays);
  }, [allRawTasks]);

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim() || !notes) return [];
    return notes
      .filter((n) => n.title?.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 4);
  }, [searchQuery, notes]);

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim() || !allRawTasks) return [];
    return allRawTasks
      .filter((t) => t.title?.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 4);
  }, [searchQuery, allRawTasks]);

  return (
    <>
      <nav className="relative flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b border-slate-100 font-sans w-full drop-shadow-sm z-[60]">
        <div className="flex items-center gap-4 md:gap-8">
          <button
            className="md:hidden text-slate-500 hover:text-slate-900 p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <img src={logo} alt="logo" className="w-9" />
            <span className="text-xl font-extrabold text-slate-900 tracking-tight hidden sm:block">
              Decisify
            </span>
          </div>
          <div className="hidden md:block h-6 w-[1px] bg-slate-200"></div>
          <div className="hidden md:flex items-center text-sm font-bold text-slate-600">
            {pageTitle}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          {!isMobileMenuOpen && (
            <DesktopSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredNotes={filteredNotes}
              filteredTasks={filteredTasks}
              navigate={navigate}
            />
          )}

          <NotificationMenu
            urgentTasks={urgentTasks}
            isNotifOpen={isNotifOpen}
            setIsNotifOpen={(val) => {
              setIsNotifOpen(val);
              setIsMobileMenuOpen(false);
            }}
            navigate={navigate}
          />

          <div className="hidden md:block h-8 w-[1px] bg-slate-200 rounded-full"></div>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 group focus:outline-none cursor-pointer"
            >
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-black text-slate-900 leading-tight group-hover:text-[#007BFF] transition-colors">
                  {user?.name || "Guest"}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {user?.role || "User"}
                </span>
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#007BFF] border-2 border-transparent group-hover:border-blue-200 flex items-center justify-center font-black text-lg shadow-sm transition-all duration-300">
                  {userInitial}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full border border-slate-100 shadow-sm text-slate-400 p-0.5">
                  <FiChevronDown size={12} />
                </div>
              </div>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsProfileOpen(false)}
                  ></div>
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-56 bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 py-3 z-20 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-slate-50 mb-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Akun Saya
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-black text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors mt-1 cursor-pointer"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredNotes={filteredNotes}
          filteredTasks={filteredTasks}
          navigate={navigate}
          location={location}
          menuItems={MENU_ITEMS}
        />
      </nav>
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default NavbarDashboard;
