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
import ArchiveTaskPage from "./pages/TaskManagementPage/ArchiveTaskPage";
import NotesPage from "./pages/Notes/NotesPage";

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
          <Route path="/tasks/archive" element={<ArchiveTaskPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/:noteId" element={<NotesPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
