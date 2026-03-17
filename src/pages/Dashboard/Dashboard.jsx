import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartTooltip,
} from "recharts";
import {
  Zap,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Flame,
  BarChart3,
  Star,
  TrendingUp,
  ChevronRight,
  Plus,
  FolderOpen,
} from "lucide-react";
import MainLayouts from "../MainLayouts";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { useTasks } from "../../hooks/useTasks";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { db } from "../../services/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useNotes } from "../../hooks/useNotes";

const StatCard = ({ icon, label, value, desc, color }) => (
  <div className="bg-white p-4 md:p-5 rounded-[2rem] border border-slate-100 flex items-center gap-4 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group">
    <div
      className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-lg md:text-xl shrink-0 ${color}`}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
        {label}
      </p>
      <p className="text-base md:text-lg font-black text-slate-800 leading-tight">
        {value}
      </p>
      <p className="text-[9px] md:text-[10px] text-slate-400 font-medium mt-0.5 truncate">
        {desc}
      </p>
    </div>
  </div>
);

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { tasks, allRawTasks } = useTasks();
  const navigate = useNavigate();

  const topTask = useMemo(() => {
    return tasks.find((t) => t.status !== "Done") || null;
  }, [tasks]);

  const sessions = useLiveQuery(() => db.focus_sessions.toArray()) || [];

  const statsData = useMemo(() => {
    const totalSeconds = sessions.reduce(
      (acc, s) => acc + s.duration_seconds,
      0,
    );
    const totalHours = (totalSeconds / 3600).toFixed(1);

    const uniqueDates = [...new Set(sessions.map((s) => s.date))]
      .sort()
      .reverse();
    let streak = 0;
    const today = new Date().toLocaleDateString("id-ID");
    if (uniqueDates.includes(today)) streak = uniqueDates.length;

    const completedTasksCount = allRawTasks.filter(
      (t) => t.status === "Done",
    ).length;

    const activeTasks = tasks.length;
    const activeDone = tasks.filter((t) => t.status === "Done").length;
    const efficiency =
      activeTasks > 0 ? Math.round((activeDone / activeTasks) * 100) : 0;

    return { totalHours, streak, completedTasksCount, efficiency };
  }, [sessions, allRawTasks, tasks]);

  const priorityQueue = useMemo(() => {
    return tasks.filter((task) => !task.done).slice(0, 5);
  }, [tasks]);

  const categoryStats = useMemo(() => {
    const counts = {};

    allRawTasks.forEach((task) => {
      const catName = task.categoryName || "Umum";
      counts[catName] = (counts[catName] || 0) + 1;
    });

    const COLORS = [
      "#2563eb",
      "#8b5cf6",
      "#ec4899",
      "#f59e0b",
      "#10b981",
      "#64748b",
    ];

    return Object.keys(counts).map((name, index) => ({
      name,
      value: counts[name],
      color: COLORS[index % COLORS.length],
    }));
  }, [allRawTasks]);

  const totalTasks = allRawTasks.length;

  const { recentNotes, folders, setActiveNote } = useNotes();

  const displayedNotes = useMemo(() => {
    return recentNotes.slice(0, 3);
  }, [recentNotes]);

  const getFolderName = (folderId) => {
    if (!folderId) return "Uncategorized";
    const folder = folders.find((f) => f.id === folderId);
    return folder ? folder.name : "Uncategorized";
  };

  const getNotePreview = (contentString) => {
    try {
      const content = JSON.parse(contentString);
      const firstTextGroup = content.find(
        (block) =>
          block.type === "paragraph" &&
          block.content &&
          block.content.length > 0,
      );

      if (firstTextGroup) {
        return firstTextGroup.content.map((c) => c.text).join("");
      }
      return "Tidak ada preview teks...";
    } catch (e) {
      return "Gagal memuat preview...";
    }
  };

  return (
    <MainLayouts>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col gap-6 md:gap-8 pb-10 py-2 px-2 md:px-4 md:pl-8"
      >
        <section className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 text-white shadow-2xl">
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]" />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 mb-6">
                <Zap size={14} className="fill-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Keputusan Cerdas
                </span>
              </div>

              {tasks.length === 0 ? (
                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-6">
                  Halo {user?.name || "Guest"}! <br />
                  <span className="text-blue-400">Belum ada tugas nih.</span>
                </h1>
              ) : topTask ? (
                <>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-6">
                    {user?.name || "Guest"}, fokus ke <br />
                    <span className="text-blue-400">
                      "{topTask.title}"
                    </span>{" "}
                    dulu ya.
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 text-slate-400 font-bold">
                    <div className="flex items-center gap-2">
                      <Star
                        size={18}
                        className="text-amber-400 fill-amber-400"
                      />
                      <span className="text-sm md:text-base text-white">
                        Skor Urgensi: {(topTask.finalScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={18} />
                      <span className="text-sm md:text-base">
                        Estimasi {topTask.estimasi_jam} Jam
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle size={18} />
                      <span className="text-sm md:text-base truncate max-w-[150px]">
                        {topTask.categoryName || "Umum"}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-6">
                  Luar biasa! <br />
                  <span className="text-green-400">Semua tugas beres.</span>
                </h1>
              )}
            </div>

            {tasks.length === 0 ? (
              <Link
                to={"/tasks"}
                className="w-full lg:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20 cursor-pointer"
              >
                <Plus size={20} /> Buat Tugas Pertama
              </Link>
            ) : topTask ? (
              <Link
                to={"/tasks"}
                className="w-full lg:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20 cursor-pointer"
              >
                Mulai Sesi Fokus <ArrowRight size={20} />
              </Link>
            ) : null}
          </div>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            icon={<Flame />}
            label="Focus Streak"
            value={`${statsData.streak} Hari`}
            desc="Konsistensi harian"
            color="bg-orange-50 text-orange-500"
          />
          <StatCard
            icon={<CheckCircle2 />}
            label="Tugas Selesai"
            value={statsData.completedTasksCount}
            desc="Termasuk di Arsip"
            color="bg-green-50 text-green-500"
          />
          <StatCard
            icon={<TrendingUp />}
            label="Efficiency"
            value={`${statsData.efficiency}%`}
            desc="Rasio Kanban aktif"
            color="bg-blue-50 text-blue-500"
          />
          <StatCard
            icon={<Clock />}
            label="Waktu Fokus"
            value={`${statsData.totalHours}j`}
            desc="Total jam belajar"
            color="bg-purple-50 text-purple-500"
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          <section className="lg:col-span-4 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <BarChart3 size={20} className="text-slate-400" /> Beban
                Kategori
              </h3>
            </div>

            {totalTasks > 0 ? (
              <>
                <div className="h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryStats}
                        innerRadius="70%"
                        outerRadius="90%"
                        paddingAngle={8}
                        dataKey="value"
                        animationDuration={1000}
                      >
                        {categoryStats.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      <RechartTooltip
                        contentStyle={{
                          borderRadius: "16px",
                          border: "none",
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-black text-slate-800">
                      {totalTasks}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Total Tugas
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 overflow-y-auto max-h-48 pr-2 custom-scrollbar">
                  {categoryStats.map((cat, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-xs font-bold text-slate-600 truncate group-hover:text-slate-900">
                          {cat.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-800">
                          {cat.value}
                        </span>
                        <span className="text-[10px] font-medium text-slate-300">
                          ({((cat.value / totalTasks) * 100).toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 italic text-sm text-center px-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 size={24} className="opacity-20" />
                </div>
                Belum ada data kategori untuk dianalisis.
              </div>
            )}
          </section>

          <section className="lg:col-span-8 bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                  <Zap size={20} className="text-blue-500 fill-blue-500" />{" "}
                  Antrian Prioritas
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Disusun otomatis berdasarkan urgensi & deadline
                </p>
              </div>
              <Link
                to={"/tasks"}
                className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              {priorityQueue.length > 0 ? (
                priorityQueue.map((task, index) => {
                  const isCritical = task.finalScore >= 1;
                  const isWarning =
                    task.finalScore >= 0.7 && task.finalScore < 1;

                  const textColorClass = isCritical
                    ? "text-red-600"
                    : isWarning
                      ? "text-orange-500"
                      : "text-blue-600";
                  const borderHoverClass = isCritical
                    ? "group-hover:border-red-200"
                    : isWarning
                      ? "group-hover:border-orange-200"
                      : "group-hover:border-blue-200";

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => navigate("/tasks")}
                      className="group flex items-center gap-4 p-4 rounded-3xl bg-slate-50/50 border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-md transition-all cursor-pointer"
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center shrink-0 shadow-sm transition-colors ${borderHoverClass}`}
                      >
                        <span
                          className={`text-sm font-black ${textColorClass}`}
                        >
                          {(task.finalScore * 100).toFixed(0)}
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter text-center">
                          Urgensi
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-bold text-slate-800 truncate transition-colors ${isCritical ? "group-hover:text-red-600" : isWarning ? "group-hover:text-orange-500" : "group-hover:text-blue-600"}`}
                        >
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight bg-slate-100 px-2 py-0.5 rounded">
                            {task.categoryName || "Tanpa Kategori"}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                            <Clock size={12} /> {task.estimasi_jam} Jam
                          </span>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-4">
                        <span
                          className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            task.status === "Doing"
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                              : "bg-white text-slate-400 border border-slate-200"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-[2rem]">
                  <Zap size={40} className="mb-3 opacity-20" />
                  <p className="text-sm font-medium">
                    Belum ada tugas di antrean.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <FileText size={20} className="text-indigo-500" /> Insight
                Catatan Terakhir
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Lanjutkan riset dan pembelajaranmu
              </p>
            </div>
            <Link
              to={"/notes"}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors"
            >
              Lihat Semua
            </Link>
          </div>

          {displayedNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    navigate(`/notes/${note.id}`);
                    setActiveNote(note.id);
                  }}
                  className="group p-6 rounded-[2rem] bg-slate-50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm truncate leading-tight group-hover:text-indigo-600 transition-colors">
                          {note.title}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <FolderOpen size={10} className="text-slate-400" />
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                            {getFolderName(note.folderId)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3 font-medium italic opacity-80 mb-6 flex-1">
                    "{getNotePreview(note.content)}"
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-[9px] font-bold text-slate-300">
                      Diperbarui{" "}
                      {formatDistanceToNow(new Date(note.updatedAt), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </span>
                    <ChevronRight
                      size={14}
                      className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-50 rounded-[2rem]">
              <FileText size={48} className="mb-4 opacity-10" />
              <p className="text-sm font-medium">
                Belum ada catatan. Mulai tulis ide pertamamu!
              </p>
            </div>
          )}
        </section>
      </motion.div>
    </MainLayouts>
  );
};

export default Dashboard;
