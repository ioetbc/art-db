import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {typeDefs, resolvers} from "./schema";

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
