import { db } from "./db";

export const exportDB = async () => {
  try {
    const userData = localStorage.getItem("user");
    const userLocal = userData ? JSON.parse(userData) : null;

    const [allUsers, categories, tasks, folders, notes, focusSessions] =
      await Promise.all([
        db.users.toArray(),
        db.category.toArray(),
        db.tasks.toArray(),
        db.folders.toArray(),
        db.notes.toArray(),
        db.focus_sessions.toArray(),
      ]);

    const latestUser =
      allUsers.length > 0 ? [allUsers[allUsers.length - 1]] : [];

    const dataToExport = {
      appName: "Decisify",
      exportedAt: new Date().toISOString(),
      userProfile: userLocal,
      database: {
        users: latestUser,
        categories,
        tasks,
        folders,
        notes,
        focusSessions,
      },
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const userName =
      userLocal?.name?.toLowerCase().replace(/\s+/g, "_") || "user";

    link.href = url;
    link.download = `decisify_backup_${userName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Export failed", error);
    throw error;
  }
};
