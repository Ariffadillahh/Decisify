import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayouts from "../MainLayouts";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <MainLayouts>
      <div>
        Dashboard
        <button onClick={() => navigate("/task")}>Task</button>
      </div>
    </MainLayouts>
  );
};

export default Dashboard;
