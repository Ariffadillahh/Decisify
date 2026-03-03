import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      Dashboard
      <button onClick={() => navigate("/task")}>Task</button>
    </div>
  );
};

export default Dashboard;
