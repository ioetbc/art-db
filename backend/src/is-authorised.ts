import {GraphQLError} from "graphql";
import {createAccessToken, createRefreshToken, verifyToken} from "./create-jwt";
import {fetchAccount} from "./db/fetch-account";

export const isAuthorised = (accessToken: string, refreshToken: string) => {
  try {
    const data = verifyToken(accessToken);
    const account = fetchAccount(data.userId);

    console.log("ACCESS_TOKEN verified 🎉");

    return {
      account,
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

  try {
    const data = verifyToken(refreshToken);
    const {account} = fetchAccount(data.userId);

    console.log("REFRESH_TOKEN verified 🎉");
    console.log("creating new ACCESS_TOKEN & REFRESH_TOKEN");

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
