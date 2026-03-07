import React, { useState, useEffect } from "react";
import { db } from "../../services/db";

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
        // PERBAIKAN: Diubah menjadi db.category
        const cats = await db.category.toArray();
        setCategories(cats);

        if (cats.length === 0) {
          setIsNewCategory(true);
        }
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
        <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-200">
          <h3 className="text-2xl font-black text-slate-800 mb-2">
            {isEditMode ? "Edit Tugas" : "Tugas Baru"}
          </h3>
          <p className="text-slate-400 text-sm mb-8 font-semibold uppercase tracking-wider">
            {isEditMode
              ? "Perbarui detail tugas Anda"
              : "Isi detail untuk menghitung prioritas"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="title"
              placeholder="Nama Tugas..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
              value={formData.title || ""}
              onChange={handleChange}
              required
            />

            {/* --- INPUT KATEGORI DINAMIS --- */}
            <div className="relative">
              {categories.length > 0 && !isNewCategory ? (
                <select
                  name="category"
                  value={formData.category || ""}
                  onChange={(e) => {
                    if (e.target.value === "NEW_CATEGORY") {
                      setIsNewCategory(true);
                      handleChange({ target: { name: "category", value: "" } });
                    } else {
                      handleChange(e);
                    }
                  }}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-600 appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>
                    Pilih Kategori...
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  <option
                    value="NEW_CATEGORY"
                    className="font-bold text-indigo-600"
                  >
                    ➕ Buat Kategori Baru...
                  </option>
                </select>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    name="category"
                    placeholder="Nama Kategori..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-600 pr-20"
                    value={formData.category || ""}
                    onChange={handleChange}
                    required
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                    >
                      Batal
                    </button>
                  )}
                </div>
              )}
            </div>
            {/* ------------------------------ */}

            <input
              type="datetime-local"
              name="date_deadline"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-600"
              value={formData.date_deadline || ""}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">
                  Sulit (1-5)
                </label>
                <input
                  type="number"
                  name="tingkat_kesulitan"
                  min="1"
                  max="5"
                  className="w-full bg-transparent font-bold outline-none text-indigo-600"
                  value={formData.tingkat_kesulitan || 1}
                  onChange={handleChange}
                />
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">
                  Jam Est.
                </label>
                <input
                  type="number"
                  name="estimasi_jam"
                  min="1"
                  className="w-full bg-transparent font-bold outline-none text-indigo-600"
                  value={formData.estimasi_jam || 1}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-4 bg-indigo-600 text-white font-extrabold rounded-2xl shadow-lg hover:bg-indigo-700 transition active:scale-95"
              >
                {isEditMode ? "Simpan Perubahan" : "Buat Tugas"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
