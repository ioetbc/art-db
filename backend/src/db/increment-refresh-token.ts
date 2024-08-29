import {fetchUser} from "./fetch-user";

export const incrementRefreshTokenVersion = (userId: string) => {
  const user = fetchUser({id: userId});

  user.refreshTokenVersion = user.refreshTokenVersion + 1;

  // maybe ++user.refreshTokenVersion
  return true;
};
