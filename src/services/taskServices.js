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

  const TIME_24_HOURS = 24 * 60 * 60 * 1000;

  const doneTasks = allTasks
    .filter((t) => t.status === "Done" && !t.archived)
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

  let archivedCount = 0;

  if (doneTasks.length > 5) {
    const extraTasks = doneTasks.slice(5); 
    for (const task of extraTasks) {
      await db.tasks.update(task.id, { archived: true });
      archivedCount++;
    }
  }

  for (const task of doneTasks.slice(0, 5)) {
    if (
      task.completedAt &&
      now - task.completedAt >= TIME_24_HOURS &&
      !task.archived
    ) {
      await db.tasks.update(task.id, { archived: true });
      archivedCount++;
    }
  }

  if (archivedCount > 0) {
    gooeyToast.info(`${archivedCount} tugas telah dipindahkan ke Archive.`);
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

export const getArchivedTasks = async () => {
  const allTasks = await db.tasks.toArray();
  const archived = allTasks.filter((task) => task.archived === true);
  return archived.sort(
    (a, b) => (b.completedAt || b.id) - (a.completedAt || a.id),
  );
};

export const restoreArchivedTask = async (task) => {
  const restoredTask = {
    ...task,
    archived: false,
    done: false,
    status: "Todo",
  };
  await updateTask(task.id, restoredTask);
  return restoredTask;
};

export const reopenArchivedTask = async (id, dataFromForm) => {
  const numericId = Number(id);

  const newScore = calculateFinalScore(dataFromForm);

  await db.tasks.update(numericId, {
    ...dataFromForm,
    finalScore: newScore,
    archived: false,
    done: false,
    status: "Backlog",
    completedAt: undefined,
  });

  return await db.tasks.get(numericId);
};
