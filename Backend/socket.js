import { Server as SocketIo } from 'socket.io';
import userModel from './models/userModel.js';
import captainModel from './models/captainModel.js';

let io;
const users = {};

export const initializeSocket = (server) => {
    io = SocketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;
            const user = await userModel.findById(userId);
            if (user) {
                users[socket.id] = { userType, userId, name: `${user.fullname.firstname} ${user.fullname.lastname}` };
                console.log(`User joined: ${userId} as ${userType}`);
            }

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.coordinates || location.coordinates.length !== 2) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    type: 'Point',
                    coordinates: location.coordinates
                }
            });
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
            delete users[socket.id];
        });

        // Emit the list of users to captains
        socket.on('request-users', () => {
            const userList = Object.values(users).filter(user => user.userType === 'user');
            io.to(socket.id).emit('users-list', userList);
        });
    });
}

export const sendMessageToSocketId = (SocketIo, messageObject) => {

console.log(messageObject);

    if (io) {
        io.to(SocketIo).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}

export { io, users };
