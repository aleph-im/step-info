import { GraphQLClient, gql } from 'graphql-request'

export const endpoint = "https://stepqltest.aleph.cloud/"
//export const endpoint = "http://localhost:8089"

export const client = new GraphQLClient(endpoint, {
})
