import rideService from '../services/rideService.js';
import { validationResult } from 'express-validator';
import { sendMessageToSocketId } from '../socket.js';
import rideModel from '../models/rideModel.js';
import captainModel from '../models/captainModel.js';
import userModel from '../models/userModel.js'; // Import the user model

async function createRide (req, res)  {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickup, destination, vehicleType } = req.body;
    console.log('Create ride request payload:', { userId, pickup, destination, vehicleType });

    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        console.log('Ride created:', ride);
        res.status(201).json(ride);

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');
        console.log('Ride with user:', rideWithUser);

        // Fetch the latest registered user
        const latestUser = await userModel.findOne().sort({ createdAt: -1 });
        console.log('Latest registered user:', latestUser);

        const captains = await captainModel.find({ isLoggedIn: true });
        console.log('Logged in captains:', captains);

        captains.forEach(captain => {
            console.log(`Sending ride request to captain: ${captain.fullname.firstname} ${captain.fullname.lastname}`);
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: {
                    ...rideWithUser.toObject(),
                    latestUser: latestUser ? {
                        name: latestUser.fullname ? `${latestUser.fullname.firstname} ${latestUser.fullname.lastname}` : 'Jeevan Naidu',
                        location: latestUser.location ? latestUser.location : 'Kharghar to Vidyavihar',
                        fare: 129
                    } : {
                        name: 'Jeevan Naidu',
                        location: 'Kharghar to Vidyavihar',
                        fare: 129
                    }
                }
            });
            console.log(`Ride request sent to captain: ${captain.fullname.firstname} ${captain.fullname.lastname}`);
        });

    } catch (err) {
        console.log('Error creating ride:', err);
        return res.status(500).json({ message: err.message });
    }
};

async function confirmRide (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

const getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickupLat, pickupLng, destinationLat, destinationLng } = req.query;

    if (!pickupLat || !pickupLng || !destinationLat || !destinationLng) {
        console.log('Missing coordinates:', { pickupLat, pickupLng, destinationLat, destinationLng });
        return res.status(400).json({ message: 'Pickup and destination coordinates are required' });
    }

    try {
        console.log('Calculating fare for:', { pickupLat, pickupLng, destinationLat, destinationLng });
        const pickup = { lat: parseFloat(pickupLat), lng: parseFloat(pickupLng) };
        const destination = { lat: parseFloat(destinationLat), lng: parseFloat(destinationLng) };
        console.log('Parsed pickup:', pickup);
        console.log('Parsed destination:', destination);

        const distance = getDistance(pickup, destination);
        console.log('Calculated distance:', distance);

        const fare = calculateFare(pickup, destination);
        console.log('Calculated fare:', fare);

        res.status(200).json({ fare });
    } catch (error) {
        console.error('Error calculating fare:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const calculateFare = (pickup, destination) => {
    const distance = getDistance(pickup, destination);
    const fare = {
        car: distance * 10, // Example fare calculation for car
        moto: distance * 5, // Example fare calculation for motorcycle
        auto: distance * 7  // Example fare calculation for auto
    };
    console.log(`Distance: ${distance}, Fare:`, fare);
    return fare;
};

const getDistance = (pickup, destination) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (destination.lat - pickup.lat) * Math.PI / 180;
    const dLng = (destination.lng - pickup.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(pickup.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
};

async function startRide (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function endRide (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } s
}

const getNearbyCaptains = async (req, res) => {
    const { lat, lng } = req.query;
    try {
        const captains = await captainModel.find({
            isLoggedIn: true,
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: 5000 // 5 km radius
                }
            }
        });

        // Log the names of the nearby captains
        captains.forEach(captain => {
            console.log(`Captain: ${captain.fullname.firstname} ${captain.fullname.lastname}`);
        });

        res.json(captains);
    } catch (error) {
        console.error('Error fetching nearby captains:', error);
        res.status(500).json({ message: 'Error fetching nearby captains', error: error.message });
    }
};

export default { createRide, getFare, confirmRide, startRide ,  endRide, getNearbyCaptains }