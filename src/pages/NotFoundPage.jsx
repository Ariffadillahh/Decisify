import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCompass } from "react-icons/fi";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F8] flex items-center justify-center p-5 font-sans relative overflow-hidden">
      {/* Efek Glow Latar Belakang */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full text-center flex flex-col items-center relative z-10">
        {/* Kontainer Utama 404 menggunakan Flexbox dan Gap */}
        <motion.div
          initial={{ y: -20, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
          className="flex items-center justify-center gap-4 md:gap-8 mb-10"
        >
          {/* Angka 4 Kiri */}
          <h1 className="text-[120px] md:text-[180px] font-black text-[#94A3B8] leading-none select-none tracking-tighter">
            4
          </h1>

          {/* Kapsul "0" di Tengah */}
          <div className="flex items-center justify-center bg-white rounded-full shadow-[0_10px_40px_rgb(0,0,0,0.08)] text-[#007BFF] w-[90px] h-[140px] md:w-[120px] md:h-[180px] z-10">
            {/* Ikon Kompas Berputar di Dalamnya */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="p-2 border-4 border-[#007BFF] rounded-full"
            >
              <FiCompass className="w-10 h-10 md:w-14 md:h-14" />
            </motion.div>
          </div>

          {/* Angka 4 Kanan */}
          <h1 className="text-[120px] md:text-[180px] font-black text-[#94A3B8] leading-none select-none tracking-tighter">
            4
          </h1>
        </motion.div>

        {/* Teks & Tombol */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Ups! Anda Keluar Jalur
          </h2>
          <p className="text-slate-500 font-medium text-sm md:text-base mb-8 leading-relaxed max-w-sm mx-auto">
            Halaman yang Anda cari sepertinya sedang cuti, diarsipkan, atau
            memang tidak pernah ada di Decisify.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#007BFF] text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-600 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
          >
            <FiArrowLeft size={18} />
            Kembali
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
