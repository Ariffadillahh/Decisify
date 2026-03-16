import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BiSearch, BiNote, BiEditAlt, BiTrash, BiChevronLeft, BiText, BiTimeFive, BiBrain, BiLoaderAlt, BiCheckCircle, BiAlignLeft, BiListUl, BiExtension, BiX, BiCopyAlt, BiChevronDown, BiChevronUp } from "react-icons/bi";
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

const NoteContentEditor = ({ activeNote, folders, allNotes, onSelectNote, updateNoteTitle, updateNoteContent, onDeleteTrigger, onBack }) => {
  const [title, setTitle] = useState(activeNote?.title || "");
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef(null);

  // --- AI HOOK & STATES ---
  const { generateAi, loading: aiLoading, result: aiResult, resetResult } = useAiAssistant();
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Modal Control
  const [showResultModal, setShowResultModal] = useState(false); // Summary/Keypoints
  const [showQuizModal, setShowQuizModal] = useState(false); // Quiz

  const [configType, setConfigType] = useState(null);
  const [configValue, setConfigValue] = useState(3);

  // --- QUIZ INTERACTIVE STATES ---
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const MIN_WORDS = { summary: 50, keypoints: 100, quiz: 150 };

  // --- HELPER: Parsing Content ---
  const getPlainText = (jsonContent) => {
    if (!jsonContent) return "";
    try {
      const blocks = typeof jsonContent === "string" ? JSON.parse(jsonContent) : jsonContent;
      const contentArray = Array.isArray(blocks) ? blocks : blocks?.content || [];
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
      textarea.style.setProperty("height", `${textarea.scrollHeight}px`, "important");
    };
    const resizeObserver = new ResizeObserver(adjustHeight);
    resizeObserver.observe(textarea);
    adjustHeight();
    return () => resizeObserver.disconnect();
  }, [title, activeNote?.id]);

  const debouncedTitleUpdate = useMemo(() => debounce((id, val) => updateNoteTitle(id, val), 800), [updateNoteTitle]);

  useEffect(() => {
    const text = getPlainText(activeNote?.content);
    setWordCount(
      text
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0).length,
    );
  }, [activeNote?.content]);

  // --- HANDLERS ---
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
      let parsed = typeof activeNote.content === "string" ? JSON.parse(activeNote.content) : activeNote.content;
      let blocks = Array.isArray(parsed) ? parsed : [];
      const newBlocks = [
        {
          type: "heading",
          props: { level: 3, textColor: "default", backgroundColor: "default", textAlignment: "left" },
          content: [{ type: "text", text: `AI ${configType === "summary" ? "Summary" : "Key Points"}`, styles: { bold: true } }],
        },
      ];
      if (configType === "keypoints" && Array.isArray(data.key_points)) {
        data.key_points.forEach((point) => {
          newBlocks.push({ type: "bulletListItem", content: [{ type: "text", text: point, styles: {} }] });
        });
      } else {
        newBlocks.push({ type: "paragraph", content: [{ type: "text", text: data.summary || "", styles: {} }] });
      }
      updateNoteContent(activeNote.id, JSON.stringify([...blocks, ...newBlocks]));
      setShowResultModal(false);
      resetResult();
    } catch (e) {
      console.error("Insert error:", e);
    }
  };

  const handleSelectAnswer = (idx, choiceId) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [idx]: choiceId }));
  };

  const calculateScore = () => {
    if (!aiResult?.data?.quiz) return 0;
    const correctOnes = Object.values(userAnswers).filter((ans, idx) => ans === aiResult.data.quiz[idx].correct_answer);
    return Math.round((correctOnes.length / aiResult.data.quiz.length) * 100);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-white relative overflow-hidden min-w-0">
      {/* HEADER & EDITOR TETAP SAMA */}
      <div className="md:hidden flex items-center justify-between px-4 py-2.5 border-b border-slate-50 bg-white/80 backdrop-blur-md sticky top-0 z-20 shrink-0">
        <button onClick={onBack} className="flex items-center gap-1 text-indigo-600 font-bold text-xs cursor-pointer">
          <BiChevronLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setIsAiMenuOpen(true)} className="p-2 bg-indigo-50 text-indigo-600 rounded-xl active:scale-90 transition-transform">
            <BiBrain size={18} />
          </button>
          <button onClick={() => onDeleteTrigger(activeNote, "note")} className="p-2 bg-red-50 text-red-500 rounded-xl">
            <BiTrash size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
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
                  debouncedTitleUpdate(activeNote?.id, e.target.value);
                }}
                rows="1"
                className="text-2xl md:text-4xl font-black w-full outline-none bg-transparent text-slate-900 tracking-tight resize-none leading-tight overflow-hidden placeholder:text-slate-100 break-words block p-0 m-0 border-none min-h-0"
                placeholder="Untitled Note"
              />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mt-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider min-w-0">
                <div className="flex gap-4 items-center">
                  <span className="flex items-center gap-1.5">
                    <BiTimeFive className="text-indigo-400" size={14} /> {activeNote?.updatedAt ? new Date(activeNote.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "-"}
                  </span>
                  <span className={`flex items-center gap-1.5 ${wordCount < 50 ? "text-orange-400" : ""}`}>
                    <BiText size={14} /> {wordCount} Words
                  </span>
                </div>
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100 text-[10px] tracking-widest cursor-pointer"
                  >
                    <BiBrain size={16} /> AI Intelligence
                  </button>
                </div>
              </div>
            </div>
            <button onClick={() => onDeleteTrigger(activeNote, "note")} className="hidden md:block p-2.5 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0 mt-1 cursor-pointer">
              <BiTrash size={22} />
            </button>
          </div>
          <hr className="border-slate-50 mt-4" />
        </div>

        <div className="px-4 md:px-10 pb-20 pt-2 min-w-0">
          <NoteEditor initialContent={activeNote?.content} onChange={(content) => updateNoteContent(activeNote?.id, content)} />
        </div>
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {/* 1. MODAL KUIS INTERAKTIF (Layar Penuh/Besar) */}
        {showQuizModal && aiResult?.data?.quiz && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-0 md:p-6 bg-slate-900/70 backdrop-blur-lg">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white w-full max-w-4xl h-full md:h-[90vh] md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden relative"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                    <BiExtension size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-800 uppercase italic leading-none">Self-Assessment Quiz</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Buktikan pemahamanmu terhadap materi ini</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowQuizModal(false);
                    resetResult();
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors cursor-pointer"
                >
                  <BiX size={30} />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar bg-slate-50/50">
                <div className="max-w-2xl mx-auto space-y-10">
                  {aiResult.data.quiz.map((q, idx) => {
                    const isSelected = userAnswers[idx];
                    const isCorrect = isSelected === q.correct_answer;

                    return (
                      <div
                        key={idx}
                        className={`p-8 rounded-[2.5rem] border transition-all ${quizSubmitted ? (isCorrect ? "bg-white border-green-500 shadow-green-50" : "bg-white border-red-500 shadow-red-50") : "bg-white border-slate-100 shadow-sm"}`}
                      >
                        <div className="flex items-start gap-4 mb-6">
                          <span className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shrink-0 italic text-sm">#{idx + 1}</span>
                          <p className="font-black text-slate-800 text-lg leading-tight pt-1">{q.question}</p>
                        </div>
                        <div className="grid gap-3">
                          {q.choices.map((choice) => {
                            const isThisSelected = userAnswers[idx] === choice.id;
                            const isThisCorrect = quizSubmitted && choice.id === q.correct_answer;
                            const isThisWrong = quizSubmitted && isThisSelected && !isCorrect;

                            return (
                              <button
                                key={choice.id}
                                disabled={quizSubmitted}
                                onClick={() => handleSelectAnswer(idx, choice.id)}
                                className={`p-5 rounded-2xl border text-sm font-bold transition-all text-left flex items-center gap-4 cursor-pointer
                                                        ${
                                                          isThisCorrect
                                                            ? "bg-green-500 border-green-600 text-white"
                                                            : isThisWrong
                                                              ? "bg-red-500 border-red-600 text-white"
                                                              : isThisSelected
                                                                ? "bg-indigo-600 border-indigo-700 text-white"
                                                                : "bg-white border-slate-100 text-slate-500 hover:border-indigo-200"
                                                        }
                                                    `}
                              >
                                <span
                                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border 
                                                        ${isThisSelected || isThisCorrect || isThisWrong ? "border-white/20 bg-white/20" : "bg-slate-50 border-slate-100"}`}
                                >
                                  {choice.id}
                                </span>
                                {choice.text}
                              </button>
                            );
                          })}
                        </div>
                        {quizSubmitted && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-6 p-6 rounded-3xl text-xs leading-relaxed font-medium border-l-8 ${isCorrect ? "bg-green-50 text-green-700 border-green-500" : "bg-red-50 text-red-700 border-red-500"}`}
                          >
                            <p className="font-black uppercase mb-1 text-[10px] tracking-[0.2em]">{isCorrect ? "🎉 Excellent!" : "❌ Keep Learning"}</p>
                            {q.explanation}
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer (Action Area) */}
              <div className="p-8 border-t border-slate-50 bg-white flex flex-col md:flex-row items-center justify-between gap-6 shrink-0">
                {quizSubmitted ? (
                  <>
                    <div className="text-center md:text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Score</p>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-black text-indigo-600">{calculateScore()}%</span>
                        <span className="text-xs font-bold text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full italic">{calculateScore() >= 70 ? "Mastery Achieved" : "Needs Review"}</span>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <button
                        onClick={() => {
                          setQuizSubmitted(false);
                          setUserAnswers({});
                        }}
                        className="flex-1 md:flex-none px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all cursor-pointer"
                      >
                        Ulangi Kuis
                      </button>
                      <button
                        onClick={() => {
                          setShowQuizModal(false);
                          resetResult();
                        }}
                        className="flex-1 md:flex-none px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all cursor-pointer shadow-xl"
                      >
                        Selesai
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-bold text-slate-400 italic">Pastikan semua pertanyaan terjawab sebelum mengecek hasil.</p>
                    <button
                      disabled={Object.keys(userAnswers).length < aiResult.data.quiz.length}
                      onClick={() => setQuizSubmitted(true)}
                      className={`w-full md:w-auto px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all
                                    ${
                                      Object.keys(userAnswers).length < aiResult.data.quiz.length
                                        ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                                        : "bg-indigo-600 text-white shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 cursor-pointer"
                                    }`}
                    >
                      Submit & Cek Hasil
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* MODAL LAIN (Summary Preview, Loading, Config, Warning) */}
        {showResultModal && aiResult && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 pb-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">{configType === "summary" ? <BiAlignLeft size={24} /> : <BiListUl size={24} />}</div>
                  <div>
                    <h4 className="text-xl font-black text-slate-800 uppercase italic leading-none">AI Result Preview</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Review content before inserting</p>
                  </div>
                </div>
                <button onClick={() => setShowResultModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors cursor-pointer">
                  <BiX size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  {configType === "keypoints" && Array.isArray(aiResult.data?.key_points) ? (
                    <ul className="space-y-4">
                      {aiResult.data.key_points.map((point, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-slate-600 leading-relaxed text-sm font-medium whitespace-pre-line">{aiResult.data?.summary}</div>
                  )}
                </div>
              </div>
              <div className="p-8 pt-4 flex gap-3 shrink-0">
                <button
                  onClick={() => {
                    setShowResultModal(false);
                    resetResult();
                  }}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Selesai
                </button>
                <button
                  onClick={handleInsertToNote}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 uppercase text-[11px] tracking-widest cursor-pointer"
                >
                  <BiCopyAlt size={18} /> Masukkan ke Notes
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* LOADING MODAL */}
        {aiLoading && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-indigo-950/20 backdrop-blur-2xl">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white rounded-[3.5rem] p-12 shadow-2xl flex flex-col items-center">
              <BiLoaderAlt className="text-indigo-600 animate-spin mb-6" size={48} />
              <h3 className="text-xl font-black text-slate-900 italic uppercase leading-none">Analyzing...</h3>
            </motion.div>
          </div>
        )}

        {/* AI MENU, CONFIG, & WARNING MODALS (Sama seperti versi sebelumnya) */}
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
              <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-widest">Pilih mode analisis</p>
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

        {showConfig && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-8 shadow-2xl max-w-sm w-full relative border-t-8 border-indigo-600">
              <h3 className="text-xl font-black text-slate-800 uppercase italic leading-none">Setup Intelligence</h3>
              <div className="mt-12 mb-10">
                <div className="flex justify-between items-end mb-4">
                  <label className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Jumlah {configType}</label>
                  <span className="text-4xl font-black text-indigo-600">{configValue}</span>
                </div>
                <input type="range" min="1" max="10" value={configValue} onChange={(e) => setConfigValue(e.target.value)} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowConfig(false)} className="flex-1 py-4 font-bold text-slate-300 uppercase text-[11px] tracking-widest cursor-pointer">
                  Batal
                </button>
                <button
                  onClick={handleGenerateAi}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase text-[11px] tracking-widest cursor-pointer"
                >
                  Generate
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showWarning && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[2.5rem] p-10 shadow-2xl max-w-xs w-full text-center border-b-8 border-orange-500">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <BiText size={36} />
              </div>
              <h3 className="text-lg font-black text-slate-800 uppercase italic leading-tight">Materi Terlalu Pendek</h3>
              <p className="text-xs text-slate-500 mt-3 font-medium leading-relaxed">
                Minimal <span className="text-indigo-600 font-black">{MIN_WORDS[configType]} kata</span> agar AI bisa bekerja.
              </p>
              <button onClick={() => setShowWarning(false)} className="mt-8 w-full py-4 bg-slate-900 text-white rounded-[1.2rem] font-bold uppercase text-[11px] tracking-widest cursor-pointer">
                Siap!
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
              <div className="h-full flex flex-col items-center justify-center text-slate-700 p-8 text-center">
                <BiNote size={40} className="opacity-20 mb-4" />
                <h3 className="text-xl font-black text-slate-900">Siap Untuk Belajar?</h3>
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
