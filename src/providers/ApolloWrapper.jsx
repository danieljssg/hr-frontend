"use client";
import makeClient from "@/api/graphqlClient";
import { ApolloNextAppProvider } from "@apollo/client-integration-nextjs";
export function ApolloWrapper({ children }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
