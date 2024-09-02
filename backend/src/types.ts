export type User = {
  id: string;
  email: string;
  refreshTokenVersion: number;
};

export type Account = {
  userId: string;
  businessName: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  artist: string;
  year: number;
};

type Order = {
  id: string;
  name: string;
  price: number;
  artist: string;
  year: number;
};

export type AccountDetails = {
  verified: boolean;
  orders: Order[];
};
