import Dexie from "dexie";

const DB_NAME = "decisifyDB";
const DB_VERSION = 1;

export const db = new Dexie(DB_NAME);

db.version(DB_VERSION).stores({
  users: "++id",
  tasks: "++id, userId",
  notes: "++id, userId",
  focus_sessions: "++id",
});
