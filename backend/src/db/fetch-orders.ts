import {AccountDetails} from "../types";

function promisifyRandomNumber(): Promise<AccountDetails> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const num = Math.random() * 100;
      if (num < 10) {
        resolve({
          verified: true,
          orders: [
            {
              id: "order-id",
              name: "painting name",
              price: 100,
              artist: "artist name",
              year: 2021,
            },
          ],
        });
      } else {
        reject(new Error("random number too high"));
      }
    }, 200);
  });
}

export async function init() {
  try {
    const result = await promisifyRandomNumber();
    return result;
  } catch (e) {
    throw e;
  }
}

export const fetchOrders = async () => {
  const result = await init();
  return result;
};
