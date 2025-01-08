import express from 'express';
const router = express.Router();
import { body, query } from 'express-validator';
import authMiddleware from '../middlewares/authMiddleware.js';
import rideController from '../controllers/rideController.js';

const { authUser } = authMiddleware;
const { authCaptain } = authMiddleware;
const { createRide, getFare, confirmRide, startRide, endRide, getNearbyCaptains } = rideController;

router.post('/create',
    authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn(['auto', 'car', 'moto']).withMessage('Invalid vehicle type'),
    createRide
);

router.get('/get-fare',
    query('pickupLat').isFloat({ min: -90, max: 90 }),
    query('pickupLng').isFloat({ min: -180, max: 180 }),
    query('destinationLat').isFloat({ min: -90, max: 90 }),
    query('destinationLng').isFloat({ min: -180, max: 180 }),
    authUser,
    getFare
);

router.post('/confirm',
    authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    confirmRide
);

router.get('/start-ride',
    authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    startRide
);

router.post('/end-ride',
    authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    endRide
);

router.get('/nearby-captains',
    query('lat').isFloat({ min: -90, max: 90 }),
    query('lng').isFloat({ min: -180, max: 180 }),
    authUser,
    getNearbyCaptains
);

export default router;