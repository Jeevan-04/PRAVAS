import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db/dbConnection.js';
import userRouter from './routes/userRouter.js';
import captainRouter from './routes/captainRouter.js';
import mapsRouter from './routes/mapsRouter.js';
import rideRouter from './routes/rideRouter.js';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';

const app = express();

// Connect to the database
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/users', userRouter);
app.use('/api/captains', captainRouter);
app.use('/maps', mapsRouter);
app.use('/api/rides', rideRouter);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // Handle other socket events here
});

// Create the Apollo Server
const apolloServer = new ApolloServer({ typeDefs, resolvers });

async function startApolloServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  const PORT = 8000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`🚀 GraphQL server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
  });
}

startApolloServer();

app.get('/health',(req,res)=>{
    res.send({message:"Server Running good !!!"})
});

export default app;