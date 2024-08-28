import {GraphQLError} from "graphql";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} from "./create-jwt";
import {fetchAccount} from "./db/fetch-account";
import {getRefreshTokenVersion} from "./db/get-refresh-token-version";
import {Account} from "./types";

export const isAuthorised = (
  accessToken: string,
  refreshToken: string
): {
  account: Account;
  accessToken: string;
  refreshToken: string; // remove these from both responses add them elsewhere maybe
} => {
  try {
    const data = verifyAccessToken(accessToken);
    const {account} = fetchAccount(data.userId);

    console.log("ACCESS_TOKEN verified 🎉");

    return {
      account,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    if (error.name !== "TokenExpiredError") {
      throw new GraphQLError("Unauthorized", {
        extensions: {
          code: "UNAUTHORIZED",
        },
      });
    }
    console.log("ACCESS_TOKEN has expired 📆");
  }

  const data = verifyRefreshToken(refreshToken);
  const refreshTokenVersion = getRefreshTokenVersion(data.userId);

  if (data.refreshTokenVersion !== refreshTokenVersion) {
    throw new GraphQLError("login attempt after force logout", {
      extensions: {
        code: "USER_FORCED_LOGOUT",
      },
    });
  }

  try {
    const {account} = fetchAccount(data.userId);

    console.log("REFRESH_TOKEN verified 🎉");

    return {
      account,
      accessToken: createAccessToken(account.userId),
      refreshToken: createRefreshToken(account.userId),
    };
  } catch (error) {
    console.log("error verifying refresh token: ", error);
    throw new GraphQLError("Unauthorized", {
      extensions: {
        code: "UNAUTHORIZED",
      },
    });
  }
};
