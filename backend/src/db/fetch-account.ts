import {Account} from "../types";
import {database} from "./database";
import {fetchUser} from "./fetch-user";

export const fetchAccount = (
  userId: number
): {
  account: Account;
} => {
  console.log("fetchAccount: userId", userId);
  console.log("fetchAccount: accounts", database.account);

  const account = database.account.find((account) => account.userId === userId);

  return {
    account,
  };
};
