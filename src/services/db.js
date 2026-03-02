import { openDB } from "idb";

const DB_NAME = "decisifyDB";
const DB_VERSION = 1;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("users")) {
      db.createObjectStore("users", {
        keyPath: "id",
        autoIncrement: true,
      });
    }

    if (!db.objectStoreNames.contains("tasks")) {
      const store = db.createObjectStore("tasks", {
        keyPath: "id",
        autoIncrement: true,
      });

      store.createIndex("by_user", "userId");
    }

    if (!db.objectStoreNames.contains("notes")) {
      db.createObjectStore("notes", {
        keyPath: "id",
        autoIncrement: true,
      });
    }

    if (!db.objectStoreNames.contains("study_sessions")) {
      db.createObjectStore("study_sessions", {
        keyPath: "id",
        autoIncrement: true,
      });
    }
  },
});
