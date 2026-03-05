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
        // Hitung sisa hari dari sekarang ke deadline
        const diffDays = Math.ceil(
          (deadlineTime - now) / (1000 * 60 * 60 * 24),
        );

        // Kembalikan true jika H-7 (atau kurang) ATAU skor urgensi > 0.7
        return diffDays <= 7 || task.finalScore > 0.7;
      }
      // Untuk status Todo, Doing, Done tetap ditampilkan semua
      return true;
    });

    // 2. Sorting otomatis (Sudah aman: b.finalScore - a.finalScore mengurutkan dari tertinggi)
    const todoDoing = visibleTasks
      .filter((t) => t.status !== "Done")
      .sort((a, b) => b.finalScore - a.finalScore);

    const done = visibleTasks
      .filter((t) => t.status === "Done")
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

    setTasks([...todoDoing, ...done]);
  }, []);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(async () => {
      await archiveOldTasks();
      fetchTasks();
    }, 10000);
    return () => clearInterval(interval);
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

    // 3. Logika Maksimal 5 Task di Todo
    // Cek jika task dipindah KE Todo (tapi BUKAN dari dalam Todo itu sendiri)
    if (destination.droppableId === "Todo" && source.droppableId !== "Todo") {
      const currentTodoCount = tasks.filter((t) => t.status === "Todo").length;

      if (currentTodoCount >= 5) {
        gooeyToast.error(
          "Todo Max 5",
        );
        return; // Hentikan proses drag-and-drop
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
      completedAt: isDone ? Date.now() : null,
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

    const todoAndDoing = updatedTasks
      .filter((t) => t.status !== "Done")
      .sort((a, b) => b.finalScore - a.finalScore);

    const doneTasks = updatedTasks.filter((t) => t.status === "Done");

    const finalTasks = [...todoAndDoing, ...doneTasks];

    setTasks(finalTasks);
    await updateTask(updatedTask.id, updatedTask);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Hapus tugas ini?")) {
      await deleteTask(id);
      fetchTasks();
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
  };
};
