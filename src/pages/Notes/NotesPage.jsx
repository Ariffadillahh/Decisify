import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BiSearch,
  BiNote,
  BiTrash,
  BiChevronLeft,
  BiText,
  BiTimeFive,
  BiBrain,
  BiLoaderAlt,
  BiAlignLeft,
  BiListUl,
  BiExtension,
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
import BaseModal from "../../components/Modal/BaseModal";
import { IoMdClose } from "react-icons/io";

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
              text: `AI ${configType === "summary" ? "Summary" : configType === "keypoints" ? "Key Points" : "Quiz"}`,
              styles: { bold: true },
            },
          ],
        },
      ];

      const parseTextWithStyles = (text) => {
        const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|"[^"]+")/g);

        return parts
          .filter((p) => p.length > 0)
          .map((part) => {
            let styles = {};
            let cleanText = part;

            if (cleanText.startsWith("**") && cleanText.endsWith("**")) {
              styles.bold = true;
              cleanText = cleanText.slice(2, -2);
            } else if (cleanText.startsWith("*") && cleanText.endsWith("*")) {
              styles.italic = true;
              cleanText = cleanText.slice(1, -1);
            } else if (cleanText.startsWith('"') && cleanText.endsWith('"')) {
              styles.bold = true;
              cleanText = cleanText.slice(1, -1);
            }

            return { type: "text", text: cleanText, styles };
          });
      };

      if (configType === "keypoints" && Array.isArray(data.key_points)) {
        data.key_points.forEach((point) => {
          newBlocks.push({
            type: "bulletListItem",
            content: parseTextWithStyles(point),
          });
        });
      } else if (configType === "summary" && data.summary) {
        let cleanSummary = data.summary
          .replace(
            /^(Berikut adalah|Ini adalah|Berikut ringkasan)[^:]*:\s*/i,
            "",
          )
          .trim();

        const paragraphs = cleanSummary.split(/\n+/);

        paragraphs.forEach((p, index) => {
          if (p.trim()) {
            newBlocks.push({
              type: "paragraph",
              content: parseTextWithStyles(p.trim()),
            });

            if (index < paragraphs.length - 1) {
              newBlocks.push({
                type: "paragraph",
                content: [{ type: "text", text: "", styles: {} }],
              });
            }
          }
        });
      } else if (configType === "quiz" && (data.quiz || aiResult?.quiz)) {
        const quizList = data.quiz || aiResult?.quiz;

        quizList.forEach((q, idx) => {
          newBlocks.push({
            type: "paragraph",
            content: [
              { type: "text", text: `${idx + 1}. `, styles: { bold: true } },
              ...parseTextWithStyles(q.question),
            ],
          });

          q.choices.forEach((choice) => {
            newBlocks.push({
              type: "bulletListItem",
              content: parseTextWithStyles(`${choice.id}. ${choice.text}`),
            });
          });

          newBlocks.push({
            type: "paragraph",
            content: [
              {
                type: "text",
                text: `Jawaban: ${q.correct_answer} - ${q.explanation}`,
                styles: { italic: true },
              },
            ],
          });

          newBlocks.push({
            type: "paragraph",
            content: [{ type: "text", text: "", styles: {} }],
          });
        });
      }

      updateNoteContent(
        activeNote.id,
        JSON.stringify([...blocks, ...newBlocks]),
      );

      if (configType === "quiz") {
        setShowQuizModal(false);
      } else {
        setShowResultModal(false);
      }
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
      <div className="xl:hidden flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-20 shrink-0 shadow-sm">
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

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="px-5 lg:px-12 pt-5 lg:pt-10">
          <div className="hidden lg:block">
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
                className="text-3xl lg:text-5xl font-black w-full outline-none bg-transparent text-slate-900 tracking-tight resize-none leading-[1.1] overflow-hidden placeholder:text-slate-200 break-words block p-0 m-0 border-none min-h-0"
                placeholder="Untitled Note"
              />
              <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] lg:text-xs text-slate-400 font-bold uppercase tracking-wider min-w-0">
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

                <button
                  onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
                  className="hidden lg:flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:-translate-y-0.5 transition-all font-bold shadow-lg shadow-indigo-100/50 cursor-pointer ml-auto"
                >
                  <BiBrain size={18} /> AI Intelligence
                </button>
              </div>
            </div>

            <button
              onClick={() => onDeleteTrigger(activeNote, "note")}
              className="hidden lg:flex items-center justify-center p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shrink-0 mt-1 cursor-pointer"
            >
              <BiTrash size={24} />
            </button>
          </div>
          <hr className="border-slate-100 mt-6 lg:mt-8" />
        </div>

        <div className="px-5 lg:px-12 pb-32 pt-4 min-w-0">
          <NoteEditor
            initialContent={activeNote?.content}
            onChange={(content) => updateNoteContent(activeNote?.id, content)}
          />
        </div>
      </div>

      <div>
        <BaseModal
          isOpen={isAiMenuOpen}
          onClose={() => setIsAiMenuOpen(false)}
          className="w-full lg:max-w-md rounded-[2rem] p-6 lg:p-8 overflow-hidden"
        >
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 lg:hidden" />
          <h3 className="text-2xl font-black text-slate-800 mb-1 uppercase italic tracking-tighter">
            AI Assistant
          </h3>
          <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-widest">
            Pilih mode analisis
          </p>

          <div className="grid gap-3 pb-4 lg:pb-0">
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
                  <span className="text-slate-700 font-bold text-sm lg:text-base capitalize">
                    AI {type}
                  </span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase bg-white px-2 py-1 rounded-md shadow-sm">
                  Min {MIN_WORDS[type]}w
                </span>
              </button>
            ))}
          </div>
        </BaseModal>

        <BaseModal
          isOpen={aiLoading}
          closeOnBackdrop={false}
          className="rounded-[2.5rem] p-10 lg:p-12 flex flex-col items-center"
        >
          <BiLoaderAlt
            className="text-indigo-600 animate-spin mb-6"
            size={56}
          />
          <h3 className="text-xl lg:text-2xl font-black text-slate-900 italic uppercase leading-none">
            Analyzing...
          </h3>
          <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">
            Harap tunggu sebentar
          </p>
        </BaseModal>

        <BaseModal
          isOpen={showConfig}
          onClose={() => setShowConfig(false)}
          className="rounded-[2rem] p-6 lg:p-8 max-w-[90%] lg:max-w-sm w-full border-t-8 border-indigo-600"
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
        </BaseModal>

        <BaseModal
          isOpen={showWarning}
          onClose={() => setShowWarning(false)}
          className="rounded-[2rem] p-8 lg:p-10 max-w-[90%] lg:max-w-xs w-full text-center border-b-8 border-orange-500"
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
        </BaseModal>

        <BaseModal
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          className="rounded-[2rem] p-6 lg:p-8 w-full max-w-2xl max-h-[80vh] flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-slate-800 uppercase italic flex items-center gap-2">
              <BiBrain className="text-indigo-600" />
              Hasil {configType}
            </h3>
            <button
              onClick={() => setShowResultModal(false)}
              className="text-slate-400 hover:text-slate-600 p-2"
            >
              <IoMdClose size={25} />
            </button>
          </div>

          <div className="overflow-y-auto custom-scrollbar flex-1 mb-6 p-4 bg-slate-50 rounded-xl text-slate-700 text-sm md:text-base leading-relaxed border border-slate-100 whitespace-pre-wrap">
            {configType === "summary" && (
              <span>
                {aiResult?.data?.summary
                  ?.replace(
                    /^(Berikut adalah|Ini adalah|Berikut ringkasan)[^:]*:\s*/i,
                    "",
                  )
                  .trim()}
              </span>
            )}
            {configType === "keypoints" && (
              <ul className="list-disc pl-5 space-y-2">
                {aiResult?.data?.key_points?.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex gap-3 mt-auto pt-2 border-t border-slate-100">
            <button
              onClick={() => setShowResultModal(false)}
              className="flex-1 py-3.5 font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handleInsertToNote}
              className="flex-1 py-3.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-lg shadow-indigo-200"
            >
              Simpan ke Catatan
            </button>
          </div>
        </BaseModal>

        <BaseModal
          isOpen={showQuizModal}
          onClose={() => setShowQuizModal(false)}
          className="rounded-[2rem] p-6 lg:p-8 w-full max-w-2xl max-h-[85vh] flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-slate-800 uppercase italic flex items-center gap-2">
              <BiExtension className="text-indigo-600" />
              Hasil Quiz
            </h3>
            <button
              onClick={() => setShowQuizModal(false)}
              className="text-slate-400 hover:text-slate-600 p-2 cursor-pointer transition-colors"
            >
              <IoMdClose size={25} />
            </button>
          </div>

          <div className="overflow-y-auto custom-scrollbar flex-1 mb-6 pr-2">
            {(aiResult?.data?.quiz || aiResult?.quiz) &&
            Array.isArray(aiResult?.data?.quiz || aiResult?.quiz) ? (
              <div className="space-y-6">
                {(aiResult?.data?.quiz || aiResult?.quiz).map((q, qIndex) => (
                  <div
                    key={qIndex}
                    className="bg-slate-50 p-5 rounded-2xl border border-slate-100"
                  >
                    <p className="font-bold text-slate-800 mb-4 text-sm md:text-base">
                      {qIndex + 1}. {q.question}
                    </p>

                    <div className="space-y-2">
                      {q.choices?.map((choice, cIndex) => {
                        const isSelected = userAnswers[qIndex] === choice.id;
                        const isCorrect = choice.id === q.correct_answer;
                        const showResult = quizSubmitted;

                        let btnClass =
                          "border-slate-200 bg-white hover:border-indigo-300 text-slate-600";
                        if (showResult) {
                          if (isCorrect)
                            btnClass =
                              "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold";
                          else if (isSelected && !isCorrect)
                            btnClass = "border-red-400 bg-red-50 text-red-600";
                          else
                            btnClass =
                              "border-slate-200 bg-slate-50 opacity-50";
                        } else if (isSelected) {
                          btnClass =
                            "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold";
                        }

                        return (
                          <button
                            key={cIndex}
                            onClick={() => {
                              if (!quizSubmitted) {
                                setUserAnswers((prev) => ({
                                  ...prev,
                                  [qIndex]: choice.id,
                                }));
                              }
                            }}
                            disabled={quizSubmitted}
                            className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm ${btnClass} ${!quizSubmitted ? "cursor-pointer active:scale-[0.99]" : ""}`}
                          >
                            <span className="font-bold mr-2">{choice.id}.</span>{" "}
                            {choice.text}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div
                        className={`mt-4 p-4 text-sm rounded-xl border ${userAnswers[qIndex] === q.correct_answer ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-indigo-50 border-indigo-100 text-indigo-800"}`}
                      >
                        <span className="font-bold block mb-1">
                          {userAnswers[qIndex] === q.correct_answer
                            ? "✅ Jawaban Anda Benar!"
                            : `❌ Salah! Jawaban yang benar adalah: ${q.correct_answer}`}
                        </span>
                        <span className="font-semibold">Penjelasan:</span>{" "}
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                Data kuis tidak ditemukan atau format tidak sesuai.
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-auto pt-4 border-t border-slate-100 shrink-0">
            <button
              onClick={() => {
                setShowQuizModal(false);
                setQuizSubmitted(false);
                setUserAnswers({});
              }}
              className="flex-1 py-3.5 font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>
            {!quizSubmitted ? (
              <button
                disabled={
                  Object.keys(userAnswers).length !==
                  (aiResult?.data?.quiz?.length || aiResult?.quiz?.length)
                }
                onClick={() => setQuizSubmitted(true)}
                className="flex-1 py-3.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl transition-colors shadow-lg shadow-indigo-200 cursor-pointer"
              >
                Cek Jawaban
              </button>
            ) : (
              <button
                onClick={handleInsertToNote}
                className="flex-1 py-3.5 font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors shadow-lg shadow-emerald-200 cursor-pointer"
              >
                Simpan ke Catatan
              </button>
            )}
          </div>
        </BaseModal>
      </div>
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1280) {
        setIsSidebarOpen(true);
      } else {
        if (activeNote) {
          setIsSidebarOpen(false);
        } else {
          setIsSidebarOpen(true);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [activeNote]);

  useEffect(() => {
    if (noteId && notes.length > 0) {
      const target = notes.find((n) => n.id === parseInt(noteId));
      if (target) {
        setActiveNote(target);
        if (window.innerWidth < 1280) setIsSidebarOpen(false);
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
          <aside
            className={`${isSidebarOpen ? "flex w-full xl:w-70" : "hidden xl:flex xl:w-80"} border-r border-slate-100 bg-slate-50/50 flex-col transition-all duration-300 overflow-hidden shrink-0 z-10`}
          >
            <div className="p-4 lg:p-5">
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

          <main
            className={`${!isSidebarOpen ? "flex" : "hidden xl:flex"} flex-1 flex-col bg-white min-w-0 shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.05)] z-20`}
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
                  <h3 className="text-2xl lg:text-3xl font-black text-slate-800 break-words tracking-tight">
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
