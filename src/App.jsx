import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import Welcome from "./pages/Welcome/Welcome";
import ProtectedRoute from "./ProtectedRoute";
import { GooeyToaster } from "goey-toast";

import "goey-toast/styles.css";
import KanbanTaskPage from "./pages/TaskManagementPage/KanbanTaskPage";
import CalenderTaskPage from "./pages/TaskManagementPage/CalenderTaskPage";

const App = () => {
  return (
    <>
      <GooeyToaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/welcome" element={<Welcome />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<CalenderTaskPage />} />
          <Route path="/tasks/kanban" element={<KanbanTaskPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
