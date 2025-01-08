import userModel from '../models/userModel.js';
import userService from '../services/userService.js';
import { validationResult } from 'express-validator';
import BlacklistTokenModel from '../models/blacklistTokenModel.js';
import { auth } from '../firebase.js';

async function registerUser(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            displayName: `${fullname.firstname} ${fullname.lastname}`
        });

        const isUserAlready = await userModel.findOne({ email });

        if (isUserAlready) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const firebaseUid = userRecord.uid;

        if (!firebaseUid) {
            return res.status(400).json({ message: 'Firebase UID is required' });
        }

        const existingUser = await userModel.findOne({ firebaseUid });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this Firebase UID already exists' });
        }

        const hashedPassword = await userModel.hashPassword(password);

        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword,
            firebaseUid: userRecord.uid
        });

        const token = user.generateAuthToken();

        res.status(201).json({ token, user });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

async function loginUser(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            console.error('User not found:', email); // Log the error
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            console.error('Password mismatch for user:', email); // Log the error
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();

        res.cookie('token', token);

        res.status(200).json({ token, user });
    } catch (error) {
        console.error('Error during login:', error); // Log the error
        return res.status(500).json({ message: 'Server error' });
    }
}

async function getUserProfile(req, res, next) {
    res.status(200).json(req.user);
}

async function logoutUser(req, res, next) {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    await BlacklistTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out' });
}

export default { registerUser, loginUser, getUserProfile, logoutUser };