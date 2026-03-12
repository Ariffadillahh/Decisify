import { db } from "./db";

export const createUser = async (nameData) => {
  const finalName = typeof nameData === "object" ? nameData.name : nameData;

  const userObject = {
    name: finalName, 
    createdAt: new Date().toISOString(),
  };

  const id = await db.users.add(userObject);

  return { ...userObject, id };
};
