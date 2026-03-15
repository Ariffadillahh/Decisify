import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BiSearch, BiNote, BiEditAlt, BiTrash, BiChevronLeft, BiText, BiTimeFive, BiBrain, BiLoaderAlt, BiCheckCircle, BiAlignLeft, BiListUl, BiExtension } from "react-icons/bi";
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

  // AI Feature States
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState("loading"); // loading | success

  // Configuration & Validation States
  const [showConfig, setShowConfig] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [configType, setConfigType] = useState(null);
  const [configValue, setConfigValue] = useState(3);

  const MIN_WORDS = {
    summary: 50,
    keypoints: 100,
    quiz: 150,
  };

  // Debounce update judul ke database
  const debouncedTitleUpdate = useMemo(() => debounce((id, val) => updateNoteTitle(id, val), 800), [updateNoteTitle]);

  // Efek untuk auto-resize textarea judul agar tidak ada scrollbar internal
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [title]);

  useEffect(() => {
    return () => debouncedTitleUpdate.cancel();
  }, [debouncedTitleUpdate]);

  // Efek untuk menghitung jumlah kata dari konten JSON TipTap/Editor
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
        if (text) {
          totalWords += text
            .trim()
            .split(/\s+/)
            .filter((w) => w.length > 0).length;
        }
      });
      setWordCount(totalWords);
    } catch (e) {
      setWordCount(0);
    }
  }, [activeNote.content]);

  // Tahap 1: Memilih fitur AI dan Validasi
  const handleSelectOption = (type) => {
    setIsAiMenuOpen(false);
    setConfigType(type);

    if (wordCount < MIN_WORDS[type]) {
      setShowWarning(true);
      return;
    }

    // Set nilai default slider berdasarkan tipe
    if (type === "summary") setConfigValue(2);
    if (type === "keypoints") setConfigValue(5);
    if (type === "quiz") setConfigValue(3);

    setShowConfig(true);
  };

  // Tahap 2: Menjalankan Gimmick Loading
  const startAiGimmick = () => {
    setShowConfig(false);
    setAiLoading(true);
    setAiStatus("loading");

    setTimeout(() => {
      setAiStatus("success");
      setTimeout(() => {
        setAiLoading(false);
      }, 1500);
    }, 3000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-white relative">
      {/* Mobile Navigation Header */}
      <div className="md:hidden flex items-center px-4 py-2 border-b border-gray-100 bg-white">
        <button onClick={onBack} className="flex items-center gap-1 text-indigo-600 font-bold text-xs">
          <BiChevronLeft size={18} /> Back
        </button>
      </div>

      {/* Editor Header Area */}
      <div className="px-6 md:px-12 pt-4 md:pt-8">
        <Breadcrumbs activeNote={activeNote} folders={folders} allNotes={allNotes} onSelectNote={onSelectNote} />

        <div className="flex justify-between items-start gap-4 mb-1">
          {/* Sisi Kiri: Judul dan Metadata */}
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                debouncedTitleUpdate(activeNote.id, e.target.value);
              }}
              rows="1"
              className="text-2xl md:text-4xl font-black w-full outline-none bg-transparent text-gray-900 tracking-tight resize-none leading-tight overflow-hidden placeholder:text-gray-100"
              placeholder="Untitled Note"
            />

            <div className="flex flex-wrap items-center justify-between gap-4 mt-2 text-[12px] text-gray-400 font-medium">
              <div className="flex gap-4 items-center">
                <span className="flex items-center gap-1.5 font-bold">
                  <BiTimeFive className="text-indigo-400" size={14} />
                  {new Date(activeNote.updatedAt).toLocaleString("id-ID", { day: "numeric", month: "long" })}
                </span>
                <span className={`flex items-center gap-1.5 font-bold px-2 py-0.5 rounded-md transition-colors ${wordCount < 50 ? "bg-orange-50 text-orange-500" : "bg-gray-50 text-gray-400"}`}>
                  <BiText size={14} />
                  {wordCount} Words
                </span>
              </div>

              {/* AI Tools Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100 cursor-pointer text-[10px] uppercase tracking-widest"
                >
                  <BiBrain size={16} /> AI Intelligence
                </button>

                <AnimatePresence>
                  {isAiMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsAiMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-20 p-1"
                      >
                        {["summary", "keypoints", "quiz"].map((type) => (
                          <button key={type} onClick={() => handleSelectOption(type)} className="flex items-center justify-between w-full px-4 py-3 hover:bg-indigo-50 rounded-xl transition-colors group cursor-pointer">
                            <div className="flex items-center gap-3">
                              {type === "summary" ? <BiAlignLeft className="text-indigo-500" /> : type === "keypoints" ? <BiListUl className="text-indigo-500" /> : <BiExtension className="text-indigo-500" />}
                              <span className="text-gray-700 font-bold capitalize">AI {type}</span>
                            </div>
                            <span className="text-[9px] font-black text-gray-300 group-hover:text-indigo-300 uppercase">Min {MIN_WORDS[type]}w</span>
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Tombol Hapus */}
          <button onClick={() => onDeleteTrigger(activeNote, "note")} className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0 mt-1" title="Hapus Catatan">
            <BiTrash size={22} />
          </button>
        </div>
        <hr className="border-gray-50 mt-4" />
      </div>

      {/* Actual Content Editor */}
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-20 pt-2">
        <NoteEditor initialContent={activeNote.content} onChange={(content) => updateNoteContent(activeNote.id, content)} />
      </div>

      {/* Metadata Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-50 px-6 py-2 flex items-center justify-between text-[10px] text-gray-400 font-bold tracking-wider uppercase">
        <span>Est. Read: {Math.ceil(wordCount / 200)} min</span>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Offline Database Ready
        </div>
      </div>

      {/* --- MODALS AREA --- */}

      {/* 1. Custom Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-sm bg-gray-900/20">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl p-8 shadow-2xl max-w-xs w-full text-center border-b-4 border-orange-500">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BiText size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Catatan Terlalu Pendek</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed font-medium">
                Kamu butuh minimal <span className="font-bold text-indigo-600">{MIN_WORDS[configType]} kata</span> untuk menggunakan fitur <span className="capitalize">{configType}</span>.
              </p>
              <button onClick={() => setShowWarning(false)} className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all cursor-pointer">
                Saya Mengerti
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Configuration Modal */}
      <AnimatePresence>
        {showConfig && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md bg-gray-900/40">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full relative border-t-8 border-indigo-600">
              <h3 className="text-xl font-black text-gray-800 mb-2 uppercase italic tracking-tighter">AI Setup</h3>
              <p className="text-sm text-gray-500 mb-8 font-medium italic">Berapa banyak hasil yang kamu inginkan?</p>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Jumlah {configType === "summary" ? "Paragraf" : configType === "keypoints" ? "Poin Utama" : "Soal Kuis"}</label>
                  <span className="text-3xl font-black text-indigo-600 leading-none">{configValue}</span>
                </div>
                <input type="range" min="1" max="10" value={configValue} onChange={(e) => setConfigValue(e.target.value)} className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowConfig(false)} className="flex-1 py-3 font-bold text-gray-400 hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
                  Batal
                </button>
                <button onClick={startAiGimmick} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:scale-[1.02] transition-all cursor-pointer">
                  Generate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Loading & Success Modal */}
      <AnimatePresence>
        {aiLoading && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-2xl bg-indigo-950/30">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[40px] p-12 shadow-2xl flex flex-col items-center max-w-xs w-full text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-indigo-100 rounded-3xl animate-ping opacity-20"></div>
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center relative">
                  {aiStatus === "loading" ? <BiLoaderAlt className="text-indigo-600 animate-spin" size={40} /> : <BiCheckCircle className="text-green-500 animate-bounce" size={40} />}
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 uppercase italic leading-none">{aiStatus === "loading" ? "Thinking..." : "Great!"}</h3>
              <p className="text-xs text-gray-500 mt-4 font-bold tracking-tight px-4 leading-relaxed uppercase">
                {aiStatus === "loading" ? `AI sedang meracik ${configValue} ${configType} spesial untukmu.` : `${configValue} ${configType} siap dipelajari!`}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
