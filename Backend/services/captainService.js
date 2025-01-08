import captainModel from '../models/captainModel.js';

const createCaptain = async (captainData) => {
    console.log('Creating captain in MongoDB with data:', captainData);
    const captain = new captainModel(captainData);
    await captain.save();
    console.log('Captain created in MongoDB with id:', captain._id);
    return captain;
};

export default { createCaptain };