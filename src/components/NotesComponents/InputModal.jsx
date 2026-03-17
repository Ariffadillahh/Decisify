import React, { useState, useEffect } from "react";
import BaseModal from "../Modal/BaseModal";

const InputModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  defaultValue = "",
}) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (isOpen) setValue(defaultValue);
  }, [isOpen, defaultValue]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-md overflow-hidden rounded-xl"
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmit(value);
              setValue("");
            }
          }}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          placeholder="Masukkan nama..."
        />
      </div>

      <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-100">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
        >
          Batal
        </button>
        <button
          onClick={() => {
            onSubmit(value);
            setValue("");
          }}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 cursor-pointer"
        >
          Konfirmasi
        </button>
      </div>
    </BaseModal>
  );
};

export default InputModal;
