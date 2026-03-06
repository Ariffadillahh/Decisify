import { useState, useEffect, useCallback } from "react";
import { gooeyToast } from "goey-toast";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  archiveOldTasks,
} from "../services/taskServices";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    date_deadline: "",
    tingkat_kesulitan: 1,
    estimasi_jam: 1,
  });

  const fetchTasks = useCallback(async () => {
    const data = await getAllTasks();
    const now = new Date().getTime();

    const normalized = data.map((task) => ({
      ...task,
      status: task.status || "Backlog",
      done: task.status === "Done",
    }));

    // 1. Logika Filter Backlog: H-7 atau Score > 0.7
    const visibleTasks = normalized.filter((task) => {
      if (task.status === "Backlog") {
        const deadlineTime = new Date(task.date_deadline).getTime();
        const diffDays = Math.ceil(
          (deadlineTime - now) / (1000 * 60 * 60 * 24),
        );
        return diffDays <= 7 || task.finalScore > 0.7;
      }
      return true; // Untuk Todo, Doing, Done diloloskan
    });

    // 2. Pisahkan Todo & Doing, lalu urutkan berdasarkan urgensi tertinggi
    const todoDoing = visibleTasks
      .filter((t) => t.status !== "Done")
      .sort((a, b) => b.finalScore - a.finalScore);

    // 3. Pisahkan Done, urutkan dari yang terbaru diselesaikan, dan BATASI MAX 5
    const doneTasks = visibleTasks
      .filter((t) => t.status === "Done")
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
      .slice(0, 5); // Tampilkan maksimal 5 saja di UI

    setTasks([...todoDoing, ...doneTasks]);
  }, []);

  useEffect(() => {
    fetchTasks();

    // Interval untuk mengecek task mana yang sudah 24 jam di kolom Done untuk di-archive
    const interval = setInterval(async () => {
      await archiveOldTasks();
      fetchTasks();
    }, 60000); // Cek setiap 1 menit (60.000 ms)

    // Listener untuk sinkronisasi UI instan antar komponen (misal dari Pomodoro)
    const syncTasks = () => fetchTasks();
    window.addEventListener("tasks_updated", syncTasks);

    return () => {
      clearInterval(interval);
      window.removeEventListener("tasks_updated", syncTasks);
    };
  }, [fetchTasks]);

  const openModal = (task = null) => {
    if (task) {
      setIsEditMode(true);
      setCurrentTaskId(task.id);
      setFormData({
        title: task.title,
        date_deadline: task.date_deadline,
        tingkat_kesulitan: task.tingkat_kesulitan,
        estimasi_jam: task.estimasi_jam,
      });
    } else {
      setIsEditMode(false);
      setFormData({
        title: "",
        date_deadline: "",
        tingkat_kesulitan: 1,
        estimasi_jam: 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tingkat_kesulitan: parseInt(formData.tingkat_kesulitan),
      estimasi_jam: parseInt(formData.estimasi_jam),
    };

    if (isEditMode) {
      const originalTask = tasks.find((t) => t.id === currentTaskId);
      await updateTask(currentTaskId, { ...originalTask, ...payload });
    } else {
      await createTask({ ...payload, status: "Backlog", done: false });
    }

    setIsModalOpen(false);
    fetchTasks();
    window.dispatchEvent(new Event("tasks_updated")); // Pemicu sinkronisasi
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Batasi kolom Todo maksimal 5 task
    if (destination.droppableId === "Todo" && source.droppableId !== "Todo") {
      const currentTodoCount = tasks.filter((t) => t.status === "Todo").length;
      if (currentTodoCount >= 5) {
        gooeyToast.error("Todo Max 5");
        return;
      }
    }

    const updatedTasks = Array.from(tasks);
    const draggedIndex = updatedTasks.findIndex(
      (t) => t.id.toString() === draggableId,
    );
    if (draggedIndex === -1) return;

    const draggedTask = updatedTasks[draggedIndex];
    updatedTasks.splice(draggedIndex, 1);

    const isDone = destination.droppableId === "Done";
    const updatedTask = {
      ...draggedTask,
      status: destination.droppableId,
      done: isDone,
      completedAt: isDone ? Date.now() : null, // Catat waktu selesai
    };

    if (isDone) {
      const firstDoneIndex = updatedTasks.findIndex((t) => t.status === "Done");
      const insertAt =
        firstDoneIndex === -1
          ? updatedTasks.length
          : firstDoneIndex + destination.index;
      updatedTasks.splice(insertAt, 0, updatedTask);
    } else {
      updatedTasks.push(updatedTask);
    }

    // Optimistic UI Update (Biarkan pengguna melihat perubahannya secepat kilat)
    const todoAndDoing = updatedTasks
      .filter((t) => t.status !== "Done")
      .sort((a, b) => b.finalScore - a.finalScore);
    const doneTasks = updatedTasks.filter((t) => t.status === "Done");
    setTasks([...todoAndDoing, ...doneTasks]);

    // Lakukan pembaruan di background (DB)
    await updateTask(updatedTask.id, updatedTask);

    // Panggil ulang fetch untuk memberlakukan limit 5 Done dan sinkronkan dengan komponen lain
    fetchTasks();
    window.dispatchEvent(new Event("tasks_updated"));
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Hapus tugas ini?")) {
      await deleteTask(id);
      fetchTasks();
      window.dispatchEvent(new Event("tasks_updated")); 
    }
  };

  return {
    tasks,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    formData,
    openModal,
    handleChange,
    handleSubmit,
    onDragEnd,
    handleDelete,
    fetchTasks
  };
};
