import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiChevronRight, BiFolder, BiPlus, BiTrash, BiEditAlt, BiFolderPlus, BiGridVertical, BiGhost, BiPalette, BiDotsVerticalRounded } from "react-icons/bi";
import { Droppable, Draggable } from "@hello-pangea/dnd";

const colors = [
  { name: "default", class: "text-indigo-500", bg: "bg-indigo-500" },
  { name: "rose", class: "text-rose-500", bg: "bg-rose-500" },
  { name: "emerald", class: "text-emerald-500", bg: "bg-emerald-500" },
  { name: "amber", class: "text-amber-500", bg: "bg-amber-500" },
  { name: "sky", class: "text-sky-500", bg: "bg-sky-500" },
  { name: "violet", class: "text-violet-500", bg: "bg-violet-500" },
];

const FolderItem = ({ folder, allFolders, notes, activeNote, onSelectNote, onAddSubNote, onAddSubFolder, onDeleteNote, onRenameFolder, onDeleteFolder, onUpdateFolderColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false); // State baru untuk mobile
  const [editValue, setEditValue] = useState(folder.name);
  const inputRef = useRef(null);

  const subFolders = allFolders.filter((f) => f.parentId === folder.id);
  const folderNotes = notes.filter((n) => n.folderId === folder.id);
  const isEmpty = subFolders.length === 0 && folderNotes.length === 0;

  const currentColor = colors.find((c) => c.name === folder.color) || colors[0];

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div className="ml-2 select-none">
      <div className="group flex items-center justify-between hover:bg-gray-100 rounded-md p-1 transition-colors cursor-pointer relative">
        <div className="flex items-center gap-1 flex-1 min-w-0" onClick={() => !isEditing && setIsOpen(!isOpen)}>
          <motion.span animate={{ rotate: isOpen ? 90 : 0 }} className="text-gray-400 shrink-0">
            <BiChevronRight size={18} />
          </motion.span>

          <BiFolder className={`${currentColor.class} shrink-0`} size={18} />

          {isEditing ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => {
                onRenameFolder(folder.id, editValue);
                setIsEditing(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && inputRef.current.blur()}
              className="text-sm font-medium text-gray-700 bg-white border border-indigo-300 rounded px-1 w-full outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="text-sm font-medium text-gray-700 truncate">{folder.name}</span>
          )}
        </div>

        {/* --- DESKTOP ACTIONS (Hover) --- */}
        <div className="hidden lg:group-hover:flex items-center gap-0.5 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowColorPicker(!showColorPicker);
            }}
            className="p-1 cursor-pointer hover:bg-gray-200 rounded text-gray-500"
          >
            <BiPalette size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddSubNote(folder.id);
            }}
            className="p-1 cursor-pointer hover:bg-indigo-100 rounded text-indigo-600"
          >
            <BiPlus size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddSubFolder(folder.id);
            }}
            className="p-1 cursor-pointer hover:bg-amber-100 rounded text-amber-600"
          >
            <BiFolderPlus size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="p-1 cursor-pointer hover:bg-gray-200 rounded text-gray-500"
          >
            <BiEditAlt size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteFolder(folder);
            }}
            className="p-1 cursor-pointer hover:bg-red-50 rounded text-red-500"
          >
            <BiTrash size={14} />
          </button>
        </div>

        {/* --- MOBILE ACTIONS BUTTON (Visible on Mobile) --- */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMobileMenu(!showMobileMenu);
            }}
            className="p-1.5 text-gray-400 hover:text-indigo-600 active:bg-gray-200 rounded-full transition-colors"
          >
            <BiDotsVerticalRounded size={20} />
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <>
              <div className="fixed inset-0 z-[60]" onClick={() => setShowMobileMenu(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                className="absolute right-0 top-full mt-1 w-48 bg-white shadow-xl border border-gray-100 rounded-xl z-[70] p-1 overflow-hidden"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowColorPicker(true);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  <BiPalette className="text-indigo-500" /> Ubah Warna
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSubNote(folder.id);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  <BiPlus className="text-indigo-500" /> Tambah Catatan
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSubFolder(folder.id);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  <BiFolderPlus className="text-amber-500" /> Tambah Folder
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  <BiEditAlt className="text-gray-400" /> Rename
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFolder(folder);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50"
                >
                  <BiTrash /> Hapus Folder
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Color Picker (Tetap seperti sebelumnya) */}
        <AnimatePresence>
          {showColorPicker && (
            <>
              <div className="fixed inset-0 z-[80]" onClick={() => setShowColorPicker(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute right-0 top-10 bg-white shadow-2xl border border-gray-100 rounded-lg p-2 flex gap-2 z-[90]"
              >
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateFolderColor(folder.id, c.name);
                      setShowColorPicker(false);
                    }}
                    className={`w-5 h-5 rounded-full ${c.bg} hover:ring-2 ring-offset-2 ring-indigo-300 transition-all`}
                  />
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Subfolders & Notes Area */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-l border-gray-200 ml-3 mt-1">
            {subFolders.map((sub) => (
              <FolderItem key={sub.id} folder={sub} {...{ allFolders, notes, activeNote, onSelectNote, onAddSubNote, onAddSubFolder, onDeleteNote, onRenameFolder, onDeleteFolder, onUpdateFolderColor }} />
            ))}

            <Droppable droppableId={folder.id.toString()} type="NOTE">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className={`min-h-[15px] transition-colors rounded-lg py-1 ${snapshot.isDraggingOver ? "bg-indigo-50/50" : ""}`}>
                  {isEmpty ? (
                    <div className="py-4 px-6 flex flex-col items-center justify-center opacity-30 group/empty">
                      <BiGhost size={24} className="mb-1 group-hover/empty:animate-bounce" />
                      <p className="text-[10px] font-medium text-center">Folder kosong</p>
                    </div>
                  ) : (
                    folderNotes.map((note, index) => (
                      <Draggable key={note.id} draggableId={note.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{ ...provided.draggableProps.style }}
                            className={`flex items-center group mb-0.5 rounded-md transition-all ${snapshot.isDragging ? "bg-white shadow-xl ring-2 ring-indigo-500 z-[9999]" : "hover:bg-gray-100"}`}
                          >
                            {/* Drag Handle hanya tampil di Desktop atau bisa diatur sesuai kebutuhan */}
                            <div {...provided.dragHandleProps} className="p-2 text-gray-300 cursor-grab active:cursor-grabbing hover:text-indigo-500 transition-colors">
                              <BiGridVertical size={18} />
                            </div>
                            <button onClick={() => onSelectNote(note)} className={`flex-1 text-left py-2 pr-3 text-sm truncate cursor-pointer ${activeNote?.id === note.id ? "text-indigo-700 font-bold" : "text-gray-600"}`}>
                              <span className="truncate font-medium">{note.title || "Untitled"}</span>
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FolderItem;
