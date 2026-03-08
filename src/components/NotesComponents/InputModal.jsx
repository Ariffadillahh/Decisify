import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const InputModal = ({ isOpen, onClose, onSubmit, title, defaultValue = "" }) => {
  const [value, setValue] = useState(defaultValue);

  // Reset value saat defaultValue berubah atau modal dibuka kembali
  useEffect(() => {
    if (isOpen) setValue(defaultValue);
  }, [isOpen, defaultValue]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden z-10">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
              <input
                autoFocus
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSubmit(value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Masukkan nama..."
              />
            </div>
            <div className="flex justify-end gap-3 p-4 bg-gray-50">
              <button onClick={onClose} className="px-4 py-2 text-gray-600 font-semibold hover:text-gray-800">
                Batal
              </button>
              <button
                onClick={() => {
                  onSubmit(value);
                  setValue("");
                }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Konfirmasi
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InputModal;
