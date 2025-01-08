import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { initializeApp } from 'firebase/app';

export const SocketContext = createContext();

axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.withCredentials = true;

const firebaseConfig = {
  apiKey: "PASTE YOUR HERE",
  authDomain: "PASTE YOUR HERE",
  projectId: "PASTE YOUR HERE",
  storageBucket: "PASTE YOUR HERE",
  messagingSenderId: "PASTE YOUR HERE",
  appId: "PASTE YOUR HERE",
  measurementId: "PASTE YOUR HERE"
};

initializeApp(firebaseConfig);

const socket = io('http://localhost:8000', {
  withCredentials: true,
});

const SocketProvider = ({ children }) => {
  useEffect(() => {
    // Basic connection logic
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
