    import React from "react";
    import { useLocation } from "react-router-dom";
    import PomodoroGuardian from "../components/PomodoroGuardian";

    const MainLayouts = ({ children }) => {
    const location = useLocation();
    const excludedPaths = ["/", "/welcome"];
    const showWidget = !excludedPaths.includes(location.pathname);
    return (
        <div className="relative min-h-screen">
        {children}
        {showWidget && <PomodoroGuardian />}
        </div>
    );
    };

    export default MainLayouts;
