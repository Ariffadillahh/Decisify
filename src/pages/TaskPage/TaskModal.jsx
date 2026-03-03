import React from "react";

const TaskModal = ({
  isEditMode,
  formData,
  handleChange,
  handleSubmit,
  setIsModalOpen,
}) => {
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
              value={formData.title}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="date_deadline"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-600"
              value={formData.date_deadline}
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
                  value={formData.tingkat_kesulitan}
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
                  value={formData.estimasi_jam}
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
