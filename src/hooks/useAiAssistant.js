import { useState } from "react";
import axios from "axios";

export const useAiAssistant = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_AI;

  const generateAi = async (type, notesContent, length) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Pastikan backend kamu jalan di 3000
      const endpoint = `${API_URL}/ai/${type}`;

      const response = await axios.post(endpoint, {
        notes: notesContent,
        length: length.toString(),
      });

      setResult({ type, data: response.data });
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal menghubungi AI Server.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetResult = () => setResult(null);

  return { generateAi, loading, result, error, resetResult };
};
