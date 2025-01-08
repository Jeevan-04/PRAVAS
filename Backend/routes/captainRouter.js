import express from 'express';
const router = express.Router();
import { body } from 'express-validator';
import authMiddleware from '../middlewares/authMiddleware.js';
import captainController from '../controllers/captainController.js';
import { firebaseAuth, googleSignIn } from '../controllers/firebaseController.js';
import Captain from '../models/captainModel.js'; // Ensure this is the correct model

const { registerCaptain, loginCaptain, getCaptainProfile, logoutCaptain, validateToken } = captainController;

router.post('/register', firebaseAuth, [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('fullname.lastname').isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid vehicle type'),
    body('location.coordinates').isArray({ min: 2 }).withMessage('Location coordinates must be an array with at least 2 elements')
], registerCaptain);

router.post('/login', firebaseAuth, [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], loginCaptain);

router.post('/google-signin', googleSignIn, loginCaptain);

router.get('/profile', authMiddleware.authCaptain, getCaptainProfile);

router.get('/logout', authMiddleware.authCaptain, logoutCaptain);

router.get('/validate-token', authMiddleware.authCaptain, validateToken);

export default router;