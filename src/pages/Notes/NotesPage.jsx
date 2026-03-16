import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BiSearch,
  BiNote,
  BiEditAlt,
  BiTrash,
  BiChevronLeft,
  BiText,
  BiTimeFive,
  BiBrain,
  BiLoaderAlt,
  BiCheckCircle,
  BiAlignLeft,
  BiListUl,
  BiExtension,
  BiX,
  BiCopyAlt,
  BiChevronDown,
  BiChevronUp,
} from "react-icons/bi";
import { debounce } from "lodash";
import { DragDropContext } from "@hello-pangea/dnd";

import NotesLayout from "./NotesLayout";
import NoteEditor from "../../components/NotesComponents/NoteEditor";
import InputModal from "../../components/NotesComponents/InputModal";
import ConfirmModal from "../../components/NotesComponents/ConfirmModal";
import FolderTree from "../../components/NotesComponents/FolderTree";
import Breadcrumbs from "../../components/NotesComponents/Breadcrumbs";
import { useNotes } from "../../hooks/useNotes";
import { useAiAssistant } from "../../hooks/useAiAssistant";

const NoteContentEditor = ({
  activeNote,
  folders,
  allNotes,
  onSelectNote,
  updateNoteTitle,
  updateNoteContent,
  onDeleteTrigger,
  onBack,
}) => {
  const [title, setTitle] = useState(activeNote?.title || "");
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef(null);

  // --- AI HOOK & STATES ---
  const {
    generateAi,
    loading: aiLoading,
    result: aiResult,
    resetResult,
  } = useAiAssistant();
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const [showResultModal, setShowResultModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  const [configType, setConfigType] = useState(null);
  const [configValue, setConfigValue] = useState(3);

  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const MIN_WORDS = { summary: 50, keypoints: 100, quiz: 150 };

  const getPlainText = (jsonContent) => {
    if (!jsonContent) return "";
    try {
      const blocks =
        typeof jsonContent === "string" ? JSON.parse(jsonContent) : jsonContent;
      const contentArray = Array.isArray(blocks)
        ? blocks
        : blocks?.content || [];
      return contentArray
        .map((block) => {
          if (block.content && Array.isArray(block.content)) {
            return block.content.map((item) => item.text || "").join("");
          }
          return "";
        })
        .join("\n");
    } catch (e) {
      return "";
    }
  };

  useEffect(() => {
    setTitle(activeNote?.title || "");
    resetResult();
    setShowResultModal(false);
    setShowQuizModal(false);
    setUserAnswers({});
    setQuizSubmitted(false);
  }, [activeNote?.id]);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const adjustHeight = () => {
      textarea.style.setProperty("height", "0px", "important");
      textarea.style.setProperty(
        "height",
        `${textarea.scrollHeight}px`,
        "important",
      );
    };
    const resizeObserver = new ResizeObserver(adjustHeight);
    resizeObserver.observe(textarea);
    adjustHeight();
    return () => resizeObserver.disconnect();
  }, [title, activeNote?.id]);

  const debouncedTitleUpdate = useMemo(
    () => debounce((id, val) => updateNoteTitle(id, val), 800),
    [updateNoteTitle],
  );

  useEffect(() => {
    const text = getPlainText(activeNote?.content);
    setWordCount(
      text
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0).length,
    );
  }, [activeNote?.content]);

  const handleSelectOption = (type) => {
    setIsAiMenuOpen(false);
    setConfigType(type);
    if (wordCount < MIN_WORDS[type]) {
      setShowWarning(true);
      return;
    }
    setConfigValue(type === "summary" ? 2 : 3);
    setShowConfig(true);
  };

  const handleGenerateAi = async () => {
    setShowConfig(false);
    const plainText = getPlainText(activeNote?.content);
    const res = await generateAi(configType, plainText, configValue);

    if (res.success) {
      if (configType === "quiz") {
        setShowQuizModal(true);
      } else {
        setShowResultModal(true);
      }
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  const handleInsertToNote = () => {
    const data = aiResult?.data;
    if (!data) return;
    try {
      let parsed =
        typeof activeNote.content === "string"
          ? JSON.parse(activeNote.content)
          : activeNote.content;
      let blocks = Array.isArray(parsed) ? parsed : [];
      const newBlocks = [
        {
          type: "heading",
          props: {
            level: 3,
            textColor: "default",
            backgroundColor: "default",
            textAlignment: "left",
          },
          content: [
            {
              type: "text",
              text: `AI ${configType === "summary" ? "Summary" : "Key Points"}`,
              styles: { bold: true },
            },
          ],
        },
      ];
      if (configType === "keypoints" && Array.isArray(data.key_points)) {
        data.key_points.forEach((point) => {
          newBlocks.push({
            type: "bulletListItem",
            content: [{ type: "text", text: point, styles: {} }],
          });
        });
      } else {
        newBlocks.push({
          type: "paragraph",
          content: [{ type: "text", text: data.summary || "", styles: {} }],
        });
      }
      updateNoteContent(
        activeNote.id,
        JSON.stringify([...blocks, ...newBlocks]),
      );
      setShowResultModal(false);
      resetResult();
    } catch (e) {
      console.error("Insert error:", e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-white relative overflow-hidden min-w-0"
    >
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-20 shrink-0 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-indigo-600 font-bold text-sm cursor-pointer active:scale-95 transition-transform"
        >
          <BiChevronLeft size={24} /> Kembali
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAiMenuOpen(true)}
            className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl active:scale-90 transition-transform shadow-sm"
          >
            <BiBrain size={20} />
          </button>
          <button
            onClick={() => onDeleteTrigger(activeNote, "note")}
            className="p-2.5 bg-red-50 text-red-500 rounded-xl active:scale-90 transition-transform shadow-sm"
          >
            <BiTrash size={20} />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="px-5 md:px-12 pt-5 md:pt-10">
          <div className="hidden md:block">
            <Breadcrumbs
              activeNote={activeNote}
              folders={folders}
              allNotes={allNotes}
              onSelectNote={onSelectNote}
            />
          </div>

          <div className="flex justify-between items-start gap-4 mt-2 min-w-0">
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  debouncedTitleUpdate(activeNote?.id, e.target.value);
                }}
                rows="1"
                className="text-3xl md:text-5xl font-black w-full outline-none bg-transparent text-slate-900 tracking-tight resize-none leading-[1.1] overflow-hidden placeholder:text-slate-200 break-words block p-0 m-0 border-none min-h-0"
                placeholder="Untitled Note"
              />
              <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] md:text-xs text-slate-400 font-bold uppercase tracking-wider min-w-0">
                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                  <BiTimeFive className="text-indigo-400" size={16} />{" "}
                  {activeNote?.updatedAt
                    ? new Date(activeNote.updatedAt).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "short" },
                      )
                    : "-"}
                </span>
                <span
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${wordCount < 50 ? "bg-orange-50 text-orange-500" : "bg-slate-50"}`}
                >
                  <BiText size={16} /> {wordCount} Words
                </span>

                {/* Desktop AI Button */}
                <button
                  onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
                  className="hidden md:flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:-translate-y-0.5 transition-all font-bold shadow-lg shadow-indigo-100/50 cursor-pointer ml-auto"
                >
                  <BiBrain size={18} /> AI Intelligence
                </button>
              </div>
            </div>

            <button
              onClick={() => onDeleteTrigger(activeNote, "note")}
              className="hidden md:flex items-center justify-center p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shrink-0 mt-1 cursor-pointer"
            >
              <BiTrash size={24} />
            </button>
          </div>
          <hr className="border-slate-100 mt-6 md:mt-8" />
        </div>

        <div className="px-5 md:px-12 pb-32 pt-4 min-w-0">
          <NoteEditor
            initialContent={activeNote?.content}
            onChange={(content) => updateNoteContent(activeNote?.id, content)}
          />
        </div>
      </div>

      <AnimatePresence>
        {/* MODAL: AI MENU (Bottom Sheet di Mobile, Modal Center di Desktop) */}
        {isAiMenuOpen && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsAiMenuOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full md:max-w-md rounded-t-[2rem] md:rounded-[2rem] p-6 md:p-8 shadow-2xl z-10 relative overflow-hidden"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden" />
              <h3 className="text-2xl font-black text-slate-800 mb-1 uppercase italic tracking-tighter">
                AI Assistant
              </h3>
              <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-widest">
                Pilih mode analisis
              </p>

              <div className="grid gap-3 pb-4 md:pb-0">
                {["summary", "keypoints", "quiz"].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleSelectOption(type)}
                    className="flex items-center justify-between w-full p-4 hover:bg-indigo-50 bg-slate-50 border border-slate-100 hover:border-indigo-100 rounded-2xl transition-all group cursor-pointer active:scale-95"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-white rounded-xl shadow-sm text-indigo-500 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {type === "summary" ? (
                          <BiAlignLeft size={22} />
                        ) : type === "keypoints" ? (
                          <BiListUl size={22} />
                        ) : (
                          <BiExtension size={22} />
                        )}
                      </div>
                      <span className="text-slate-700 font-bold text-sm md:text-base capitalize">
                        AI {type}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase bg-white px-2 py-1 rounded-md shadow-sm">
                      Min {MIN_WORDS[type]}w
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* LOADING MODAL */}
        {aiLoading && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-indigo-950/40 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-2xl flex flex-col items-center"
            >
              <BiLoaderAlt
                className="text-indigo-600 animate-spin mb-6"
                size={56}
              />
              <h3 className="text-xl md:text-2xl font-black text-slate-900 italic uppercase leading-none">
                Analyzing...
              </h3>
              <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">
                Harap tunggu sebentar
              </p>
            </motion.div>
          </div>
        )}

        {/* MODAL LAINNYA: Config & Warning */}
        {showConfig && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl max-w-[90%] md:max-w-sm w-full relative border-t-8 border-indigo-600"
            >
              <h3 className="text-xl font-black text-slate-800 uppercase italic leading-none">
                Setup Intelligence
              </h3>
              <div className="mt-8 mb-8">
                <div className="flex justify-between items-end mb-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                    Jumlah {configType}
                  </label>
                  <span className="text-5xl font-black text-indigo-600 leading-none">
                    {configValue}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={configValue}
                  onChange={(e) => setConfigValue(e.target.value)}
                  className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfig(false)}
                  className="flex-1 py-4 font-bold text-slate-400 bg-slate-50 rounded-2xl uppercase text-xs tracking-widest cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleGenerateAi}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase text-xs tracking-widest cursor-pointer"
                >
                  Generate
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showWarning && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl max-w-[90%] md:max-w-xs w-full text-center border-b-8 border-orange-500"
            >
              <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <BiText size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase italic leading-tight">
                Terlalu Pendek
              </h3>
              <p className="text-sm text-slate-500 mt-3 font-medium leading-relaxed">
                Dibutuhkan minimal{" "}
                <span className="text-indigo-600 font-black">
                  {MIN_WORDS[configType]} kata
                </span>{" "}
                agar AI bisa menganalisis dengan baik.
              </p>
              <button
                onClick={() => setShowWarning(false)}
                className="mt-8 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold uppercase text-xs tracking-widest cursor-pointer transition-colors"
              >
                Saya Mengerti
              </button>
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
  const {
    folders,
    notes,
    recentNotes,
    activeNote,
    setActiveNote,
    addFolder,
    updateFolderTitle,
    deleteFolderFromDB,
    addNote,
    moveNoteToFolder,
    updateNoteContent,
    updateNoteTitle,
    deleteNoteFromDB,
    updateFolderColor,
  } = useNotes();

  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputModal, setInputModal] = useState({
    isOpen: false,
    parentId: null,
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "note",
    data: null,
  });

  // 1. REAKTIF TERHADAP RESIZE WINDOW (Fix Responsiveness)
  useEffect(() => {
    const handleResize = () => {
      // Jika layar adalah Tablet/Desktop, SELALU tampilkan sidebar
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        // Jika layar HP dan ada catatan yang sedang dibuka, sembunyikan sidebar
        if (activeNote) {
          setIsSidebarOpen(false);
        } else {
          setIsSidebarOpen(true);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    // Eksekusi sekali saat komponen di-mount
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [activeNote]);

  // 2. DETEKSI URL PARAMS
  useEffect(() => {
    if (noteId && notes.length > 0) {
      const target = notes.find((n) => n.id === parseInt(noteId));
      if (target) {
        setActiveNote(target);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
      }
    } else if (!noteId) {
      setIsSidebarOpen(true);
      setActiveNote(null);
    }
  }, [noteId, notes]);

  const handleMobileBack = () => {
    navigate("/notes");
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    moveNoteToFolder(draggableId, destination.droppableId);
  };

  return (
    <NotesLayout
      onCreateFolder={() => setInputModal({ isOpen: true, parentId: null })}
      onCreateNote={async () => navigate(`/notes/${await addNote(null)}`)}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-1 h-full overflow-hidden bg-white">
          {/* SIDEBAR - Full Width di HP, Fixed 320px di Desktop */}
          <aside
            className={`${isSidebarOpen ? "flex w-full md:w-80" : "hidden md:flex md:w-80"} border-r border-slate-100 bg-slate-50/50 flex-col transition-all duration-300 overflow-hidden shrink-0 z-10`}
          >
            <div className="p-4 md:p-5">
              <div className="relative">
                <BiSearch
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Cari catatan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all shadow-sm"
                />
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
              onAddSubNote={async (fid) =>
                navigate(`/notes/${await addNote(fid)}`)
              }
              onAddSubFolder={(fid) =>
                setInputModal({ isOpen: true, parentId: fid })
              }
              onDeleteNote={(n) =>
                setConfirmModal({ isOpen: true, type: "note", data: n })
              }
              onRenameFolder={(id, name) => updateFolderTitle(id, name)}
              onDeleteFolder={(f) =>
                setConfirmModal({ isOpen: true, type: "folder", data: f })
              }
              onUpdateFolderColor={(id, color) => updateFolderColor(id, color)}
              searchTerm={searchTerm}
            />
          </aside>

          {/* MAIN EDITOR CONTENT */}
          <main
            className={`${!isSidebarOpen ? "flex" : "hidden md:flex"} flex-1 flex-col bg-white min-w-0 shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.05)] z-20`}
          >
            {activeNote ? (
              <NoteContentEditor
                key={activeNote.id}
                activeNote={activeNote}
                folders={folders}
                allNotes={notes}
                onSelectNote={setActiveNote}
                updateNoteTitle={updateNoteTitle}
                updateNoteContent={updateNoteContent}
                onDeleteTrigger={(item, type) =>
                  setConfirmModal({ isOpen: true, type, data: item })
                }
                onBack={handleMobileBack}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-700 p-8 text-center bg-slate-50/30">
                <div className="bg-white p-8 flex flex-col items-center">
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                    <BiNote size={40} className="text-indigo-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-800 break-words tracking-tight">
                    Ruang Coretan
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 font-medium max-w-[250px] leading-relaxed">
                    Pilih catatan dari samping atau buat catatan baru untuk
                    mulai menulis.
                  </p>
                </div>
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
        title="Hapus Data?"
        message="Data yang dihapus tidak dapat dikembalikan."
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={() => {
          if (confirmModal.type === "note") {
            deleteNoteFromDB(confirmModal.data.id);
            navigate("/notes");
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
