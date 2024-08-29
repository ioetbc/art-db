export type User = {
  id: string;
  email: string;
  refreshTokenVersion: number;
};

export type Account = {
  userId: string;
  businessName: string;
};
