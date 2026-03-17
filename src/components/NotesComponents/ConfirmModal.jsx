import React from "react";
import { BiErrorCircle } from "react-icons/bi";
import BaseModal from "../Modal/BaseModal";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-sm overflow-hidden rounded-xl"
    >
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <BiErrorCircle size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm">{message}</p>
      </div>

      <div className="flex p-4 gap-3 bg-gray-50">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
        >
          Batal
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95 cursor-pointer"
        >
          Hapus
        </button>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;
