import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BiChevronRight, BiFolder, BiHomeAlt, BiFile } from "react-icons/bi";

const Breadcrumbs = ({ activeNote, folders, allNotes, onSelectNote }) => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null); // Menyimpan ID folder yang dropdown-nya terbuka

  const getPath = () => {
    const path = [];
    let currentFolderId = activeNote?.folderId;
    while (currentFolderId) {
      const folder = folders.find((f) => f.id === currentFolderId);
      if (folder) {
        path.unshift(folder);
        currentFolderId = folder.parentId;
      } else break;
    }
    return path;
  };

  const folderPath = getPath();

  return (
    <nav className="flex items-center gap-1 text-xs font-medium text-gray-400 mb-6 overflow-visible">
      <button onClick={() => navigate("/notes")} className="flex items-center gap-1 hover:text-indigo-600 transition-colors shrink-0">
        <BiHomeAlt size={14} />
      </button>

      {folderPath.length > 0 && <BiChevronRight size={14} className="shrink-0" />}

      {folderPath.map((folder, index) => {
        const siblingNotes = allNotes.filter((n) => n.folderId === folder.id);
        const isOpen = openDropdown === folder.id;

        return (
          <React.Fragment key={folder.id}>
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(isOpen ? null : folder.id)}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${isOpen ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-100 hover:text-gray-600"}`}
              >
                <BiFolder size={14} />
                <span>{folder.name}</span>
              </button>

              {/* Dropdown Catatan dalam Folder ini */}
              <AnimatePresence>
                {isOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setOpenDropdown(null)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-lg z-40 py-1 overflow-hidden"
                    >
                      <div className="px-3 py-1.5 border-b border-gray-50 text-[10px] uppercase tracking-wider text-gray-400">Notes in this folder</div>
                      {siblingNotes.map((note) => (
                        <button
                          key={note.id}
                          onClick={() => {
                            onSelectNote(note);
                            navigate(`/notes/${note.id}`);
                            setOpenDropdown(null);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors ${activeNote.id === note.id ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-50 text-gray-600"}`}
                        >
                          <BiFile size={14} />
                          <span className="truncate">{note.title || "Untitled"}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            {index < folderPath.length - 1 && <BiChevronRight size={14} className="shrink-0" />}
          </React.Fragment>
        );
      })}

      <BiChevronRight size={14} className="shrink-0" />
      <span className="text-gray-600 font-bold truncate max-w-[120px] md:max-w-[200px]">{activeNote?.title || "Untitled Note"}</span>
    </nav>
  );
};

export default Breadcrumbs;
