import { GraphQLClient, gql } from 'graphql-request'

export const endpoint = "https://orcaqltest.aleph.cloud/"
// export const endpoint = "http://localhost:8080"

export const client = new GraphQLClient(endpoint, {
})