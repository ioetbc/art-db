export type User = {
  id: number;
  email: string;
  refreshTokenVersion: number;
};

export type Account = {
  userId: number;
  userName: string;
};
