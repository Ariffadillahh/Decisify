import React, { useState, useEffect, useMemo } from "react";
import TaskLayouts from "./TaskLayouts";
// import MainLayouts from "../MainLayouts"; // Hapus jika tidak dipakai
import { motion, AnimatePresence } from "framer-motion";
import {
  BsSearch,
  BsFilter,
  BsPencilSquare,
  BsArrow90DegLeft,
  BsTrash,
} from "react-icons/bs";
import TaskModal from "./TaskModal";
import { useTasks } from "../../hooks/useTasks";
import { CategoryBadge } from "../../components/TaskBadge";

const ArchiveTaskPage = () => {
  const {
    archivedTasks,
    fetchArchivedTasks,
    handleRestoreTask,
    handleDeleteArchivedTask,
    handleArchiveEditSubmit,
    isModalOpen,
    setIsModalOpen,
    formData,
    setFormData,
    handleChange,
  } = useTasks();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDays, setFilterDays] = useState("all");

  useEffect(() => {
    fetchArchivedTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return archivedTasks.filter((task) => {
      const matchesSearch =
        task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.categoryName?.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesDate = true;
      if (filterDays === "7") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const taskDate = task.completedAt
          ? new Date(task.completedAt)
          : new Date(task.date_deadline);

        matchesDate = taskDate >= sevenDaysAgo;
      }

      return matchesSearch && matchesDate;
    });
  }, [archivedTasks, searchQuery, filterDays]);

  const handleEditClick = (task) => {
    setFormData({
      id: task.id,
      title: task.title,
      category: task.categoryName || task.category || "",
      date_deadline: task.date_deadline,
      tingkat_kesulitan: task.tingkat_kesulitan || 1,
      estimasi_jam: task.estimasi_jam || 1,
    });
    setIsModalOpen(true);
  };

  return (
    <TaskLayouts>
      {/* 1. Perbaikan padding dan margin container agar aman di Mobile & Desktop */}
      <div className="min-h-screen bg-[#f8fafc] w-full flex flex-col px-4 md:px-8 py-6 md:py-8">
        {/* 2. Perbaikan Header Card padding dan ukuran teks */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800">
              Task Archive
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">
              Riwayat tugas yang sudah selesai
            </p>
          </div>

          {/* Wrapper Filter & Search dibikin w-full di mobile */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari tugas atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <div className="relative w-full sm:w-auto">
              <BsFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <select
                value={filterDays}
                onChange={(e) => setFilterDays(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer text-slate-600 font-medium"
              >
                <option value="all">Semua Waktu</option>
                <option value="7">7 Hari Terakhir</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Grid responsif dengan penyesuaian padding bawah untuk navigation bar mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-24 md:pb-8">
          <AnimatePresence>
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 opacity-50"
              >
                <span className="text-5xl md:text-6xl mb-4">📭</span>
                <h3 className="text-base md:text-lg font-bold text-slate-600">
                  Archive Kosong
                </h3>
                <p className="text-xs md:text-sm text-slate-400 text-center px-4 mt-1">
                  Tidak ada tugas yang cocok dengan pencarian.
                </p>
              </motion.div>
            ) : (
              filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative flex flex-col"
                >
                  <div className="flex-1">
                    {/* Tambahan line-clamp-2 agar judul panjang tidak merusak card */}
                    <h3 className="font-bold text-slate-700 text-sm md:text-base mb-3 line-through opacity-70 line-clamp-2">
                      {task.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="text-[10px] md:text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg border border-slate-200">
                        Selesai:{" "}
                        {task.completedAt
                          ? new Date(task.completedAt).toLocaleDateString(
                              "id-ID",
                            )
                          : task.date_deadline?.split("T")[0]}
                      </span>
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg border border-emerald-100">
                        Archived
                      </span>
                    </div>
                    <CategoryBadge category={task.categoryName} />
                  </div>

                  {/* 4. Touch targets diperbesar sedikit untuk mobile (py-2.5 dan p-2.5) */}
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-4 md:mt-auto">
                    <button
                      onClick={() => handleRestoreTask(task)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 md:py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:text-white rounded-xl text-xs font-bold transition-colors"
                      title="Kembalikan ke Todo"
                    >
                      <BsArrow90DegLeft size={14} /> Restore
                    </button>
                    <button
                      onClick={() => handleEditClick(task)}
                      className="p-2.5 md:p-2 bg-slate-50 text-slate-500 hover:bg-orange-500 hover:text-white rounded-xl transition-colors"
                      title="Edit Tugas"
                    >
                      <BsPencilSquare size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteArchivedTask(task.id)}
                      className="p-2.5 md:p-2 bg-slate-50 text-slate-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors"
                      title="Hapus Permanen"
                    >
                      <BsTrash size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {isModalOpen && formData && (
          <TaskModal
            isEditMode={true}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleArchiveEditSubmit}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </div>
    </TaskLayouts>
  );
};

export default ArchiveTaskPage;
