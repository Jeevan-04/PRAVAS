import React, { useContext, useEffect, useState } from 'react';
import { CaptainDataContext } from '../context/CaptainContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.withCredentials = true;

const CaptainProtectWrapper = ({ children }) => {
    const token = localStorage.getItem('captain-token');
    const navigate = useNavigate();
    const { captain, setCaptain } = useContext(CaptainDataContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/captain-login');
            return;
        }

        axios.get('/captains/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setCaptain(response.data.captain);
                setIsLoading(false);
            }
        }).catch(err => {
            console.error("Error during profile fetch:", err.response ? err.response.data : err.message);
            localStorage.removeItem('captain-token');
            navigate('/captain-login');
        });
    }, [token, navigate, setCaptain]);

    if (isLoading) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <>
            {children}
        </>
    );
};

export default CaptainProtectWrapper;