import {createAccessToken, createRefreshToken} from "../create-jwt";
import {createUser} from "./create-user";
import {database} from "./database";

export const createAccount = ({email}) => {
  const user = createUser({email});
  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);

  const newAccount = {
    userId: 1,
    userName: email.split("@")[0],
  };

  database.account.push(newAccount);

  return newAccount;
};
