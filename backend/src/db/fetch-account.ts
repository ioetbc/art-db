import {Account} from "../types";
import {database} from "./database";

export const fetchAccount = (
  userId: string
): {
  account: Account;
} => {
  console.log("fetchAccount: userId", userId);
  const account = database.account.find((account) => account.userId === userId);

  return {
    account,
  };
};
