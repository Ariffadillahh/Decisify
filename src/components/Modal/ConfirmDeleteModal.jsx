import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl relative z-10 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center text-red-500 mb-6 shadow-sm">
            <FiAlertCircle size={32} />
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 mb-2">
            Confirm Delete
          </h3>
          <p className="text-slate-500 font-medium text-sm mb-8">
            Action cannot be undone. Are you sure you want to delete this task?
          </p>

          <div className="flex items-center gap-4 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3.5 font-bold text-white bg-[#ef4444] hover:bg-red-600 shadow-lg shadow-red-500/30 rounded-xl transition-colors"
            >
              Hapus
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;
