import {fetchUser} from "./fetch-user";

export const getRefreshTokenVersion = (userId: number) => {
  const user = fetchUser({id: userId});
  return user.refreshTokenVersion;
};
