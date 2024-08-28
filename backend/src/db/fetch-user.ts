import {User} from "../types";
import {database} from "./database";

export const fetchUser = ({id}: Pick<User, "id">): User => {
  if (!id) {
    throw new Error("fetchUser: No user id provided");
  }

  const user = database.user.find((user) => user.id === id);

  return user;
};
