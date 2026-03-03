import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);
  return (
    <div>
      LandingPage
      <button
        className="bg-blue-500 text-white p-4 rounded-4xl"
        onClick={() => navigate("/welcome")}
      >
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;
