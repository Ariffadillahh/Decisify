import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = ({ onOpenModal, scrollToSection, logo }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menus = [
    { name: "Fitur", id: "features" },
    { name: "Cara Kerja", id: "workflow" },
    { name: "Testimoni", id: "testimoni" },
  ];

  return (
    <div className="flex justify-between items-center py-[16px] backdrop-blur-md bg-white/70 shadow-2xs px-5 md:px-[80px] fixed top-0 w-full z-50">
      <div
        onClick={() => scrollToSection("hero")}
        className="flex gap-3 items-center cursor-pointer"
      >
        <img src={logo} alt="Logo" className="w-9" />
        <h1 className="text-[#0F172A] font-bold text-[20px]">Decisify</h1>
      </div>

      <ul className="hidden md:flex md:items-center gap-[32px] text-[#475569] font-semibold text-[14px] uppercase">
        {menus.map((menu) => (
          <li
            key={menu.id}
            onClick={() => scrollToSection(menu.id)}
            className="cursor-pointer hover:text-[#007BFF] transition-colors"
          >
            {menu.name}
          </li>
        ))}
      </ul>

      <div className="hidden md:block">
        <button
          onClick={onOpenModal}
          className="bg-[#007BFF] px-[20px] py-2 rounded-[24px] text-white shadow-lg shadow-blue-500/30 text-[14px] font-bold hover:bg-blue-600 transition-colors"
        >
          Mulai Produktif
        </button>
      </div>

      <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <HiX /> : <HiMenu />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="absolute top-[70px] left-0 w-full bg-white shadow-lg md:hidden"
          >
            <ul className="flex flex-col items-start gap-6 py-6 px-6 text-[#475569] font-semibold uppercase">
              {menus.map((menu) => (
                <li
                  key={menu.id}
                  onClick={() => {
                    scrollToSection(menu.id);
                    setIsOpen(false);
                  }}
                  className="cursor-pointer hover:text-[#007BFF]"
                >
                  {menu.name}
                </li>
              ))}

              <button
                onClick={() => {
                  onOpenModal();
                  setIsOpen(false);
                }}
                className="bg-[#007BFF] px-6 py-2 rounded-full text-white font-bold hover:bg-blue-600 w-full"
              >
                Mulai Produktif
              </button>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
