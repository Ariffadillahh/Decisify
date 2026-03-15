import React from "react";
import { useLocation } from "react-router-dom";
import Sidebars from "../components/Sidebars";
import NavbarDashboard from "../components/Dashboard/NavbarDashboard";

const MainLayouts = ({ children }) => {
  const location = useLocation();
  const excludedPaths = ["/"];
  const showWidget = !excludedPaths.includes(location.pathname);

  if (!showWidget) {
    return <div className="min-h-screen bg-[#f8fafc]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans overflow-x-hidden">
      <header className="w-full h-[80px] fixed top-0 left-0 z-50 bg-white border-b border-slate-100 flex items-center">
        <div className="w-full">
          <NavbarDashboard />
        </div>
      </header>

      <div className="pt-[80px] flex w-full max-w-[1600px] mx-auto relative">
        <aside className="fixed top-[80px] left-0 w-[320px] h-[calc(100vh-80px)] p-6 hidden md:block overflow-hidden z-40">
          <Sidebars />
        </aside>

        <main className="flex-1 md:pr-0 md:py-4 md:pr-8 md:pl-2 w-full md:ml-[280px] min-h-[calc(100vh-80px)]">{children}</main>
      </div>
    </div>
  );
};

export default MainLayouts;
