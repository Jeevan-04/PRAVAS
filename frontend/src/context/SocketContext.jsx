import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { initializeApp } from 'firebase/app';

export const SocketContext = createContext();

axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.withCredentials = true;

const firebaseConfig = {
  apiKey: "AIzaSyBvXluY3Zc5OJTFQ_dgnj6_1xuKnLcvWQY",
  authDomain: "pravas-49bde.firebaseapp.com",
  projectId: "pravas-49bde",
  storageBucket: "pravas-49bde.appspot.com",
  messagingSenderId: "10799918834",
  appId: "1:10799918834:web:39a6f2359f69fe12d0aa6b",
  measurementId: "G-R1V2BBDC2H"
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