import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";
import { BiTask } from "react-icons/bi";
import { HiOutlineDocumentText } from "react-icons/hi";

const MobileMenu = ({
  isOpen,
  setIsOpen,
  searchQuery,
  setSearchQuery,
  filteredNotes,
  filteredTasks,
  navigate,
  location,
  menuItems,
}) => {
  const noResults = filteredNotes.length === 0 && filteredTasks.length === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute top-[100%] left-0 w-full bg-white border-b border-slate-100 shadow-xl md:hidden z-50 flex flex-col pt-4 pb-6 gap-2"
        >
          {/* --- SEARCH BAR MOBILE --- */}
          <div className="px-5 mb-4 mt-2">
            <div className="flex items-center bg-slate-100 rounded-xl px-4 py-3.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#007BFF]/30 transition-all border border-transparent focus-within:border-blue-200">
              <FiSearch size={18} className="text-slate-400 min-w-[18px]" />
              <input
                type="text"
                placeholder="Cari tugas atau catatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-[14px] font-medium text-slate-700 ml-3 w-full placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 ml-2"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
          </div>

          {searchQuery.trim().length > 0 ? (
            <div className="px-2 max-h-[60vh] overflow-y-auto">
              {noResults ? (
                <div className="px-4 py-8 text-center text-slate-500 text-sm font-medium">
                  Pencarian tidak ditemukan
                </div>
              ) : (
                <>
                  {filteredNotes.length > 0 && (
                    <div className="mb-4">
                      <h4 className="px-4 py-1.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                        Catatan
                      </h4>
                      {filteredNotes.map((note) => (
                        <div
                          key={note.id}
                          onMouseDown={() => {
                            navigate(`/notes/${note.id}`);
                            setSearchQuery("");
                            setIsOpen(false);
                          }}
                          className="mx-3 px-4 py-3 flex items-center gap-3 bg-slate-50 mb-1.5 rounded-xl hover:bg-blue-50 cursor-pointer group"
                        >
                          <div className="p-2 bg-white shadow-sm text-slate-500 group-hover:text-[#007BFF] group-hover:bg-[#007BFF]/10 transition-colors rounded-lg">
                            <HiOutlineDocumentText size={18} />
                          </div>
                          <span className="text-sm font-semibold text-slate-700 truncate group-hover:text-[#007BFF] transition-colors">
                            {note.title || "Catatan Tanpa Judul"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredTasks.length > 0 && (
                    <div>
                      <h4 className="px-4 py-1.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                        Tugas
                      </h4>
                      {filteredTasks.map((task) => (
                        <div
                          key={task.id}
                          onMouseDown={() => {
                            if (task.date_deadline) {
                              navigate(
                                `/calendar?date=${task.date_deadline.split("T")[0]}`,
                              );
                            } else {
                              navigate(`/tasks`);
                            }
                            setSearchQuery("");
                            setIsOpen(false);
                          }}
                          className="mx-3 px-4 py-3 flex items-center gap-3 bg-slate-50 mb-1.5 rounded-xl hover:bg-blue-50 cursor-pointer group"
                        >
                          <div className="p-2 bg-white shadow-sm text-slate-500 group-hover:text-[#007BFF] group-hover:bg-[#007BFF]/10 transition-colors rounded-lg">
                            <BiTask size={18} />
                          </div>
                          <div className="flex flex-col overflow-hidden w-full">
                            <span className="text-sm font-semibold text-slate-700 truncate group-hover:text-[#007BFF] transition-colors">
                              {task.title}
                            </span>
                            {task.categoryName && (
                              <span className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">
                                {task.categoryName}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <h3 className="text-[11px] font-bold text-slate-400 mb-2 px-6 tracking-wider uppercase mt-2">
                Menu Utama
              </h3>
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 px-6 py-3.5 mx-3 rounded-2xl transition-all duration-200 ${
                      isActive
                        ? "bg-[#007BFF] text-white shadow-md shadow-blue-500/20"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      size={22}
                      className={isActive ? "text-white" : "text-slate-500"}
                    />
                    <span className="font-medium text-[15px]">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
