import {database} from "./database";

export const createProduct = (painting) => {
  database.painting.push(painting);
  return painting;
};
