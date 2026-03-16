import React from "react";

const Footer = ({ logo, scrollToSection }) => {
  return (
    <footer className="bg-white">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center space-x-3"
          >
            <img src={logo} alt="Decisify" className="w-9" />
            <span className="text-[#0F172A] text-2xl font-semibold">
              Decisify
            </span>
          </button>

          <ul className="flex flex-wrap items-center text-sm font-medium text-gray-500 mt-5 md:mt-0">
            <li>
              <button
                onClick={() => scrollToSection("features")}
                className="hover:underline me-4 md:me-6 uppercase"
              >
                Fitur
              </button>
            </li>

            <li>
              <button
                onClick={() => scrollToSection("workflow")}
                className="hover:underline me-4 md:me-6 uppercase"
              >
                Cara Kerja
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("testimoni")}
                className="hover:underline me-4 md:me-6 uppercase"
              >
                Testimoni
              </button>
            </li>
          </ul>
        </div>

        <hr className="my-6 border-gray-200" />

        <span className="block text-sm text-gray-500 text-center">
          © 2026 Decisify. Hak Cipta Dilindungi.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
