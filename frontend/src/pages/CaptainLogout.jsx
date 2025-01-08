import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';

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

export const CaptainLogout = () => {
  const token = localStorage.getItem('captain-token');
  const navigate = useNavigate();

  axios.get(`/captains/logout`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((response) => {
    if (response.status === 200) {
      localStorage.removeItem('captain-token');
      navigate('/captain-login');
    }
  }).catch(error => {
    console.error('Error during logout:', error);
  });

  return (
    <div>CaptainLogout</div>
  );
};

export default CaptainLogout;
