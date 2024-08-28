import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {GraphQLError} from "graphql";
import {createAccessToken, createRefreshToken, verifyToken} from "./create-jwt";

const userTable = [];
const accountTable = [];

const database = {
  user: userTable,
  account: accountTable,
  painting: [],
};

type User = {
  userId: number;
  email: string;
};

type Account = {
  id: number;
  user: User;
  accessToken: string;
  refreshToken: string;
};

type AccessTokenData = {
  userId: number;
};

function fetchUser({userId}: Pick<User, "userId">): User {
  if (!userId) {
    throw new Error("fetchUser: No user id provided");
  }

  const user = database.user.find((user) => user.userId === userId);

  return user;
}

function createUser({email}: Pick<User, "email">) {
  const newUser = {
    userId: userTable.length + 1,
    email,
  };

  userTable.push(newUser);

  return newUser;
}

function createAccount({email}) {
  const user = createUser({email});
  const accessToken = createAccessToken(user.userId);
  const refreshToken = createRefreshToken(user.userId);

  const newAccount = {
    id: accountTable.length + 1,
    user,
    accessToken,
    refreshToken,
  };

  accountTable.push(newAccount);

  return newAccount;
}

function fetchAccount(userId: number): {
  account: Account;
} {
  const user = fetchUser({userId});

  const account = database.account.find(
    (account) => account.email === user.email
  );

  return {
    account,
  };
}

function createProduct(painting) {
  database.painting.push(painting);
  return painting;
}

function isAuthorised(accessToken: string, refreshToken: string) {
  console.log("accessTokenaccessToken", accessToken);
  try {
    const data = verifyToken(accessToken);
    const account = fetchAccount(data.userId);

    return {
      account,
    };
  } catch (error) {
    console.log("error verifying access token: ", error);
    // token is expired or signed with a different JWT_SECRET
    // so now check refresh token
  }

  try {
    const data = verifyToken(refreshToken);
    const {account} = fetchAccount(data.userId);

    return {
      account,
      accessToken: createAccessToken(account.user.userId),
      refreshToken: createRefreshToken(account.user.userId),
    };
  } catch (error) {
    console.log("error verifying refresh token: ", error);
    throw new GraphQLError("Unauthorized", {
      extensions: {
        code: "UNAUTHORIZED",
      },
    });
  }
}

const typeDefs = `#graphql
  interface Produce {
    id: ID!
    name: String!
    quantity: Int!
    price: Int!
    nutrients: [String]
    vendor: Stall
    region: String!
  }

  type Fruit implements Produce {
    id: ID!
    name: String!
    quantity: Int!
    price: Int!
    nutrients: [String]
    vendor: Stall
    region: String!
    isSeedless: Boolean
    ripenessIndicators: [String]  
  }

  type Vegetable implements Produce {
    id: ID!
    name: String!
    quantity: Int!
    price: Int!
    nutrients: [String]
    vendor: Stall
    region: String!
    vegetableFamily: String
    isPickled: Boolean
  }

  type Stall {
    id: ID!
    name: String!
    stallNumber: String!
    availableProduce: [Produce]
  }

  type CreditCardExpiration {
    isExpired: Boolean!
    month: Int!
    year: Int!
  }

  type CreditCard {
    cardNumber: Int!
    expiration: CreditCardExpiration!
  }

  type Payment {
    creditCard: CreditCard
    giftCard: Int
  }

  type User {
    id: ID!
    email: String!
  }

  type CreateAccountResponse {
    user: User
    accessToken: String!
    refreshToken: String!
  }

  type AccountDetails {
    verified: Boolean!
    user: User!
  }

  type Product {
    id: ID!
    name: String!
    price: Int!
    artist: String!
    year: Int!
  }

  type Query {
    paintings: [Product]
  }

  type Mutation {
    createAccount(email: String!): CreateAccountResponse
    createProduct: Product
  }
`;

const resolvers = {
  Produce: {
    __resolveType(obj) {
      if (obj.isSeedless !== undefined) {
        return "Fruit";
      }

      if (obj.vegetableFamily) {
        return "Vegetable";
      }

      return null;
    },
  },
  Mutation: {
    createAccount: (_, {email}) => {
      console.log("the email", email);
      const account = createAccount({email});

      return {
        user: account.user,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
      };
    },
    createProduct: (_, __, context) => {
      console.log("context", context);
      isAuthorised(context.accessToken, context.refreshToken);

      const newProduct = {
        id: "painting-id",
        name: "painting name",
        price: 100,
        artist: "artist name",
        year: 2021,
      };

      createProduct(newProduct);

      return newProduct;
    },
  },
  Query: {},
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const main = async () => {
  const {url} = await startStandaloneServer(server, {
    listen: {port: 4000},
    context: async ({req}) => {
      return {
        accessToken: req.headers.accesstoken,
        refreshToken: req.headers.refreshtoken,
      };
    },
  });
  console.log(`🚀  Server ready at: ${url}`);
};

main();
