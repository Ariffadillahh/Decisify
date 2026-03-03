import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      Dashboard
      <button onClick={() => navigate("/task")}>Task</button>
    </div>
  );
};

export default Dashboard;
