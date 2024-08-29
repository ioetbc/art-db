import {User} from "../types";
import {fetchUser} from "./fetch-user";

export const getRefreshTokenVersion = ({id}: Pick<User, "id">) => {
  const user = fetchUser({id});

  return user.refreshTokenVersion || -1;
};
