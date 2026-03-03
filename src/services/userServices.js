import { dbPromise } from "./db";

export const createUser = async (name) => {
  const db = await dbPromise;

  const userObject = {
    username: name,
    createdAt: new Date().toISOString(),
  };

  const id = await db.add("users", userObject);

  return { ...userObject, id };
};
