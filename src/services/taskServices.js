import { db } from "./db";

const calculateFinalScore = (taskData) => {
  const { date_deadline, tingkat_kesulitan, estimasi_jam } = taskData;
  const today = new Date();
  const deadline = new Date(date_deadline);
  const diffTime = deadline - today;
  const sisa_hari = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const sisa_hari_safe = sisa_hari <= 0 ? 0.1 : sisa_hari;
  const urgency = 1 / sisa_hari_safe;
  const difficulty = tingkat_kesulitan / 5;
  const max_jam = 12;
  const duration = estimasi_jam / max_jam;
  const finalScore = urgency * 0.5 + difficulty * 0.3 + duration * 0.2;
  return parseFloat(finalScore.toFixed(4));
};

export const getAllTasks = async () => {
  const allTasks = await db.tasks.toArray();

  const now = new Date().getTime();
  const ONE_MINUTE = 60 * 1000;

  return allTasks.filter((task) => {
    // 1. Jika tugas belum selesai, tampilkan.
    if (!task.done) return true;

    // 2. Jika tugas sudah selesai, tampilkan HANYA jika belum lewat 1 menit
    // dan belum di-archive secara permanen.
    if (task.done && task.completedAt && now - task.completedAt < ONE_MINUTE) {
      return true;
    }

    return false;
  });
};

export const archiveOldTasks = async () => {
  const allTasks = await db.tasks.toArray();

  const now = new Date().getTime();
  const ONE_MINUTE = 60 * 1000;

  for (const task of allTasks) {
    // Jika sudah lewat 1 menit dan belum ditandai archived
    if (task.done && task.completedAt && now - task.completedAt >= ONE_MINUTE && !task.archived) {
      const archivedTask = { ...task, archived: true };

      await db.tasks.put(archivedTask);

      console.log(`Task "${task.title}" diarsipkan (tetap ada di DB)`);
    }
  }
};

export const createTask = async (taskData) => {
  const finalScore = calculateFinalScore(taskData);
  const newTask = {
    ...taskData,
    finalScore,
    done: false,
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
