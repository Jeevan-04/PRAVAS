import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_COORDINATES = gql`
  query GetCoordinates($address: String!) {
    getCoordinates(address: $address) {
      lat
      lng
    }
  }
`;

const SomeComponent = () => {
  const { loading, error, data } = useQuery(GET_COORDINATES, {
    variables: { address: 'Some address' },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <p>Latitude: {data.getCoordinates.lat}</p>
      <p>Longitude: {data.getCoordinates.lng}</p>
    </div>
  );
};

export default SomeComponent;
