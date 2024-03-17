import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLClient } from 'graphql-request'
import { createClient } from 'graphql-ws'

export const processorClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_PROCESSOR_GRAPHQL_API as string
)

export const cacheClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_STATECHAIN_CACHE_GRAPHQL_API as string
)

export const getGraphqlClient = (
  defaultEndpoint: 'processor' | 'statechainCache'
) => {
  const isBrowser = typeof window !== 'undefined'
  const processorWsLink =
    isBrowser && process.env.NEXT_PUBLIC_PROCESSOR_GRAPHQL_WS
      ? new GraphQLWsLink(
          createClient({
            url: process.env.NEXT_PUBLIC_PROCESSOR_GRAPHQL_WS,
          })
        )
      : null
  const processorHttpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_PROCESSOR_GRAPHQL_API,
  })

  const processorLink = processorWsLink
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query)
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          )
        },
        processorWsLink,
        processorHttpLink
      )
    : processorHttpLink

  const statechainCacheLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_STATECHAIN_CACHE_GRAPHQL_API,
  })

  const defaultLink =
    defaultEndpoint === 'processor' ? processorLink : statechainCacheLink
  const chooseStatechainCacheLink = split(
    (operation) => operation.getContext().clientName === 'statechainCache',
    statechainCacheLink,
    defaultLink
  )
  const chooseProcessorLink = split(
    (operation) => operation.getContext().clientName === 'processor',
    processorLink,
    chooseStatechainCacheLink
  )

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        // eslint-disable-next-line no-console
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      )
    // eslint-disable-next-line no-console
    if (networkError) console.error(`[Network error]: ${networkError}`)
  })

  return new ApolloClient({
    link: from([errorLink, chooseProcessorLink]),
    cache: new InMemoryCache(),
  })
}
