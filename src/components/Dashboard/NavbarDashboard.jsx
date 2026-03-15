import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FiMenu, FiX, FiClock } from "react-icons/fi";
import { BiTask } from "react-icons/bi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoArchiveOutline } from "react-icons/io5";

import { useTasks } from "../../hooks/useTasks";
import { useNotes } from "../../hooks/useNotes";

import DesktopSearch from "./DesktopSearch";
import NotificationMenu from "./NotificationMenu";
import MobileMenu from "./MobileMenu"; 

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

  const { allRawTasks } = useTasks();
  const { notes } = useNotes();

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsNotifOpen(false);
    setSearchQuery("");
  };

  return (
    <nav className="relative flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b border-slate-100 font-sans w-full drop-shadow-sm z-[60]">
      <div className="flex items-center gap-4 md:gap-8">
        <button
          className="md:hidden text-slate-500 hover:text-slate-900 p-1"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="bg-[#007BFF] p-1.5 rounded-lg text-white">
            <MdOutlineSpaceDashboard size={20} />
          </div>
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

        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-slate-900 leading-tight">
              {user?.name || "Guest"}
            </span>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {user?.role || "Mahasiswa"}
            </span>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-100 text-[#007BFF] border border-blue-200 flex items-center justify-center font-bold text-base md:text-lg shadow-sm transition-transform duration-300 group-hover:scale-105">
            {userInitial}
          </div>
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
  );
};

export default NavbarDashboard;
