import React from "react";
import MainLayouts from "../MainLayouts";
import { BiPlus, BiFolderPlus, BiSortAlt2 } from "react-icons/bi";
import { BsSearch, BsPlusLg } from "react-icons/bs";

const NotesLayout = ({ children, onCreateNote, onCreateFolder, searchTerm, setSearchTerm, sortBy, setSortBy }) => {
  return (
    <MainLayouts>
      {/* Container utama dengan warna background slate cerah agar card terlihat kontras */}
      <div className="flex flex-col h-[calc(100vh-120px)] bg-[#f8fafc] overflow-hidden">
        {/* --- DASHBOARD HEADER CARD --- */}
        <header className="px-6 py-4 md:px-10 md:py-2 shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 transition-all">
            {/* Bagian Judul */}
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Notes</h1>
              <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Knowledge Management System</p>
            </div>

            {/* Bagian Kontrol: Search, Filter, & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* New Folder Button */}
                <button onClick={onCreateFolder} className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer" title="New Folder">
                  <BiFolderPlus size={20} />
                </button>

                {/* New Note Button */}
                <button
                  onClick={onCreateNote}
                  className="flex-1 cursor-pointer sm:flex-none flex items-center justify-center gap-2 bg-[#007BFF] hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95"
                >
                  <BsPlusLg size={14} />
                  <span className="hidden sm:inline">New Note</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* --- CONTENT AREA --- */}
        <div className="flex flex-1 overflow-hidden px-6 md:px-10 pb-4">
          <div className="flex-1 flex bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">{children}</div>
        </div>
      </div>
    </MainLayouts>
  );
};

export default NotesLayout;
