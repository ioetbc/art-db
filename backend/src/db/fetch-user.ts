import {GraphQLError} from "graphql";
import {User} from "../types";
import {database} from "./database";

export const fetchUser = ({id}: Pick<User, "id">): User => {
  if (!id) {
    throw new Error("fetchUser: No user id provided");
  }

  // console.log("database.user", JSON.stringify(database.user, null, 4));

  const user = database.user.find((user) => user.id === id);

  if (!user) {
    throw new GraphQLError(`user not found`, {
      extensions: {
        code: "USER_NOT_FOUND",
      },
    });
  }

  return user;
};
