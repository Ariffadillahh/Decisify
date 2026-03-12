import React from "react";
import BaseModal from "./BaseModal";
import { FiAlertCircle } from "react-icons/fi";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah Anda yakin ingin melanjutkan tindakan ini?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  icon: Icon = FiAlertCircle,
  confirmColorClass = "bg-[#ef4444] hover:bg-red-600 shadow-red-500/30",
  iconColorClass = "text-red-500 bg-red-50 border-red-100",
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="rounded-3xl w-full max-w-sm p-8 flex flex-col items-center text-center"
    >
      <div
        className={`w-16 h-16 rounded-full border-4 flex items-center justify-center mb-6 shadow-sm ${iconColorClass}`}
      >
        <Icon size={32} />
      </div>

      <h3 className="text-xl font-extrabold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 font-medium text-sm mb-8">{message}</p>

      <div className="flex items-center gap-4 w-full">
        <button
          onClick={onClose}
          className="flex-1 py-3.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={`flex-1 py-3.5 font-bold text-white shadow-lg rounded-xl transition-colors ${confirmColorClass}`}
        >
          {confirmText}
        </button>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;
