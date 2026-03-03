import React, { useEffect, useState } from "react";
import { createUser } from "../../services/userServices";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = await createUser(name);

    localStorage.setItem("user", JSON.stringify(user));

    navigate("/dashboard");
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    } 
  }, [navigate]);

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          className="border p-3 rounded-4xl"
          onChange={(e) => setName(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Welcome;
