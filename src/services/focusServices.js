import { db } from "./db";

export const addFocusSession = async (durationInSeconds, status) => {
  try {
    const sessionData = {
      duration_seconds: durationInSeconds,
      status: status, 
      date: new Date().toLocaleDateString("id-ID"), 
      timestamp: new Date().toISOString(),
    };

    const id = await db.focus_sessions.add(sessionData);

    return id;
  } catch (error) {
    console.error("Gagal menyimpan sesi fokus ke Dexie:", error);
  }
};
