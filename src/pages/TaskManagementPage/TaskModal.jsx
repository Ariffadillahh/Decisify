import React, { useState, useEffect } from "react";
import { db } from "../../services/db";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck, FiCalendar, FiClock, FiActivity } from "react-icons/fi";
import { BsFolderPlus, BsFolder2Open } from "react-icons/bs";

const TaskModal = ({
  isEditMode,
  formData,
  handleChange,
  handleSubmit,
  setIsModalOpen,
}) => {
  const [categories, setCategories] = useState([]);
  const [isNewCategory, setIsNewCategory] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await db.category.toArray();
        setCategories(cats);
        if (cats.length === 0) setIsNewCategory(true);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsModalOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {isEditMode ? "Edit Tugas" : "Tugas Baru"}
              </h3>
              <p className="text-slate-500 text-xs font-medium mt-1">
                {isEditMode
                  ? "Perbarui detail tugas Anda."
                  : "Tuliskan detail tugas untuk dianalisis."}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="p-8 overflow-y-auto custom-scrollbar">
            <form id="task-form" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                  Nama Tugas
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Cth: Laporan Analisis Data..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 hover:border-blue-200 focus:border-[#007BFF] focus:bg-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-semibold text-slate-800 transition-all placeholder:font-medium placeholder:text-slate-300"
                  value={formData.title || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 flex items-center gap-1.5">
                  <BsFolder2Open size={12} /> Kategori
                </label>
                <div className="relative group">
                  {categories.length > 0 && !isNewCategory ? (
                    <select
                      name="category"
                      value={formData.category || ""}
                      onChange={(e) => {
                        if (e.target.value === "NEW_CATEGORY") {
                          setIsNewCategory(true);
                          handleChange({
                            target: { name: "category", value: "" },
                          });
                        } else {
                          handleChange(e);
                        }
                      }}
                      className="w-full p-4 bg-slate-50 border border-slate-200 hover:border-blue-200 focus:border-[#007BFF] focus:bg-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-semibold text-slate-800 transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled className="text-slate-400">
                        Pilih atau buat baru...
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                      <option
                        value="NEW_CATEGORY"
                        className="font-bold text-[#007BFF]"
                      >
                        + Buat Kategori Baru...
                      </option>
                    </select>
                  ) : (
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <BsFolderPlus size={18} />
                      </div>
                      <input
                        type="text"
                        name="category"
                        placeholder="Nama kategori baru..."
                        className="w-full p-4 pl-11 bg-slate-50 border border-slate-200 hover:border-blue-200 focus:border-[#007BFF] focus:bg-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-semibold text-slate-800 transition-all placeholder:font-medium placeholder:text-slate-300 pr-24"
                        value={formData.category || ""}
                        onChange={handleChange}
                        required
                        autoFocus 
                      />
                      {categories.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsNewCategory(false);
                            handleChange({
                              target: {
                                name: "category",
                                value: categories[0]?.name || "",
                              },
                            });
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-slate-200 text-slate-600 hover:bg-slate-300 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider"
                        >
                          Batal
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 flex items-center gap-1.5">
                  <FiCalendar size={12} /> Tenggat Waktu
                </label>
                <input
                  type="datetime-local"
                  name="date_deadline"
                  className="w-full p-4 bg-slate-50 border border-slate-200 hover:border-blue-200 focus:border-[#007BFF] focus:bg-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-semibold text-slate-800 transition-all appearance-none cursor-pointer"
                  value={formData.date_deadline || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200 hover:border-blue-200 transition-colors group">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                    <FiActivity size={12} className="text-orange-500" /> Sulit
                    (1-5)
                  </label>
                  <input
                    type="number"
                    name="tingkat_kesulitan"
                    min="1"
                    max="5"
                    className="w-full bg-transparent font-black text-xl text-slate-800 outline-none text-center"
                    value={formData.tingkat_kesulitan || 1}
                    onChange={handleChange}
                  />
                </div>

                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200 hover:border-blue-200 transition-colors group">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                    <FiClock size={12} className="text-blue-500" /> Jam Est.
                  </label>
                  <input
                    type="number"
                    name="estimasi_jam"
                    min="1"
                    className="w-full bg-transparent font-black text-xl text-slate-800 outline-none text-center"
                    value={formData.estimasi_jam || 1}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex gap-4 shrink-0 rounded-b-[2rem]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3.5 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              form="task-form"
              className="flex-[2] py-3.5 flex items-center justify-center gap-2 bg-[#007BFF] hover:bg-blue-600 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/30 transition-all active:scale-[0.98]"
            >
              <FiCheck size={18} />
              {isEditMode ? "Simpan Perubahan" : "Buat Tugas"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;
