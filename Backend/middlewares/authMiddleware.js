import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import BlacklistTokenModel from '../models/blacklistTokenModel.js';
import captainModel from '../models/captainModel.js';
import { SECRET_KEY } from '../constant.js';

async function authUser(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // const isBlacklisted = await BlacklistTokenModel.findOne({ token: token });

    // if (isBlacklisted) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await userModel.findById(decoded._id);

        req.user = user;

        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

async function authCaptain(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // const isBlacklisted = await BlacklistTokenModel.findOne({ token: token });

    // if (isBlacklisted) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const captain = await captainModel.findById(decoded._id);
        req.captain = captain;

        return next();
    } catch (err) {
        console.log(err);

        res.status(401).json({ message: 'Unauthorized' });
    }
}

export default { authUser, authCaptain };