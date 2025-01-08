import { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { initializeApp } from 'firebase/app';

export const CaptainDataContext = createContext();

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

const CaptainContext = ({ children }) => {
    const [ captain, setCaptain ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const updateCaptain = (captainData) => {
        setCaptain(captainData);
    };

    const value = {
        captain,
        setCaptain,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCaptain
    };

    return (
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainContext;
