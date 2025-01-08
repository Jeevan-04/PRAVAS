import mapService from '../services/mapsService.js'
import { validationResult } from 'express-validator';


async function getCoordinates (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'No valid token found, redirecting to login' });
    }

    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        if (error.code === 1) {
            res.status(403).json({ message: 'User denied Geolocation' });
        } else {
            res.status(404).json({ message: 'Coordinates not found' });
        }
    }
}

async function getDistanceTime (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'No valid token found, redirecting to login' });
    }

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;

        const distanceTime = await mapService.getDistanceTime(origin, destination);

        res.status(200).json(distanceTime);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function getAutoCompleteSuggestions (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'No valid token found, redirecting to login' });
    }

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { input } = req.query;

        const suggestions = await mapService.getAutoCompleteSuggestions(input);

        res.status(200).json(suggestions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default { getCoordinates, getDistanceTime , getAutoCompleteSuggestions}