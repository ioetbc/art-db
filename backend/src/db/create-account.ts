import {createAccessToken, createRefreshToken} from "../create-jwt";
import {createUser} from "./create-user";
import {database} from "./database";

export const createAccount = ({email}) => {
  const user = createUser({email});
  const businessName = "ioetbc/rubberducker";

  const newAccount = {
    userId: user.id,
    businessName,
  };

  console.log("creating account", JSON.stringify(newAccount, null, 4));

  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);

  database.account.push(newAccount);

  return {...user, accessToken, refreshToken};
};
