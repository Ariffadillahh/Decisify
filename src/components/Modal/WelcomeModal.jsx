import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiBriefcase,
  FiBookOpen,
  FiAward,
  FiArrowRight,
  FiX,
  FiUploadCloud,
} from "react-icons/fi";
import { db } from "../../services/db";
import { gooeyToast } from "goey-toast";

const WelcomeModal = ({ isOpen, onSave, onClose }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const fileInputRef = useRef(null);

  const roles = [
    { id: "Pelajar", label: "Pelajar", icon: FiBookOpen },
    { id: "Mahasiswa", label: "Mahasiswa", icon: FiAward },
    { id: "Pekerja", label: "Pekerja", icon: FiBriefcase },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() !== "" && role !== "") {
      onSave({ name: name.trim(), role });
    }
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const dbData = json.database;

        if (!dbData) throw new Error("Format backup tidak valid.");

        if (!db.isOpen()) await db.open();

        await db.transaction(
          "rw",
          [
            db.users,
            db.category,
            db.tasks,
            db.folders,
            db.notes,
            db.focus_sessions,
          ],
          async () => {
            await Promise.all([
              db.users.clear(),
              db.category.clear(),
              db.tasks.clear(),
              db.folders.clear(),
              db.notes.clear(),
              db.focus_sessions.clear(),
            ]);

            const singleUser =
              dbData.users && dbData.users.length > 0 ? [dbData.users[0]] : [];

            await Promise.all([
              db.users.bulkAdd(singleUser),
              db.category.bulkAdd(dbData.categories || []),
              db.tasks.bulkAdd(dbData.tasks || []),
              db.folders.bulkAdd(dbData.folders || []),
              db.notes.bulkAdd(dbData.notes || []),
              db.focus_sessions.bulkAdd(dbData.focusSessions || []),
            ]);
          },
        );

        const profile = json.userProfile || (dbData.users && dbData.users[0]);
        if (profile) {
          setName(profile.name || "");
          setRole(profile.role || "Mahasiswa");

          localStorage.setItem("user", JSON.stringify(profile));
        }

        gooeyToast.success("Data Berhasil Dipulihkan!");

        window.location.reload();
      } catch (err) {
        gooeyToast.error("Gagal: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl relative z-10 overflow-hidden flex flex-col"
          >
            {/* Sembunyikan Input File */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".json"
              onChange={handleImportData}
            />

            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all duration-200 z-20"
            >
              <FiX size={24} />
            </button>

            <div className="px-8 pt-10 pb-6 text-center">
              <div className="w-16 h-16 bg-blue-50 text-[#007BFF] rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-blue-100">
                <FiUser size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Selamat Datang!
              </h2>
              <p className="text-slate-500 text-sm font-medium px-4">
                Sudah punya akun Decisify sebelumnya?
              </p>

              {/* TOMBOL IMPORT */}
              <button
                onClick={() => fileInputRef.current.click()}
                className="mt-3 text-[#007BFF] text-xs font-bold flex items-center justify-center gap-2 mx-auto hover:underline bg-blue-50 px-4 py-2 rounded-full transition-all"
              >
                <FiUploadCloud /> Pulihkan Data dari JSON
              </button>
            </div>

            {/* Separator */}
            <div className="flex items-center px-10 mb-2">
              <div className="flex-1 h-[1px] bg-slate-100"></div>
              <span className="px-3 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Atau Baru Di Sini?
              </span>
              <div className="flex-1 h-[1px] bg-slate-100"></div>
            </div>

            <div className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama Anda..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 hover:border-blue-200 focus:border-[#007BFF] focus:bg-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-800 transition-all placeholder:font-medium placeholder:text-slate-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                    Status Saat Ini
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {roles.map((r) => {
                      const Icon = r.icon;
                      const isSelected = role === r.id;
                      return (
                        <div
                          key={r.id}
                          onClick={() => setRole(r.id)}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "border-[#007BFF] bg-blue-50/50 text-[#007BFF] shadow-sm scale-105"
                              : "border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <Icon size={24} className="mb-2" />
                          <span
                            className={`text-[10px] font-bold tracking-wide ${isSelected ? "text-[#007BFF]" : "text-slate-500"}`}
                          >
                            {r.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!name.trim() || !role}
                  className={`w-full py-4 mt-2 flex items-center justify-center gap-2 rounded-2xl font-extrabold text-sm transition-all duration-300 ${
                    name.trim() && role
                      ? "bg-[#007BFF] text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Mulai Gunakan Decisify <FiArrowRight size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;
