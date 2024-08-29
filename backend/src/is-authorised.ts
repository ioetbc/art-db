import {GraphQLError} from "graphql";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} from "./create-jwt";
import {fetchAccount} from "./db/fetch-account";
import {Account} from "./types";
import {TokenExpiredError} from "jsonwebtoken";
import {assert} from "console";

export const isAuthorised = (
  accessToken: string,
  refreshToken: string
): {
  account: Account;
  accessToken: string;
  refreshToken: string; // remove these from both responses add them elsewhere maybe
} => {
  try {
    assert(accessToken, "accessToken is required");
    assert(refreshToken, "refreshToken is required");

    const data = verifyAccessToken(accessToken);
    const {account} = fetchAccount(data.userId);

    console.log("ACCESS_TOKEN verified 🎉");

    return {
      account,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    if (error.name !== TokenExpiredError.name) {
      throw new GraphQLError("invalid access token reason: unknown", {
        extensions: {
          code: "INVALID_ACCESS_TOKEN",
        },
      });
    }
  }

  console.log("ACCESS_TOKEN has expired 📆");

  const {userId} = verifyRefreshToken(refreshToken);

  try {
    const {account} = fetchAccount(userId);

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
