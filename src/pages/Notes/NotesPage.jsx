import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from "react";
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
  useLayoutEffect(() => {
    const adjustHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    // Jalankan kalkulasi
    adjustHeight();

    // Tambahkan sedikit delay untuk memastikan font sudah ter-load (opsional tapi ampuh)
    const timeoutId = setTimeout(adjustHeight, 0);
    return () => clearTimeout(timeoutId);
  }, [title, activeNote.id]);

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-white relative overflow-hidden min-w-0">
      {/* 1. STICKY MOBILE HEADER: Memberikan akses navigasi cepat di HP */}
      <div className="md:hidden flex items-center justify-between px-4 py-2.5 border-b border-slate-50 bg-white/80 backdrop-blur-md sticky top-0 z-20 shrink-0">
        <button onClick={onBack} className="flex items-center gap-1 text-indigo-600 font-bold text-xs cursor-pointer">
          <BiChevronLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setIsAiMenuOpen(true)} className="p-2 bg-indigo-50 text-indigo-600 rounded-xl cursor-pointer active:scale-90 transition-transform">
            <BiBrain size={18} />
          </button>
          <button onClick={() => onDeleteTrigger(activeNote, "note")} className="p-2 bg-red-50 text-red-500 rounded-xl cursor-pointer">
            <BiTrash size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* 2. HEADER EDITOR: Ramping di mobile, Luas di desktop */}
        <div className="px-5 md:px-12 pt-3 md:pt-8">
          <div className="hidden md:block">
            <Breadcrumbs activeNote={activeNote} folders={folders} allNotes={allNotes} onSelectNote={onSelectNote} />
          </div>

          <div className="flex justify-between items-start gap-4 mt-1 min-w-0">
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  debouncedTitleUpdate(activeNote.id, e.target.value);
                }}
                rows="1"
                className="text-2xl md:text-4xl font-black w-full outline-none bg-transparent text-slate-900 tracking-tight resize-none leading-tight overflow-hidden placeholder:text-slate-100 word-break-words"
                placeholder="Untitled Note"
              />

              {/* Metadata Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mt-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider min-w-0">
                <div className="flex gap-4 items-center">
                  <span className="flex items-center gap-1.5">
                    <BiTimeFive className="text-indigo-400" size={14} />
                    {new Date(activeNote.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                  </span>
                  <span className={`flex items-center gap-1.5 ${wordCount < 50 ? "text-orange-400" : ""}`}>
                    <BiText size={14} />
                    {wordCount} Words
                  </span>
                </div>

                {/* AI Button (Desktop Only - Mobile pakai Header Sticky) */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100 cursor-pointer text-[10px] tracking-widest"
                  >
                    <BiBrain size={16} /> AI Intelligence
                  </button>
                </div>
              </div>
            </div>

            {/* Trash Button (Desktop Only) */}
            <button onClick={() => onDeleteTrigger(activeNote, "note")} className="hidden md:block p-2.5 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0 mt-1 cursor-pointer">
              <BiTrash size={22} />
            </button>
          </div>
          <hr className="border-slate-50 mt-4" />
        </div>

        {/* 3. CONTENT AREA: Menghilangkan padding samping di mobile agar lega */}
        <div className="px-4 md:px-10 pb-20 pt-2 min-w-0">
          <NoteEditor initialContent={activeNote.content} onChange={(content) => updateNoteContent(activeNote.id, content)} />
        </div>
      </div>

      {/* 4. MODAL AI MENU (Action Sheet Style on Mobile) */}
      <AnimatePresence>
        {isAiMenuOpen && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAiMenuOpen(false)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full md:max-w-sm rounded-t-[2.5rem] md:rounded-[2rem] p-8 shadow-2xl z-10 relative overflow-hidden"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 md:hidden" />
              <h3 className="text-xl font-black text-slate-800 mb-1 uppercase italic tracking-tighter">AI Assistant</h3>
              <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-widest">Pilih mode analisis cerdas</p>

              <div className="grid gap-2.5">
                {["summary", "keypoints", "quiz"].map((type) => (
                  <button key={type} onClick={() => handleSelectOption(type)} className="flex items-center justify-between w-full p-4 hover:bg-indigo-50 bg-slate-50 rounded-2xl transition-all group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-500 group-hover:scale-110 transition-transform">
                        {type === "summary" ? <BiAlignLeft size={20} /> : type === "keypoints" ? <BiListUl size={20} /> : <BiExtension size={20} />}
                      </div>
                      <span className="text-slate-700 font-bold capitalize">AI {type}</span>
                    </div>
                    <span className="text-[9px] font-black text-slate-300 uppercase">Min {MIN_WORDS[type]}w</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODALS LAIN (Warning, Config, Loading) --- */}
      <AnimatePresence>
        {/* Warning Modal */}
        {showWarning && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/20">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[2rem] p-8 shadow-2xl max-w-xs w-full text-center border-b-8 border-orange-500">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
                <BiText size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-800 uppercase italic">Terlalu Pendek</h3>
              <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                Kamu butuh minimal <span className="text-indigo-600 font-black">{MIN_WORDS[configType]} kata</span> untuk menggunakan AI {configType}.
              </p>
              <button onClick={() => setShowWarning(false)} className="mt-8 w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 cursor-pointer">
                Siap, Bos!
              </button>
            </motion.div>
          </div>
        )}

        {/* Config Modal */}
        {showConfig && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/40">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-8 shadow-2xl max-w-sm w-full relative border-t-8 border-indigo-600">
              <h3 className="text-xl font-black text-slate-800 uppercase italic">Setup Intelligence</h3>
              <p className="text-sm text-slate-400 mt-1 font-bold">Berapa banyak output yang kamu inginkan?</p>
              <div className="mt-10 mb-10">
                <div className="flex justify-between items-end mb-4">
                  <label className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Jumlah {configType}</label>
                  <span className="text-4xl font-black text-indigo-600">{configValue}</span>
                </div>
                <input type="range" min="1" max="10" value={configValue} onChange={(e) => setConfigValue(e.target.value)} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowConfig(false)} className="flex-1 py-4 font-bold text-slate-300 hover:text-slate-500 transition-colors">
                  Batal
                </button>
                <button onClick={startAiGimmick} className="flex-1 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 cursor-pointer">
                  Generate
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Loading Gimmick */}
        {aiLoading && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-2xl bg-indigo-950/20">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white rounded-[3rem] p-12 shadow-2xl flex flex-col items-center max-w-xs w-full text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 bg-indigo-200 rounded-3xl animate-ping opacity-20"></div>
                {aiStatus === "loading" ? <BiLoaderAlt className="text-indigo-600 animate-spin" size={40} /> : <BiCheckCircle className="text-green-500 animate-bounce" size={40} />}
              </div>
              <h3 className="text-2xl font-black text-slate-900 italic uppercase">{aiStatus === "loading" ? "Analyzing..." : "Finished!"}</h3>
              <p className="text-[10px] text-slate-400 mt-4 font-black uppercase tracking-widest leading-loose">AI asistenmu sedang memproses materi kuliah ini</p>
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
            // 1. Jalankan fungsi hapus
            deleteNoteFromDB(confirmModal.data.id);

            // 2. Navigasi kembali ke root notes
            navigate("/notes");

            // 3. PENTING: Buka kembali sidebar agar tidak stuck di layar kosong
            setIsSidebarOpen(true);

            setConfirmModal({ ...confirmModal, isOpen: false });
          } else {
            deleteFolderFromDB(confirmModal.data.id);
            setConfirmModal({ ...confirmModal, isOpen: false });
          }
        }}
      />
    </NotesLayout>
  );
};

export default NotesPage;
