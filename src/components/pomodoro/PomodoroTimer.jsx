import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdTimer } from "react-icons/md";

import { usePomodoro } from "../../hooks/usePomodoro";
import { useTasks } from "../../hooks/useTasks";
import { updateTask } from "../../services/taskServices";
import { gooeyToast } from "goey-toast";

import PomodoroSetupModal from "./PomodoroSetupModal";
import PomodoroFocusScreen from "./PomodoroFocusScreen";
import { PLAYLIST } from "../../helpers/pomodoroUtils";

const PomodoroTimer = () => {
  const pomodoro = usePomodoro();
  const { tasks } = useTasks();

  const availableTasks = tasks.filter(
    (t) => t.status === "Todo" || t.status === "Doing",
  );

  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const [showTasksMobile, setShowTasksMobile] = useState(false);

  const handleToggleTaskSelection = (id) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id)
        ? prev.filter((taskId) => taskId !== id)
        : [...prev, id],
    );
  };

  const handleStartFocus = async () => {
    const tasksToWorkOn = tasks.filter((t) => selectedTaskIds.includes(t.id));
    tasksToWorkOn.sort((a, b) => b.finalScore - a.finalScore);

    const tasksAsDoing = await Promise.all(
      tasksToWorkOn.map(async (task) => {
        const updatedTask = { ...task, status: "Doing" };
        await updateTask(task.id, updatedTask);
        return updatedTask;
      }),
    );

    setActiveTasks(tasksAsDoing);
    pomodoro.setIsOpen(false);
    pomodoro.setIsFocusMode(true);
    pomodoro.setIsFinished(false);
    pomodoro.setIsRest(false);
    pomodoro.setCurrentSession(1);
    pomodoro.setTimeLeft(pomodoro.focusDuration * 60);
    setShowTasksMobile(false);

    window.dispatchEvent(new Event("tasks_updated"));
  };

  const handleStopAndRevert = async () => {
    await Promise.all(
      activeTasks.map(async (task) => {
        if (!task.done) {
          await updateTask(task.id, { ...task, status: "Todo" });
        }
      }),
    );

    setActiveTasks([]);
    setSelectedTaskIds([]);
    pomodoro.handleStop();

    window.dispatchEvent(new Event("tasks_updated"));
  };

  const handleMarkTaskDone = async (task) => {
    const isNowDone = !task.done;

    const updatedTaskData = {
      ...task,
      status: isNowDone ? "Done" : "Doing",
      done: isNowDone,
      completedAt: isNowDone ? Date.now() : null,
    };

    setActiveTasks((prevTasks) => {
      const updatedList = prevTasks.map((t) =>
        t.id === task.id ? updatedTaskData : t,
      );
      updatedList.sort((a, b) => {
        if (a.done === b.done) return b.finalScore - a.finalScore;
        return a.done ? 1 : -1;
      });
      return updatedList;
    });

    try {
      await updateTask(task.id, updatedTaskData);
      if (isNowDone) gooeyToast.success("Tugas selesai! Kerja bagus.");

      // Memicu sinkronisasi ke papan Kanban instan!
      window.dispatchEvent(new Event("tasks_updated"));
    } catch (error) {
      console.error("Gagal mengupdate tugas:", error);
      gooeyToast.error("Gagal menyimpan status tugas.");
    }
  };

  return (
    <>
      <audio
        ref={pomodoro.audioRef}
        src={PLAYLIST[pomodoro.currentSongIndex].src}
        onEnded={pomodoro.nextSong}
        loop={false}
      />

      {!pomodoro.isFocusMode && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => pomodoro.setIsOpen(true)}
          className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 p-3 md:p-4 bg-indigo-600 rounded-full shadow-lg text-white"
          title="Pomodoro Timer"
        >
          <MdTimer size={24} />
        </motion.button>
      )}

      <PomodoroFocusScreen
        pomodoro={pomodoro}
        activeTasks={activeTasks}
        handleMarkTaskDone={handleMarkTaskDone}
        handleStopAndRevert={handleStopAndRevert}
        showTasksMobile={showTasksMobile}
        setShowTasksMobile={setShowTasksMobile}
      />

      <PomodoroSetupModal
        pomodoro={pomodoro}
        availableTasks={availableTasks}
        selectedTaskIds={selectedTaskIds}
        handleToggleTaskSelection={handleToggleTaskSelection}
        handleStartFocus={handleStartFocus}
      />
    </>
  );
};

export default PomodoroTimer;
