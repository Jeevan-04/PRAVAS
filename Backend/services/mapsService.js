import axios from 'axios';
import captainModel from '../models/captainModel.js';

async function getAddressCoordinate (address) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyAG7C10W1bxaoggGhW2VJYRWeJ7gSbpIcQ`;

    try {
        const response = await axios.get(url);
        console.log('Geocode response:', response.data);
        if (response.data.status === 'OK') {
            const location = response.data.results[ 0 ].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
    }
}

async function getDistanceTime(pickup, destination) {
    try {
        console.log('Requesting distance and time from Google Maps API for:', { pickup, destination });
        const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: {
                origins: `${pickup.lat},${pickup.lng}`,
                destinations: `${destination.lat},${destination.lng}`,
                key: 'AIzaSyAG7C10W1bxaoggGhW2VJYRWeJ7gSbpIcQ'
            }
        });

        console.log('Google Maps API response:', response.data);

        if (response.data.status !== 'OK') {
            throw new Error('Error fetching distance and time from Google Maps API');
        }

        const element = response.data.rows[0].elements[0];
        if (element.status !== 'OK') {
            throw new Error('Error fetching distance and time from Google Maps API');
        }

        return {
            distance: element.distance,
            duration: element.duration
        };
    } catch (error) {
        console.error('Error in getDistanceTime:', error);
        throw error;
    }
}

async function getAutoCompleteSuggestions (input) {
    if (!input) {
        throw new Error('query is required');
    }
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=AIzaSyAG7C10W1bxaoggGhW2VJYRWeJ7gSbpIcQ`;

    try {
        const response = await axios.get(url);
        console.log('Autocomplete response:', response.data);
        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error('Error fetching suggestions:', err);
        throw err;
    }
}

async function getCaptainsInTheRadius (ltd, lng, radius) {

    // radius in km

    try {
        const captains = await captainModel.find({
            location: {
                $geoWithin: {
                    $centerSphere: [ [ ltd, lng ], radius / 6371 ]
                }
            }
        });
        console.log('Captains in the radius:', captains);
        return captains;
    } catch (error) {
        console.error('Error fetching captains:', error);
        throw error;
    }

}

export default { getAddressCoordinate , getDistanceTime , getAutoCompleteSuggestions , getCaptainsInTheRadius }