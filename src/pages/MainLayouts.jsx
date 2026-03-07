import React from "react";
import { useLocation } from "react-router-dom";
import Sidebars from "../components/Sidebars";

const MainLayouts = ({ children }) => {
  const location = useLocation();
  const excludedPaths = ["/", "/welcome"];
  const showWidget = !excludedPaths.includes(location.pathname);

  return (
    <div className="relative min-h-screen bg-[#f8fafc]">
      {showWidget && <Sidebars />}

      <main
        className={`w-full transition-all duration-300 ${
          showWidget ? "md:pl-[100px] md:pr-[90px]" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default MainLayouts;
