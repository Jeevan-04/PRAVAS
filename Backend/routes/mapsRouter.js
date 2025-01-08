import express from 'express'
const router = express.Router();
import { query } from 'express-validator';
import authMiddleware from '../middlewares/authMiddleware.js';
import mapController from '../controllers/mapController.js';

const { authUser } = authMiddleware;
const { getCoordinates } = mapController;
const { getDistanceTime } = mapController;
const { getAutoCompleteSuggestions } = mapController;


router.get('/get-coordinates',
    query('address').isString().isLength({ min: 3 }),
    authUser,
    getCoordinates
);

router.get('/get-distance-time',
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),
    authUser,
    getDistanceTime
)

router.get('/get-suggestions',
    query('input').isString().isLength({ min: 3 }),
    authUser,
    getAutoCompleteSuggestions
)

export default router;