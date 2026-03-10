import React from "react";
import logo from "../assets/logo.png";


const Navbar = () => {
  return (
    <div className="flex justify-between items-center py-[16px] backdrop-blur-md bg-white/70 shadow-2xs px-5 md:px-[80px] fixed top-0 w-full">
      <div className="flex gap-3 items-center">
        <img src={logo} alt="" className="w-9 h-9" />
        <h1 className="text-[#0F172A] font-bold text-[20px]">Decisify</h1>
      </div>
      <ul className="hidden md:flex md:items-center gap-[32px] text-[#475569] font-semibold text-[14px]">
        <li>Fitur</li>
        <li>Cara kerja</li>
        <li>Testimoni</li>
      </ul>

      <div>
        <button className="bg-[#007BFF] px-[20px] py-2 cursor-pointer rounded-[24px] text-white drop-shadow-lg drop-shadow-blue-200 text-[14px] font-bold">
          Mulai Gratis
        </button>
      </div>
    </div>
  );
};

export default Navbar;
