import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { BiTask } from "react-icons/bi";
import { HiOutlineDocumentText } from "react-icons/hi";

const DesktopSearch = ({
  searchQuery,
  setSearchQuery,
  filteredNotes,
  filteredTasks,
  navigate,
}) => {
  const isOpen = searchQuery.trim().length > 0;
  const noResults = filteredNotes.length === 0 && filteredTasks.length === 0;

  return (
    <div className="relative hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2.5 border border-transparent focus-within:border-blue-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300 w-64 lg:w-80">
      <FiSearch size={18} className="text-slate-400 min-w-[18px]" />
      <input
        type="text"
        placeholder="Search tugas atau catatan..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-transparent border-none outline-none text-[13px] font-medium text-slate-700 ml-2.5 w-full placeholder:text-slate-400 placeholder:font-medium"
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[120%] left-0 w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col z-[100]"
          >
            <div className="max-h-[350px] overflow-y-auto scrollbar-hide py-2">
              {noResults ? (
                <div className="px-4 py-6 text-center text-slate-500 text-sm font-medium">
                  Pencarian tidak ditemukan
                </div>
              ) : (
                <>
                  {/* Hasil Catatan */}
                  {filteredNotes.length > 0 && (
                    <div className="mb-2">
                      <h4 className="px-4 py-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase bg-slate-50/50">
                        Catatan
                      </h4>
                      {filteredNotes.map((note) => (
                        <div
                          key={note.id}
                          onMouseDown={() => {
                            navigate(`/notes/${note.id}`);
                            setSearchQuery("");
                          }}
                          className="px-4 py-2.5 flex items-center gap-3 hover:bg-blue-50 cursor-pointer group transition-colors"
                        >
                          <div className="p-1.5 bg-slate-100 text-slate-500 rounded-md group-hover:bg-[#007BFF] group-hover:text-white transition-colors">
                            <HiOutlineDocumentText size={16} />
                          </div>
                          <span className="text-sm font-semibold text-slate-700 group-hover:text-[#007BFF] truncate">
                            {note.title || "Catatan Tanpa Judul"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {filteredTasks.length > 0 && (
                    <div>
                      <h4 className="px-4 py-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase bg-slate-50/50">
                        Tugas
                      </h4>
                      {filteredTasks.map((task) => (
                        <div
                          key={task.id}
                          onMouseDown={() => {
                            if (task.date_deadline)
                              navigate(
                                `/calendar?date=${task.date_deadline.split("T")[0]}`,
                              );
                            else navigate(`/tasks`);
                            setSearchQuery("");
                          }}
                          className="px-4 py-2.5 flex items-center gap-3 hover:bg-blue-50 cursor-pointer group transition-colors"
                        >
                          <div className="p-1.5 bg-slate-100 text-slate-500 rounded-md group-hover:bg-[#007BFF] group-hover:text-white transition-colors">
                            <BiTask size={16} />
                          </div>
                          <div className="flex flex-col overflow-hidden w-full">
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-[#007BFF] transition-colors truncate">
                              {task.title}
                            </span>
                            {task.categoryName && (
                              <span className="text-[10px] text-slate-400 font-medium truncate">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesktopSearch;
