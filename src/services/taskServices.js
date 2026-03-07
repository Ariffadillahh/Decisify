import { gooeyToast } from "goey-toast";
import { db } from "./db";

export const calculateFinalScore = (taskData) => {
  const { date_deadline, tingkat_kesulitan, estimasi_jam } = taskData;

  const today = new Date();
  const deadline = new Date(date_deadline);

  const diffTime = deadline - today;
  // Sisa hari dalam bentuk desimal (contoh: 12 jam = 0.5, 30 menit = 0.02)
  const sisa_hari = diffTime / (1000 * 60 * 60 * 24);

  // Jika waktu sudah lewat deadline, langsung mutlak 1
  if (sisa_hari <= 0) {
    return 1;
  }

  // Normalisasi input agar maksimal bernilai 1
  const difficulty = Math.min(tingkat_kesulitan / 5, 1);
  const duration = Math.min(estimasi_jam / 12, 1);

  let finalScore = 0;

  if (sisa_hari <= 1) {
    // === KONDISI KRITIS (< 24 Jam) ===
    // Waktu mengambil alih! Skor dasar otomatis disetel tinggi antara 0.70 - 1.00.
    // Makin mepet jamnya, makin mendekati 1.00.
    const baseUrgency = 0.85 - sisa_hari * 0.3;

    // Kesulitan & durasi di-nerf (hanya jadi penambah bobot kecil)
    const extraWeight = difficulty * 0.1 + duration * 0.05;

    finalScore = baseUrgency + extraWeight;
  } else {
    // === KONDISI NORMAL (> 24 Jam) ===
    // Urgensi menyusut perlahan (2 hari = 0.5, 3 hari = 0.33, dst)
    const urgency = 1 / sisa_hari;

    // Bobot normal: 50% Waktu, 30% Kesulitan, 20% Durasi
    finalScore = urgency * 0.5 + difficulty * 0.3 + duration * 0.2;
  }

  // Jaga-jaga agar skor tidak pernah meleset dari range 0 - 1
  finalScore = Math.min(Math.max(finalScore, 0), 1);

  return parseFloat(finalScore.toFixed(4));
};

export const getAllTasks = async () => {
  const allTasks = await db.tasks.toArray();
  return allTasks.filter((task) => !task.archived);
};

export const archiveOldTasks = async () => {
  const allTasks = await db.tasks.toArray();
  const now = new Date().getTime();

  const TIME_ARCHIVED = 60 * 1000;

  let archivedCount = 0;

  for (const task of allTasks) {
    if (
      task.done &&
      task.completedAt &&
      now - task.completedAt >= TIME_ARCHIVED &&
      !task.archived
    ) {
      const archivedTask = { ...task, archived: true };
      await db.tasks.put(archivedTask);

      archivedCount++;
    }
  }

  if (archivedCount > 0) {
    gooeyToast.info(`${archivedCount} task lama telah dipindahkan ke Archive.`);
  }
};

export const createTask = async (taskData) => {
  const finalScore = calculateFinalScore(taskData);
  const newTask = {
    ...taskData,
    finalScore,
    done: false,
    archived: false,
    userId: JSON.parse(localStorage.getItem("user"))?.id || null,
  };
  const id = await db.tasks.add(newTask);
  return { ...newTask, id };
};

export const updateTask = async (id, data) => {
  const newScore = calculateFinalScore(data);
  const updatedTask = { ...data, id, finalScore: newScore };
  await db.tasks.put(updatedTask);
  return updatedTask;
};

export const deleteTask = async (id) => {
  await db.tasks.delete(id);

  return { success: true };
};
