import React from "react";
import { FaCheck } from "react-icons/fa";
import { THEME_LIST } from "../../helpers/pomodoroUtils";

const ThemeSelector = ({ theme, setTheme }) => {
  return (
    <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
      {THEME_LIST.map((t) => {
        const isActive = theme.id === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t)}
            title={t.name}
            className={`relative w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden bg-cover bg-center transition-all duration-300 ${
              isActive
                ? "ring-4 ring-indigo-500 scale-110 shadow-xl"
                : "hover:scale-105 opacity-70 hover:opacity-100"
            } ${t.colorClass || ""}`}
            style={{ backgroundImage: t.bg !== "none" ? t.bg : "none" }}
          >
            {isActive && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <FaCheck className="text-white drop-shadow-md" size={18} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSelector;
