import React from "react";
import { Link } from "react-router-dom";
import { BiNote, BiTimeFive, BiChevronRight } from "react-icons/bi";
import MainLayouts from "../MainLayouts";
import { useNotes } from "../../hooks/useNotes";

const RecentNotesWidget = () => {
  const { recentNotes, setActiveNote } = useNotes();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <BiTimeFive className="text-indigo-500" />
          Baru-baru Ini Diakses
        </h3>
        <Link
          to="/notes"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
        >
          Lihat Semua <BiChevronRight />
        </Link>
      </div>

      <div className="divide-y divide-gray-50">
        {recentNotes.length > 0 ? (
          recentNotes.map((note) => (
            <Link
              key={note.id}
              to={`/notes/${note.id}`}
              onClick={() => setActiveNote(note)}
              className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0 group-hover:bg-indigo-100 transition-colors">
                <BiNote size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-700 truncate group-hover:text-indigo-600 transition-colors">
                  {note.title || "Untitled Note"}
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Diperbarui{" "}
                  {new Date(note.updatedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-10 text-center">
            <p className="text-sm text-gray-400">Belum ada catatan terbaru</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const firstName = user?.name ? user.name.split(" ")[0] : "Mahasiswa";

  return (
    <MainLayouts>
      <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 ">
        <header>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Selamat Belajar, {firstName}! 🚀
          </h1>
          <p className="text-gray-500 mt-1 italic text-sm">
            "Inovasi mahasiswa untuk produktivitas tanpa batas."
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#007BFF] rounded-3xl p-8 text-white shadow-xl shadow-blue-100">
              <h2 className="text-xl font-bold mb-2">
                Siap Produktif Hari Ini?
              </h2>
              <p className="text-blue-100 text-sm mb-6">
                Atur prioritas dan pantau semua progres tugasmu melalui Kanban
                Board.
              </p>

              <Link
                to={`/tasks`}
                className="inline-block bg-white text-[#007BFF] px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-50 transition-all"
              >
                Buka Daftar Tugas
              </Link>
            </div>
          </div>

          <div className="space-y-8">
            <RecentNotesWidget />
          </div>
        </div>
      </div>
    </MainLayouts>
  );
};

export default Dashboard;
