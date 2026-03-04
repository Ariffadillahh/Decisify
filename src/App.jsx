import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import Welcome from "./pages/Welcome/Welcome";
import TaskPage from "./pages/TaskPage/TaskPage";
import ProtectedRoute from "./ProtectedRoute";
import { GooeyToaster } from "goey-toast";

import "goey-toast/styles.css";

const App = () => {
  return (
    <>
      <GooeyToaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/welcome" element={<Welcome />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/task" element={<TaskPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
