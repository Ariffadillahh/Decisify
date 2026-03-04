import { gooeyToast } from "goey-toast";
import { dbPromise } from "./db";

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
  const db = await dbPromise;
  const allTasks = await db.getAll("tasks");
  const now = new Date().getTime();
  const ONE_MINUTE = 60 * 1000;

  return allTasks.filter((task) => {
    if (!task.done) return true;

    if (task.done && task.completedAt && now - task.completedAt < ONE_MINUTE) {
      return true;
    }

    return false;
  });
};

export const archiveOldTasks = async () => {
  const db = await dbPromise;
  const allTasks = await db.getAll("tasks");
  const now = new Date().getTime();
  const ONE_MINUTE = 60 * 1000;

  for (const task of allTasks) {
    if (
      task.done &&
      task.completedAt &&
      now - task.completedAt >= ONE_MINUTE &&
      !task.archived
    ) {
      const archivedTask = { ...task, archived: true };
      await db.put("tasks", archivedTask);
      gooeyToast.success("Changes saved", {
        description: `Task "${task.title}" archived.`,
      });
    }
  }
};

export const createTask = async (taskData) => {
  const db = await dbPromise;
  const finalScore = calculateFinalScore(taskData);
  const newTask = {
    ...taskData,
    finalScore,
    done: false,
    userId: JSON.parse(localStorage.getItem("user"))?.id || null,
  };
  const id = await db.add("tasks", newTask);
  return { ...newTask, id };
};

export const updateTask = async (id, data) => {
  const db = await dbPromise;
  const newScore = calculateFinalScore(data);
  const updatedTask = { ...data, id, finalScore: newScore };
  await db.put("tasks", updatedTask);
  return updatedTask;
};

export const deleteTask = async (id) => {
  const db = await dbPromise;
  await db.delete("tasks", id);
  return { success: true };
};
