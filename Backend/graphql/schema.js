import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Coordinates {
    lat: Float
    lng: Float
  }

  type DistanceTime {
    distance: String
    duration: String
  }

  type Query {
    getCoordinates(address: String!): Coordinates
    getDistanceTime(origin: String!, destination: String!): DistanceTime
  }
`;

export default typeDefs;