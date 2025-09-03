import { DefaultApolloClient } from "@vue/apollo-composable";
import type { App } from "vue";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { HttpLink } from "@apollo/client/link/http";

const httpLink = new HttpLink({
  uri: "https://graphqlzero.almansi.me/api",
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

export const apolloPlugin = {
  install(app: App) {
    app.provide(DefaultApolloClient, apolloClient);
  },
};
