import React from "react";
import MainLayouts from "../MainLayouts";
import { BiPlus, BiFolderPlus } from "react-icons/bi";
import { BsPlusLg } from "react-icons/bs";

const NotesLayout = ({ children, onCreateNote, onCreateFolder }) => {
  return (
    <MainLayouts>
      <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-120px)] bg-[#f8fafc] overflow-hidden relative w-full md:ml-2">
        <header className="hidden md:block px-4 lg:px-8 py-2 shrink-0 w-full">
          <div className="flex items-center justify-between gap-4 bg-white p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm border border-slate-100 transition-all w-full">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight truncate">
                Catatan
              </h1>
              <p className="text-[10px] lg:text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 truncate">
                Knowledge Management System
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onCreateFolder}
                className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer"
              >
                <BiFolderPlus size={20} />
              </button>
              <button
                onClick={onCreateNote}
                className="flex items-center justify-center gap-2 bg-[#007BFF] hover:bg-blue-600 text-white px-4 lg:px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 transition-all"
              >
                <BsPlusLg size={14} />
                <span className="hidden lg:block">Catatan Baru</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden px-0 md:px-4 lg:px-8 pb-0 md:pb-4 w-full min-w-0">
          <div className="flex-1 flex w-full bg-white rounded-none md:rounded-2xl lg:rounded-3xl border-none md:border border-slate-100 shadow-none md:shadow-sm overflow-hidden relative min-w-0">
            {children}
          </div>
        </div>

        <div className="md:hidden fixed bottom-16 right-5 flex flex-col gap-2 z-50">
          <button
            onClick={onCreateFolder}
            className="p-3 bg-white text-slate-600 rounded-xl shadow-lg border border-slate-100 active:scale-90 transition-transform cursor-pointer flex items-center justify-center"
            title="New Folder"
          >
            <BiFolderPlus size={20} />
          </button>
          <button
            onClick={onCreateNote}
            className="p-3 bg-[#007BFF] text-white rounded-xl shadow-xl shadow-blue-200 active:scale-90 transition-transform cursor-pointer flex items-center justify-center"
            title="New Note"
          >
            <BiPlus size={24} />
          </button>
        </div>
      </div>
    </MainLayouts>
  );
};

export default NotesLayout;
