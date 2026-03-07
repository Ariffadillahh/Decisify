import Dexie from "dexie";

const DB_NAME = "decisifyDB";
const DB_VERSION = 2;

export const db = new Dexie(DB_NAME);

db.version(DB_VERSION).stores({
  users: "++id",
  category: "++id, name", 
  tasks: "++id, userId, categoryId",
  notes: "++id, userId",
  focus_sessions: "++id",
});
