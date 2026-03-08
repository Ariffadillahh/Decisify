import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../services/db";
import { useState } from "react";

export const useNotes = () => {
  const [activeNote, setActiveNote] = useState(null);

  const folders = useLiveQuery(() => db.folders.toArray()) || [];
  const notes = useLiveQuery(() => db.notes.toArray()) || [];
  const recentNotes = useLiveQuery(() => db.notes.orderBy("updatedAt").reverse().limit(5).toArray()) || [];

  const addFolder = async (name, parentId = null) => {
    await db.folders.add({ name: name || "Folder Baru", parentId });
  };

  const updateFolderTitle = async (id, name) => {
    await db.folders.update(id, { name });
  };

  const deleteFolderFromDB = async (id) => {
    await db.notes.where("folderId").equals(id).modify({ folderId: null });
    await db.folders.delete(id);
  };

  const addNote = async (folderId = null) => {
    const id = await db.notes.add({
      title: "Catatan Baru",
      folderId,
      content: JSON.stringify([{ type: "paragraph", content: [] }]),
      updatedAt: new Date(),
    });
    return id;
  };

  const moveNoteToFolder = async (noteId, folderId) => {
    // folderId bisa berupa string "uncategorized" (null) atau ID folder
    const targetFolderId = folderId === "uncategorized" ? null : parseInt(folderId);
    await db.notes.update(parseInt(noteId), { folderId: targetFolderId, updatedAt: new Date() });
  };

  const updateNoteContent = async (id, content) => {
    await db.notes.update(id, { content, updatedAt: new Date() });
  };

  const updateNoteTitle = async (id, title) => {
    await db.notes.update(id, { title, updatedAt: new Date() });
  };

  const deleteNoteFromDB = async (id) => {
    await db.notes.delete(id);
    if (activeNote?.id === id) setActiveNote(null);
  };

  const updateFolderColor = async (id, color) => {
    await db.folders.update(id, { color });
  };

  return {
    folders,
    notes,
    recentNotes,
    activeNote,
    setActiveNote,
    addFolder,
    updateFolderTitle,
    deleteFolderFromDB,
    addNote,
    moveNoteToFolder, // Fungsi baru
    updateNoteContent,
    updateNoteTitle,
    deleteNoteFromDB,
    updateFolderColor,
  };
};
