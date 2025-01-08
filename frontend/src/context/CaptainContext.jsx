import { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { initializeApp } from 'firebase/app';

export const CaptainDataContext = createContext();

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