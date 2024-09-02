import {createAccount} from "../db/create-account";
import {createProduct} from "../db/create-product";
import {fetchOrders, init} from "../db/fetch-orders";
import {incrementRefreshTokenVersion} from "../db/increment-refresh-token";
import {isAuthorised} from "../is-authorised";

export const typeDefs = `#graphql
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

  type Order {
    id: ID!
    products: [Product]
  }


  type AccountDetails {
    verified: Boolean!
  }

  type Author {
    id: ID!
    name: String!
  }

  type Book {
    id: ID!
    title: String
    author: Author!
  }

  type Query {
    paintings: [Product]
    fetchAccountDetails: AccountDetails
    fetchBooks: [Book]
  }

  type Mutation {
    createAccount(email: String!): CreateAccountResponse
    createProduct: Product
    logoutAllDevices: LogoutAllDevicesResponse
  }


`;

export const resolvers = {
  Book: {
    author: async (parent) => {
      return {
        id: "author-id",
        name: "author name",
      };
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
  Query: {
    fetchAccountDetails: async (parent, __, context) => {
      await fetchOrders();
      return {
        verified: true,
      };
    },
    fetchBooks: async () => {
      return [
        {
          id: "book-1",
          name: "book 1",
          price: 100,
        },
        {
          id: "book-2",
          name: "book 2",
          price: 200,
        },
      ];
    },
  },
};
