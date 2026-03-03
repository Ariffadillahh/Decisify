import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import Welcome from "./pages/Welcome/Welcome";
import TaskPage from "./pages/TaskPage/TaskPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/task" element={<TaskPage />} />
      <Route path="/welcome" element={<Welcome />} />
    </Routes>
  );
};

export default App;
