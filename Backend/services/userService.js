import userModel from '../models/userModel.js';

async function createUser({ firstname, lastname, email, password, firebaseUid }) {
    if (!firstname || !email || !password || !firebaseUid) {
        throw new Error('All fields are required');
    }
    const user = new userModel({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        firebaseUid
    });
    await user.save();
    return user;
}

export default { createUser };