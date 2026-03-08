import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BiSearch, BiNote, BiEditAlt, BiTrash, BiChevronLeft, BiText, BiTimeFive } from "react-icons/bi";
import { debounce } from "lodash";
import { DragDropContext } from "@hello-pangea/dnd";

import NotesLayout from "./NotesLayout";
import NoteEditor from "../../components/NotesComponents/NoteEditor";
import InputModal from "../../components/NotesComponents/InputModal";
import ConfirmModal from "../../components/NotesComponents/ConfirmModal";
import FolderTree from "../../components/NotesComponents/FolderTree";
import Breadcrumbs from "../../components/NotesComponents/Breadcrumbs";
import { useNotes } from "../../hooks/useNotes";

const NoteContentEditor = ({ activeNote, folders, allNotes, onSelectNote, updateNoteTitle, updateNoteContent, onDeleteTrigger, onBack }) => {
  const [title, setTitle] = useState(activeNote.title);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef(null);

  const debouncedTitleUpdate = useMemo(() => debounce((id, val) => updateNoteTitle(id, val), 800), [updateNoteTitle]);

  // Auto-resize textarea judul
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [title]);

  useEffect(() => {
    return () => debouncedTitleUpdate.cancel();
  }, [debouncedTitleUpdate]);

  // Logic hitung kata tetap sama
  useEffect(() => {
    try {
      const blocks = JSON.parse(activeNote.content);
      let totalWords = 0;
      const extractText = (content) => {
        if (!content) return "";
        if (typeof content === "string") return content;
        if (Array.isArray(content)) return content.map((item) => item.text || "").join(" ");
        return "";
      };
      blocks.forEach((block) => {
        const text = extractText(block.content);
        if (text)
          totalWords += text
            .trim()
            .split(/\s+/)
            .filter((w) => w.length > 0).length;
      });
      setWordCount(totalWords);
    } catch (e) {
      setWordCount(0);
    }
  }, [activeNote.content]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-white relative">
      {/* Mobile Header - Dibuat lebih tipis */}
      <div className="md:hidden flex items-center px-4 py-2 border-b border-gray-100 bg-white">
        <button onClick={onBack} className="flex items-center gap-1 text-indigo-600 font-bold text-xs">
          <BiChevronLeft size={18} /> Back
        </button>
      </div>

      {/* Header Area: Padding dikurangi dari pt-10 menjadi pt-6 */}
      <div className="px-6 md:px-12 pt-4 md:pt-8">
        <Breadcrumbs activeNote={activeNote} folders={folders} allNotes={allNotes} onSelectNote={onSelectNote} />

        <div className="flex justify-between items-start gap-4 mb-1">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                debouncedTitleUpdate(activeNote.id, e.target.value);
              }}
              rows="1"
              // Font size dikurangi dari 5xl menjadi 4xl agar tidak terlalu dominan
              className="text-2xl md:text-4xl font-black w-full outline-none bg-transparent text-gray-900 tracking-tight resize-none leading-tight overflow-hidden placeholder:text-gray-100"
              placeholder="Untitled Note"
            />

            {/* Metadata: Margin top dikurangi dari mt-4 menjadi mt-2 */}
            <div className="flex flex-wrap items-center gap-4 mt-2 text-[12px] text-gray-400 font-medium">
              <span className="flex items-center gap-1.5">
                <BiTimeFive className="text-indigo-400" size={14} />
                {new Date(activeNote.updatedAt).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <BiText className="text-indigo-400" size={14} />
                {wordCount} Words
              </span>
            </div>
          </div>

          <button onClick={() => onDeleteTrigger(activeNote, "note")} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0 mt-1">
            <BiTrash size={20} />
          </button>
        </div>
        {/* Pemisah: Margin dikurangi agar konten naik */}
        <hr className="border-gray-50 mt-4" />
      </div>

      {/* Content Area: pt-6 dikurangi menjadi pt-2 */}
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-20 pt-2">
        <NoteEditor initialContent={activeNote.content} onChange={(content) => updateNoteContent(activeNote.id, content)} />
      </div>

      {/* Footer Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-50 px-6 py-2 flex items-center justify-between text-[10px] text-gray-400 font-bold tracking-wider uppercase">
        <span>Read: {Math.ceil(wordCount / 200)} min</span>
      </div>
    </motion.div>
  );
};

const NotesPage = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { folders, notes, recentNotes, activeNote, setActiveNote, addFolder, updateFolderTitle, deleteFolderFromDB, addNote, moveNoteToFolder, updateNoteContent, updateNoteTitle, deleteNoteFromDB, updateFolderColor } = useNotes();

  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputModal, setInputModal] = useState({ isOpen: false, parentId: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: "note", data: null });

  useEffect(() => {
    if (noteId && notes.length > 0) {
      const target = notes.find((n) => n.id === parseInt(noteId));
      if (target) {
        setActiveNote(target);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
      }
    }
  }, [noteId, notes]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    moveNoteToFolder(draggableId, destination.droppableId);
  };

  return (
    <NotesLayout onCreateFolder={() => setInputModal({ isOpen: true, parentId: null })} onCreateNote={async () => navigate(`/notes/${await addNote(null)}`)}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-1 h-full overflow-hidden bg-white">
          <aside className={`${isSidebarOpen ? "w-full md:w-80" : "w-0"} border-r border-gray-200 bg-gray-50 flex flex-col transition-all duration-300 overflow-hidden shrink-0`}>
            <div className="p-4">
              <div className="relative">
                <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm" />
              </div>
            </div>
            <FolderTree
              folders={folders}
              notes={notes}
              recentNotes={recentNotes}
              activeNote={activeNote}
              onSelectNote={(n) => {
                setActiveNote(n);
                navigate(`/notes/${n.id}`);
              }}
              onAddSubNote={async (fid) => navigate(`/notes/${await addNote(fid)}`)}
              onAddSubFolder={(fid) => setInputModal({ isOpen: true, parentId: fid })}
              onDeleteNote={(n) => setConfirmModal({ isOpen: true, type: "note", data: n })}
              onRenameFolder={(id, name) => updateFolderTitle(id, name)}
              onDeleteFolder={(f) => setConfirmModal({ isOpen: true, type: "folder", data: f })}
              onUpdateFolderColor={(id, color) => updateFolderColor(id, color)}
              searchTerm={searchTerm}
            />
          </aside>
          <main className="flex-1 bg-white min-w-0">
            {activeNote ? (
              <NoteContentEditor
                key={activeNote.id}
                activeNote={activeNote}
                folders={folders}
                allNotes={notes}
                onSelectNote={setActiveNote}
                updateNoteTitle={updateNoteTitle}
                updateNoteContent={updateNoteContent}
                onDeleteTrigger={(item, type) => setConfirmModal({ isOpen: true, type, data: item })}
                onBack={() => setIsSidebarOpen(true)}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                <BiNote size={40} className="opacity-20 mb-4" />
                <h3 className="text-xl font-bold text-gray-800">Ready to study?</h3>
              </div>
            )}
          </main>
        </div>
      </DragDropContext>
      <InputModal
        isOpen={inputModal.isOpen}
        title="Folder Baru"
        onClose={() => setInputModal({ isOpen: false, parentId: null })}
        onSubmit={(v) => {
          addFolder(v, inputModal.parentId);
          setInputModal({ isOpen: false, parentId: null });
        }}
      />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Confirm Delete"
        message="Action cannot be undone."
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={() => {
          if (confirmModal.type === "note") {
            deleteNoteFromDB(confirmModal.data.id);
            navigate("/notes");
          } else deleteFolderFromDB(confirmModal.data.id);
        }}
      />
    </NotesLayout>
  );
};

export default NotesPage;
