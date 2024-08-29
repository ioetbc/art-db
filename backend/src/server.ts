import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {database} from "./db/database";
import {createAccount} from "./db/create-account";
import {isAuthorised} from "./is-authorised";
import {incrementRefreshTokenVersion} from "./db/increment-refresh-token";

function createProduct(painting) {
  database.painting.push(painting);
  return painting;
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

  type LogoutAllDevicesResponse {
    success: Boolean!
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
    logoutAllDevices: LogoutAllDevicesResponse
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
    logoutAllDevices: (_, __, context) => {
      const user = isAuthorised(context.accessToken, context.refreshToken);
      console.log("logging out user", user);

      incrementRefreshTokenVersion(user.account.userId);

      return {
        success: true, // return a union or just a boolean?
      };
    },
    createAccount: (_, {email}) => {
      const account = createAccount({email});

      return account;
    },
    createProduct: (_, __, context) => {
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

// 1. login endpoint
