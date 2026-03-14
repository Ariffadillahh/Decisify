import { useState, useEffect, useCallback } from "react";
import { gooeyToast } from "goey-toast";
import { db } from "../services/db";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  archiveOldTasks,
  calculateFinalScore,
  getArchivedTasks,
  restoreArchivedTask,
  reopenArchivedTask,
  updateArchivedTask,
} from "../services/taskServices";

const initialFormState = {
  title: "",
  category: "",
  date_deadline: "",
  tingkat_kesulitan: 1,
  estimasi_jam: 1,
};

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [allRawTasks, setAllRawTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const fetchTasks = useCallback(async () => {
    const rawAllData = await db.tasks.toArray();
    const data = await getAllTasks();
    const now = new Date().getTime();

    const categories = await db.category.toArray();
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {});

    // --- PERBAIKAN 1: NORMALISASI SEMUA TUGAS (Termasuk untuk Kalender) ---
    // Pastikan categoryName dan finalScore ikut ter-mapping agar UI AgendaList bisa membacanya
    const normalizedAll = rawAllData.map((task) => {
      const resolvedCategoryName =
        categoryMap[task.categoryId] || task.category || "";
      return {
        ...task,
        categoryName: resolvedCategoryName,
        finalScore: calculateFinalScore(task),
        status: task.status || "Backlog",
        done: task.status === "Done",
      };
    });
    setAllRawTasks(normalizedAll);

    // --- NORMALISASI KHUSUS KANBAN BOARD ---
    const normalized = data.map((task) => {
      const resolvedCategoryName =
        categoryMap[task.categoryId] || task.category || "";
      return {
        ...task,
        categoryName: resolvedCategoryName,
        finalScore: calculateFinalScore(task),
        status: task.status || "Backlog",
        done: task.status === "Done",
      };
    });

    const visibleTasks = normalized.filter((task) => {
      if (task.status === "Backlog") {
        const deadlineTime = new Date(task.date_deadline).getTime();
        const diffDays = Math.ceil(
          (deadlineTime - now) / (1000 * 60 * 60 * 24),
        );
        return diffDays <= 7 || task.finalScore > 0.7 || task.forceShow;
      }
      return true;
    });

    const todoDoing = visibleTasks
      .filter((t) => t.status !== "Done")
      .sort((a, b) => b.finalScore - a.finalScore);

    const doneTasks = visibleTasks
      .filter((t) => t.status === "Done")
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
      .slice(0, 5);

    setTasks([...todoDoing, ...doneTasks]);
  }, []);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(async () => {
      await archiveOldTasks();
      fetchTasks();
    }, 60000);

    const syncTasks = () => fetchTasks();
    window.addEventListener("tasks_updated", syncTasks);

    return () => {
      clearInterval(interval);
      window.removeEventListener("tasks_updated", syncTasks);
    };
  }, [fetchTasks]);

  const openModal = async (task = null) => {
    if (task) {
      // 🔥 ambil data terbaru dari database
      const freshTask = await db.tasks.get(task.id);

      let formattedDate = freshTask.date_deadline;
      if (formattedDate && formattedDate.length === 10) {
        formattedDate += "T00:00";
      }

      setIsEditMode(true);
      setCurrentTaskId(freshTask.id);

      // --- PERBAIKAN 2: Resolve Nama Kategori ---
      // Karena DB hanya simpan categoryId, kita harus cari namanya dari tabel category
      const categories = await db.category.toArray();
      const existingCat = categories.find((c) => c.id === freshTask.categoryId);
      const resolvedCategoryName = existingCat
        ? existingCat.name
        : freshTask.category || "";

      setFormData({
        id: freshTask.id,
        title: freshTask.title,
        category: resolvedCategoryName, // Gunakan nama yang sudah di-resolve
        date_deadline: formattedDate,
        tingkat_kesulitan: freshTask.tingkat_kesulitan,
        estimasi_jam: freshTask.estimasi_jam,
      });
    } else {
      setIsEditMode(false);
      setFormData(initialFormState);
    }

    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalCategoryId = null;

    if (formData.category) {
      const existingCat = await db.category
        .where("name")
        .equals(formData.category)
        .first();

      if (existingCat) {
        finalCategoryId = existingCat.id;
      } else {
        finalCategoryId = await db.category.add({ name: formData.category });
      }
    }

    const payload = {
      title: formData.title,
      categoryId: finalCategoryId,
      date_deadline: formData.date_deadline,
      tingkat_kesulitan: parseInt(formData.tingkat_kesulitan),
      estimasi_jam: parseInt(formData.estimasi_jam),
    };

    try {
      if (isEditMode) {
        // Cari dari kedua sumber agar aman
        const originalTask =
          tasks.find((t) => t.id === currentTaskId) ||
          allRawTasks.find((t) => t.id === currentTaskId);

        const updatedTask = {
          ...originalTask,
          ...payload,
        };

        await updateTask(currentTaskId, updatedTask);
        gooeyToast.success("Tugas berhasil diubah!");
      } else {
        await createTask({
          ...payload,
          status: "Backlog",
          done: false,
        });
        gooeyToast.success("Tugas baru berhasil dibuat!");
      }

      await fetchTasks();
      window.dispatchEvent(new Event("tasks_updated"));
      setIsModalOpen(false);
    } catch (error) {
      console.error("ERROR SAVE TASK:", error);
      gooeyToast.error("Terjadi kesalahan saat menyimpan tugas.");
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

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
    setTasks([...todoAndDoing, ...doneTasks]);

    await updateTask(updatedTask.id, updatedTask);

    if (isDone) await archiveOldTasks();

    fetchTasks();
    window.dispatchEvent(new Event("tasks_updated"));
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
    window.dispatchEvent(new Event("tasks_updated"));
    gooeyToast.success("Tugas dihapus.");
  };

  const fetchArchivedTasks = async () => {
    try {
      const data = await getArchivedTasks();
      setArchivedTasks(data);
    } catch (error) {
      console.error("Gagal mengambil data archive:", error);
    }
  };

  const handleRestoreTask = async (task) => {
    try {
      await restoreArchivedTask(task);
      gooeyToast.success("Tugas berhasil dikembalikan ke Kanban!");
      fetchArchivedTasks();
      fetchTasks();
      window.dispatchEvent(new Event("tasks_updated"));
    } catch (error) {
      gooeyToast.error("Gagal mengembalikan tugas.");
    }
  };

  const handleDeleteArchivedTask = async (id) => {
    if (window.confirm("Hapus tugas ini secara permanen?")) {
      try {
        await deleteTask(id);
        gooeyToast.success("Tugas dihapus permanen.");
        fetchArchivedTasks();
      } catch (error) {
        gooeyToast.error("Gagal menghapus tugas.");
      }
    }
  };

  const handleArchiveEditSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalCategoryId = null;
      if (formData.category) {
        const existingCat = await db.category
          .where("name")
          .equals(formData.category)
          .first();
        if (existingCat) {
          finalCategoryId = existingCat.id;
        } else {
          finalCategoryId = await db.category.add({ name: formData.category });
        }
      }

      const payload = {
        ...formData,
        categoryId: finalCategoryId,
        tingkat_kesulitan: parseInt(formData.tingkat_kesulitan),
        estimasi_jam: parseInt(formData.estimasi_jam),
      };

      delete payload.category;
      await updateArchivedTask(formData.id, payload);

      gooeyToast.success("Tugas arsip berhasil diperbarui!");
      setIsModalOpen(false);
      fetchArchivedTasks();
    } catch (error) {
      console.error(error);
      gooeyToast.error("Gagal menyimpan perubahan.");
    }
  };

  return {
    tasks,
    fetchTasks,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    formData,
    setFormData,
    openModal,
    handleChange,
    handleSubmit,
    onDragEnd,
    handleDelete,
    allRawTasks,
    archivedTasks,
    fetchArchivedTasks,
    handleRestoreTask,
    handleDeleteArchivedTask,
    handleArchiveEditSubmit,
  };
};
