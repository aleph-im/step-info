import { GraphQLClient, gql } from 'graphql-request'

export const endpoint = "https://stepqltest.aleph.cloud/"
// export const endpoint = "http://localhost:8080"

export const client = new GraphQLClient(endpoint, {
})
