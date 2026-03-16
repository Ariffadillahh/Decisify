import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiAlertTriangle, FiDownload, FiX } from "react-icons/fi";
import { exportDB } from "../../services/dbExport";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  const [hasExported, setHasExported] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportDB();
      setHasExported(true);
    } catch (err) {
      alert("Gagal mengekspor data");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FiX size={20} />
            </button>

            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6 mx-auto">
              <FiAlertTriangle size={32} />
            </div>

            <h3 className="text-xl font-black text-slate-900 text-center mb-2">
              Ingin Logout?
            </h3>
            <p className="text-slate-500 text-center text-sm mb-8 leading-relaxed font-medium">
              Data Anda tersimpan secara lokal (IndexedDB). Pastikan cadangkan
              data agar tidak hilang.
            </p>

            <div className="space-y-4 mb-8">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 py-4 bg-blue-50 text-[#007BFF] rounded-2xl font-bold text-sm hover:bg-blue-100 transition-all active:scale-95"
              >
                <FiDownload size={18} />
                {isExporting ? "Mengekspor..." : "Cadangkan Data (JSON)"}
              </button>

              <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all">
                <div className="relative flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={hasExported}
                    onChange={(e) => setHasExported(e.target.checked)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 checked:bg-[#007BFF] checked:border-[#007BFF] transition-all"
                  />
                  <svg
                    className="absolute h-3.5 w-3.5 ml-0.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-[12px] text-slate-600 font-bold leading-snug select-none">
                  Saya sudah mencadangkan data dan sadar risiko kehilangan data
                  permanen.
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-4 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
              >
                Batal
              </button>
              <button
                disabled={!hasExported}
                onClick={onConfirm}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  hasExported
                    ? "bg-red-500 text-white shadow-lg shadow-red-200 active:scale-95"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;
