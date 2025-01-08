import captainModel from '../models/captainModel.js';
import captainService from '../services/captainService.js';
import BlacklistTokenModel from '../models/blacklistTokenModel.js';
import { validationResult } from 'express-validator';
import { auth } from '../firebase.js';

async function registerCaptain(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    try {
        console.log('Form submitted with data:', req.body);

        let userRecord;
        try {
            userRecord = await auth.createUser({
                email: email,
                password: password,
                displayName: `${fullname.firstname} ${fullname.lastname}`
            });
            console.log(`Firebase saved with id - ${userRecord.uid}`);
        } catch (firebaseError) {
            if (firebaseError.code === 'auth/email-already-exists') {
                console.error('Firebase error: The email address is already in use by another account.');
                // Fetch the existing user record from Firebase
                userRecord = await auth.getUserByEmail(email);
                console.log(`Firebase user already exists with id - ${userRecord.uid}`);
            } else {
                console.error('Firebase error:', firebaseError);
                return res.status(400).json({ message: firebaseError.message });
            }
        }

        const hashedPassword = await captainModel.hashPassword(password);

        const captainData = {
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            email,
            password: hashedPassword,
            vehicle: {
                color: vehicle.color,
                plate: vehicle.plate,
                capacity: vehicle.capacity,
                vehicleType: vehicle.vehicleType
            },
            firebaseUid: userRecord.uid,
            isLoggedIn: true // Set isLoggedIn to true upon registration
        };

        console.log('Saving captain to MongoDB with data:', captainData);

        const captain = await captainService.createCaptain(captainData);

        console.log(`MongoDB saved with id - ${captain._id}`);

        const token = captain.generateAuthToken();

        res.status(201).json({ token, captain });
    } catch (error) {
        console.error('Error during registration:', error);
        if (error.name === 'MongoNetworkError') {
            console.error('MongoDB connection error:', error);
        } else if (error.name === 'ValidationError') {
            console.error('Validation error:', error);
        } else if (error.code === 11000) {
            console.error('Duplicate key error:', error);
            return res.status(400).json({ message: 'Captain already exists in MongoDB' });
        } else {
            console.error('Unknown error:', error);
        }
        return res.status(400).json({ message: error.message, error });
    }
}

async function loginCaptain(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const userRecord = await auth.getUserByEmail(email);

        const captain = await captainModel.findOne({ email }).select('+password');

        if (!captain) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await captain.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = captain.generateAuthToken();

        res.cookie('token', token);

        res.status(200).json({ token, captain });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
}

async function getCaptainProfile(req, res, next) {
    res.status(200).json({ captain: req.captain });
}

async function logoutCaptain(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    await BlacklistTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}

async function validateToken(req, res, next) {
    res.status(200).json({ valid: true });
}

export default { registerCaptain, loginCaptain, getCaptainProfile, logoutCaptain, validateToken };