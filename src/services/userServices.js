import { db } from "./db";

export const createUser = async (name) => {
  const userObject = {
    username: name,
    createdAt: new Date().toISOString(),
  };

  const id = await db.users.add(userObject);

  return { ...userObject, id };
};
