import {sign, verify, JsonWebTokenError} from "jsonwebtoken";
import {JWT_SECRET} from "./consts";
import {getRefreshTokenVersion} from "./db/get-refresh-token-version";
import {GraphQLError} from "graphql";

type AccessTokenData = {
  userId: string;
};

type RefreshTokenData = {
  userId: string;
  refreshTokenVersion: number;
};

export const createAccessToken = (userId: string) => {
  const payload: AccessTokenData = {
    userId,
  };
  return sign(payload, JWT_SECRET, {expiresIn: "1m"});
};

export const createRefreshToken = (userId: string) => {
  const refreshTokenVersion = getRefreshTokenVersion({id: userId});

  const payload: RefreshTokenData = {
    userId,
    refreshTokenVersion,
  };
  return sign(payload, JWT_SECRET, {expiresIn: "30 days"});
};

export const verifyAccessToken = (accessToken: string) => {
  return <AccessTokenData>verify(accessToken, JWT_SECRET);
};

export const verifyRefreshToken = (refreshToken: string) => {
  let data: RefreshTokenData;
  try {
    data = <RefreshTokenData>verify(refreshToken, JWT_SECRET);
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new GraphQLError("verifyRefreshToken: token invalid", {
        extensions: {
          code: "INVALID_REFRESH_TOKEN",
        },
      });
    }
    throw error;
  }

  try {
    const refreshTokenVersion = getRefreshTokenVersion({id: data.userId});
    console.log("refreshTokenVersion", refreshTokenVersion);
    console.log("data.refreshTokenVersion", data.refreshTokenVersion);
    if (data.refreshTokenVersion !== refreshTokenVersion) {
      throw new GraphQLError("login attempt after force logout", {
        extensions: {
          code: "USER_FORCED_LOGOUT",
        },
      });
    }

    return data;
  } catch (error) {
    throw error;
  }
};
