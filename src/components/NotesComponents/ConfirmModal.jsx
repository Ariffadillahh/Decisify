import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiErrorCircle } from "react-icons/bi";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden z-10">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BiErrorCircle size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">{message}</p>
            </div>

            <div className="flex p-4 gap-3 bg-gray-50">
              <button onClick={onClose} className="flex-1 px-4 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg transition-colors">
                Batal
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95"
              >
                Hapus
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
