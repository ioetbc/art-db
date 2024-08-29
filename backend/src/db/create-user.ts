import {User} from "../types";
import {database} from "./database";

export const createUser = ({email}: Pick<User, "email">) => {
  const newUser = {
    id: crypto.randomUUID(),
    email,
    refreshTokenVersion: 1,
  };

  database.user.push(newUser);

  return newUser;
};
