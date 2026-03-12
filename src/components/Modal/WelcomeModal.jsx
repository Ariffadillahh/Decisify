import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiBriefcase,
  FiBookOpen,
  FiAward,
  FiArrowRight,
} from "react-icons/fi";

const WelcomeModal = ({ isOpen, onSave }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl relative z-10 overflow-hidden flex flex-col"
        >
          <div className="px-8 pt-10 pb-6 text-center">
            <div className="w-16 h-16 bg-blue-50 text-[#007BFF] rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-blue-100">
              <FiUser size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Selamat Datang! 👋
            </h2>
            <p className="text-slate-500 text-sm font-medium px-4">
              Mari kita kenalan dulu. Silakan isi nama dan status Anda saat ini
              untuk menyesuaikan pengalaman.
            </p>
          </div>

          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                  Nama Panggilan
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama Anda..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 hover:border-blue-200 focus:border-[#007BFF] focus:bg-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-800 transition-all placeholder:font-medium placeholder:text-slate-300"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
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
                          className={`text-[11px] font-bold tracking-wide ${isSelected ? "text-[#007BFF]" : "text-slate-500"}`}
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
    </AnimatePresence>
  );
};

export default WelcomeModal;
