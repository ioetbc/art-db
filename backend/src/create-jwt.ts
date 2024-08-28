import {sign, verify} from "jsonwebtoken";
import {JWT_SECRET} from "./consts";
import {getRefreshTokenVersion} from "./db/get-refresh-token-version";

type AccessTokenData = {
  userId: number;
};

type RefreshTokenData = {
  userId: number;
  refreshTokenVersion: number;
};

export const createAccessToken = (userId: number) => {
  const payload: AccessTokenData = {
    userId,
  };
  return sign(payload, JWT_SECRET, {expiresIn: "1m"});
};

export const createRefreshToken = (userId: number) => {
  const refreshTokenVersion = getRefreshTokenVersion(userId);

  const payload: RefreshTokenData = {
    userId,
    refreshTokenVersion,
  };
  return sign(payload, JWT_SECRET, {expiresIn: "30 days"});
};

export const verifyAccessToken = (token: string) => {
  return <AccessTokenData>verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (refreshToken: string) => {
  return <RefreshTokenData>verify(refreshToken, JWT_SECRET);
};
