import React from "react";
import logo from "../assets/logo.png";

const Navbar = ({ onOpenModal, scrollToSection }) => {
  return (
    <div className="flex justify-between items-center py-[16px] backdrop-blur-md bg-white/70 shadow-2xs px-5 md:px-[80px] fixed top-0 w-full z-50">
      <div
        onClick={() => scrollToSection("hero")}
        className="flex gap-3 items-center cursor-pointer"
      >
        <img src={logo} alt="Logo" className="w-9 h-9" />
        <h1 className="text-[#0F172A] font-bold text-[20px]">Decisify</h1>
      </div>

      <ul className="hidden md:flex md:items-center gap-[32px] text-[#475569] font-semibold text-[14px] uppercase">
        <li
          onClick={() => scrollToSection("features")}
          className="cursor-pointer hover:text-[#007BFF] transition-colors"
        >
          Fitur
        </li>

        <li
          onClick={() => scrollToSection("workflow")}
          className="cursor-pointer hover:text-[#007BFF] transition-colors"
        >
          Cara kerja
        </li>

        <li
          onClick={() => scrollToSection("testimoni")}
          className="cursor-pointer hover:text-[#007BFF] transition-colors"
        >
          Testimoni
        </li>
      </ul>

      <div>
        <button
          onClick={onOpenModal}
          className="bg-[#007BFF] px-[20px] py-2 cursor-pointer rounded-[24px] text-white shadow-lg shadow-blue-500/30 text-[14px] font-bold hover:bg-blue-600 transition-colors"
        >
          Mulai Produktif
        </button>
      </div>
    </div>
  );
};

export default Navbar;
