import axios from 'axios';

const API_KEY = 'IzaSyAG7C10W1bxaoggGhW2VJYRWeJ7gSbpIcQ'; 

const resolvers = {
  Query: {
    getCoordinates: async (_, { address }) => {
      try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address,
            key: API_KEY,
          },
        });

        const result = response.data.results[0];
        const location = result.geometry.location;
        const formattedAddress = result.formatted_address;
        const placeId = result.place_id;

        return {
          coordinates: { lat: location.lat, lng: location.lng },
          addressInfo: {
            formattedAddress,
            placeId,
          },
        };
      } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw new Error('Failed to fetch coordinates');
      }
    },
    getDistanceTime: async (_, { origin, destination }) => {
      try {
        // Fetch distance and time from Google Maps Distance Matrix API
        const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
          params: {
            origins: origin,
            destinations: destination,
            key: API_KEY,
          },
        });

        const element = response.data.rows[0].elements[0];
        const originAddress = response.data.origin_addresses[0];
        const destinationAddress = response.data.destination_addresses[0];

        return {
          distance: element.distance.text,
          duration: element.duration.text,
          originAddress,
          destinationAddress,
        };
      } catch (error) {
        console.error('Error fetching distance and time:', error);
        throw new Error('Failed to fetch distance and time');
      }
    },
  },
};

export default resolvers;
