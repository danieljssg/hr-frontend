import { HttpLink, ApolloLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

const getAuthTokenFromCookie = () => {
  if (typeof window === "undefined") {
    return null;
  }
  const name = "jwt=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
};

const makeClient = () => {
  const httpLink = new HttpLink({
    uri:
      `${process.env.NEXT_PUBLIC_BASE_URL}/graphql` ||
      "http://localhost:3350/graphql",
    fetchOptions: {
      credentials: "include",
    },
  });

  const authLink = setContext((_, { headers }) => {
    const token = getAuthTokenFromCookie();

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authLink, httpLink]),
  });
};

export default makeClient;
