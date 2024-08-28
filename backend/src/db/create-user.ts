import {User} from "../types";
import {database} from "./database";

export const createUser = ({email}: Pick<User, "email">) => {
  const newUser = {
    id: 1,
    email,
  };

  database.user.push(newUser);

  return newUser;
};
