import React, { useRef, useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import FinishRide from '../components/FinishRide';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';
import LiveTracking from '../components/LiveTracking';

axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.withCredentials = true;

const CaptainHome = () => {
    const navigate = useNavigate();
    const [ridePopupPanel, setRidePopupPanel] = useState(true);
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
    const [showFinishRide, setShowFinishRide] = useState(false);

    const ridePopupPanelRef = useRef(null);
    const confirmRidePopupPanelRef = useRef(null);
    const finishRidePanelRef = useRef(null);
    const [ride, setRide] = useState(null);
    const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
    const [pickup, setPickup] = useState({ lat: null, lng: null });
    const [destination, setDestination] = useState({ lat: null, lng: null });

    const { socket } = useContext(SocketContext);
    const { captain, setCaptain } = useContext(CaptainDataContext);

    useEffect(() => {
        const fetchCaptainProfile = async () => {
            try {
                const token = localStorage.getItem('captain-token');
                if (!token) {
                    throw new Error('No token found');
                }
                console.log('Token:', token);
                console.log('Base URL:', axios.defaults.baseURL);
                const response = await axios.get('/captains/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Fetched captain profile:', response.data);
                setCaptain(response.data.captain);
            } catch (error) {
                console.error('Error fetching captain profile:', error);
                localStorage.removeItem('captain-token'); // Clear token if there's an error
                navigate('/captain-login'); // Redirect to login if there's an error
            }
        };

        fetchCaptainProfile();
    }, [navigate, setCaptain]);

    useEffect(() => {
        console.log('Captain object:', captain);
        if (captain && captain._id) {
            console.log('Joining socket room as captain:', captain._id);
            socket.emit('join', {
                userId: captain._id,
                userType: 'captain',
                name: captain.fullname.firstname
            });

            // Request the list of users after joining the room
            socket.emit('request-users');

            socket.on('users-list', (users) => {
                console.log('Users in the socket:', users);
                users.forEach(user => {
                    console.log(`User: ${user.userId}, Name: ${user.name}`);
                });
            });

            const updateLocation = () => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(position => {
                        const { latitude, longitude } = position.coords;
                        console.log(`Captain's coordinate is: Lat: ${latitude} Long: ${longitude}`);
                        setCoordinates({ latitude, longitude });
                        socket.emit('update-location-captain', {
                            userId: captain._id,
                            location: {
                                ltd: latitude,
                                lng: longitude
                            }
                        });
                    });
                }
            };

            const locationInterval = setInterval(updateLocation, 10000);
            updateLocation();

            return () => clearInterval(locationInterval);
        }
    }, [captain, socket]);

    useEffect(() => {
        socket.on('new-ride', (data) => {
            console.log('New ride received:', data);
            setRide(data);
            setRidePopupPanel(true);
        });

        socket.on('ride-confirmed', (data) => {
            console.log('Ride confirmed:', data);
            setConfirmRidePopupPanel(false);
            setShowFinishRide(true);
            setPickup({ lat: 19.047321, lng: 73.069908 });
            setDestination({ lat: 19.0798, lng: 72.8973 });
        });

        return () => {
            socket.off('new-ride');
            socket.off('ride-confirmed');
            socket.off('users-list');
        };
    }, [socket]);

    async function confirmRide(otp) {
        console.log('Confirming ride:', ride._id);
        const response = await axios.post(`/rides/confirm`, {
            rideId: ride._id,
            captainId: captain._id,
            otp: otp
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('captain-token')}`
            }
        });

        console.log('Ride confirmed:', response.data);
        setRidePopupPanel(false);
        setConfirmRidePopupPanel(true);

        // Emit ride-confirmed event to user
        socket.emit('ride-confirmed', response.data);
    }

    async function finishRide() {
        console.log('Finishing ride:', ride._id);
        const response = await axios.post(`/rides/end`, {
            rideId: ride._id,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('captain-token')}`
            }
        });

        console.log('Ride finished:', response.data);
        setShowFinishRide(false);
        navigate('/captain-home');
    }

    useGSAP(() => {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, { transform: 'translateY(0)' });
        } else {
            gsap.to(ridePopupPanelRef.current, { transform: 'translateY(100%)' });
        }
    }, [ridePopupPanel]);

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            });
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            });
        }
    }, [confirmRidePopupPanel]);

    useGSAP(function () {
        if (showFinishRide) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)'
            });
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)'
            });
        }
    }, [showFinishRide]);

    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src="https://github.com/Jeevan-04/PRAVAS/blob/main/mylogo.png?raw=true" alt="" />
                <Link to='http://localhost:5173' className=' h-10 w-10 bg-[#E1C16E] flex items-center justify-center rounded-full'>
                    <i className="text-lg text-yellow-900 font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-3/5'>
                {coordinates.latitude !== null && coordinates.longitude !== null ? (
                    <LiveTracking captains={[]} pickup={pickup} destination={destination} /> // Use LiveTracking component
                ) : (
                    <div>Loading map...</div>
                )}
            </div>
            <div className='h-2/5 p-6 bg-[#E1C16E] rounded-t-3xl'>
                {captain ? <CaptainDetails /> : <div>Loading...</div>}
            </div>
            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-[#E1C16E] px-3 py-10 pt-12 rounded-t-3xl'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                    setPickup={setPickup}
                    setDestination={setDestination}
                />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
            </div>
            <div ref={finishRidePanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <FinishRide
                    ride={ride}
                    setShowFinishRide={setShowFinishRide}
                    finishRide={finishRide}
                />
            </div>
        </div>
    );
};

export default CaptainHome;