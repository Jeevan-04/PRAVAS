import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';

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