import {sign, verify} from "jsonwebtoken";
import {JWT_SECRET} from "./consts";

type AccessTokenData = {
  userId: number;
};

export const createAccessToken = (userId: number) => {
  const payload: AccessTokenData = {
    userId,
  };
  return sign(payload, JWT_SECRET, {expiresIn: "10m"});
};

export const createRefreshToken = (userId: number) => {
  const payload: AccessTokenData = {
    userId,
  };
  return sign(payload, JWT_SECRET, {expiresIn: "30 days"});
};

export const verifyToken = (token: string) => {
  return <AccessTokenData>verify(token, JWT_SECRET);
};
