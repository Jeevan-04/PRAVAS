import React, { useEffect, useRef, useState, useContext } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';

axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.withCredentials = true;

const Home = () => {
    const [pickup, setPickup] = useState({ address: '', lat: null, lng: null });
    const [destination, setDestination] = useState({ address: '', lat: null, lng: null });
    const [panelOpen, setPanelOpen] = useState(false);
    const vehiclePanelRef = useRef(null);
    const confirmRidePanelRef = useRef(null);
    const vehicleFoundRef = useRef(null);
    const waitingForDriverRef = useRef(null);
    const panelRef = useRef(null);
    const panelCloseRef = useRef(null);
    const [vehiclePanel, setVehiclePanel] = useState(false);
    const [confirmRidePanel, setConfirmRidePanel] = useState(false);
    const [vehicleFound, setVehicleFound] = useState(false);
    const [waitingForDriver, setWaitingForDriver] = useState(false);
    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const [activeField, setActiveField] = useState(null);
    const [fare, setFare] = useState({});
    const [vehicleType, setVehicleType] = useState(null);
    const [ride, setRide] = useState(null);
    const [captains, setCaptains] = useState([]);
    const [showCaptainPopup, setShowCaptainPopup] = useState(false);
    const [newRide, setNewRide] = useState(null);

    const navigate = useNavigate();

    const { socket } = useContext(SocketContext);
    const { user } = useContext(UserDataContext);

    useEffect(() => {
        console.log('Joining socket room as user:', user._id);
        socket.emit('join', { userType: 'user', userId: user._id, name: user.fullname.firstname });
    }, [user]);

    useEffect(() => {
        socket.on('ride-confirmed', (ride) => {
            console.log('Ride confirmed:', ride);
            setVehicleFound(false);
            setWaitingForDriver(true);
            setRide(ride);
        });

        socket.on('ride-started', (ride) => {
            console.log('Ride started:', ride);
            setWaitingForDriver(false);
            navigate('/riding', { state: { ride } }); // Updated navigate to include ride data
        });

        socket.on('update-location-captain', (captain) => {
            console.log('Captain location updated:', captain);
            setCaptains((prevCaptains) => {
                const updatedCaptains = prevCaptains.filter(c => c.id !== captain.id);
                updatedCaptains.push(captain);
                return updatedCaptains;
            });
            console.log('Updated captains:', captains);
        });

        socket.on('new-ride', (ride) => {
            // Handle the new ride event for captains
            console.log('New ride request:', ride);
            setNewRide(ride);
            setShowCaptainPopup(true);
        });
        socket.emit('new-ride', ride); 


        return () => {
            socket.off('ride-confirmed');
            socket.off('ride-started');
            socket.off('update-location-captain');
            socket.off('new-ride');
        };
    }, [socket, navigate]);

    const handlePickupChange = async (e) => {
        const address = e.target.value;
        setPickup((prev) => ({ ...prev, address }));
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    address,
                    key: 'AIzaSyAG7C10W1bxaoggGhW2VJYRWeJ7gSbpIcQ',
                    components: 'locality:Mumbai'
                },
                withCredentials: false,
            });
            setPickupSuggestions(response.data.results);
            if (response.data.results.length > 0) {
                const location = response.data.results[0].geometry.location;
                setPickup((prev) => ({ ...prev, lat: location.lat, lng: location.lng }));
                console.log(`Pickup location set to: Lat: ${location.lat}, Lng: ${location.lng}`);
            }
        } catch (error) {
            console.error('Error fetching pickup location:', error);
        }
    };

    const handleDestinationChange = async (e) => {
        const address = e.target.value;
        setDestination((prev) => ({ ...prev, address }));
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    address,
                    key: 'AIzaSyAG7C10W1bxaoggGhW2VJYRWeJ7gSbpIcQ',
                    components: 'locality:Mumbai'
                },
                withCredentials: false,
            });
            setDestinationSuggestions(response.data.results);
            if (response.data.results.length > 0) {
                const location = response.data.results[0].geometry.location;
                setDestination((prev) => ({ ...prev, lat: location.lat, lng: location.lng }));
                console.log(`Destination location set to: Lat: ${location.lat}, Lng: ${location.lng}`);
            }
        } catch (error) {
            console.error('Error fetching destination location:', error);
        }
    };

    const handlePickupSelect = (suggestion) => {
        const location = suggestion.geometry.location;
        setPickup({ address: suggestion.formatted_address, lat: location.lat, lng: location.lng });
    };

    const handleDestinationSelect = (suggestion) => {
        const location = suggestion.geometry.location;
        setDestination({ address: suggestion.formatted_address, lat: location.lat, lng: location.lng });
    };

    const submitHandler = (e) => {
        e.preventDefault();
    };

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24,
                // opacity:1
            });
            gsap.to(panelCloseRef.current, {
                opacity: 1,
            });
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0,
                // opacity:0
            });
            gsap.to(panelCloseRef.current, {
                opacity: 0,
            });
        }
    }, [panelOpen]);

    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)',
            });
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)',
            });
        }
    }, [vehiclePanel]);

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)',
            });
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)',
            });
        }
    }, [confirmRidePanel]);

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)',
            });
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)',
            });
        }
    }, [vehicleFound]);

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)',
            });
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)',
            });
        }
    }, [waitingForDriver]);

    async function findTrip() {
        setVehiclePanel(true);
        setPanelOpen(false);

        try {
            const response = await axios.get('/rides/get-fare', {
                params: {
                    pickupLat: pickup.lat,
                    pickupLng: pickup.lng,
                    destinationLat: destination.lat,
                    destinationLng: destination.lng
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            console.log('Fare response:', response.data);
            setFare(response.data.fare);

            const captainsResponse = await axios.get('/rides/nearby-captains', {
                params: {
                    lat: pickup.lat,
                    lng: pickup.lng
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            // Filter captains to include only those with isLoggedIn: true
            const loggedInCaptains = captainsResponse.data.filter(captain => captain.isLoggedIn);
            setCaptains(loggedInCaptains);
            console.log('Logged in captains:', loggedInCaptains);
        } catch (error) {
            if (error.code === 'ERR_NETWORK') {
                console.error('Network error:', error.message);
                alert('Network error: Please check your internet connection.');
            } else if (error.response && error.response.status === 401) {
                console.error('Unauthorized:', error.response.data.message);
                alert('Unauthorized: ' + error.response.data.message);
            } else if (error.response && error.response.status === 500) {
                console.error('Internal server error:', error.response.data.message);
                alert('Internal server error: ' + error.response.data.message);
            } else {
                console.error('Error fetching fare or captains:', error);
                alert('Error fetching fare or captains: ' + error.message);
            }
        }
    }

    async function createRide() {
        try {
            const rideData = {
                pickup: {
                    address: pickup.address,
                    lat: pickup.lat,
                    lng: pickup.lng
                },
                destination: {
                    address: destination.address,
                    lat: destination.lat,
                    lng: destination.lng
                },
                vehicleType,
            };

            console.log('Emitting new-ride event with data:', rideData);

            // Emit a temporary ride request to captains
            socket.emit('new-ride', rideData);

            // Show the waiting for driver panel
            setWaitingForDriver(true);

            // Wait for a captain to confirm the ride
            socket.on('ride-confirmed', (ride) => {
                console.log('Ride confirmed by captain:', ride);
                setWaitingForDriver(false);
                setRide(ride);
                navigate('/riding', { state: { ride } });
            });
        } catch (error) {
            console.error('Error creating ride:', error);
            alert('Error creating ride: ' + error.message);
        }
    }

    return (
        <div className='h-screen relative overflow-hidden'>
            <img className='w-16 absolute left-5 top-5' src="https://github.com/Jeevan-04/PRAVAS/blob/main/mylogo.png?raw=true" alt="" />
            <div className='h-screen w-screen'>
                <LiveTracking captains={captains} pickup={pickup} destination={destination} />
            </div>
            <div className=' flex flex-col justify-end h-screen absolute top-0 w-full'>
                <div className='h-[30%] p-6 bg-white relative'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false);
                    }} className='absolute opacity-0 right-6 top-6 text-2xl'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={(e) => {
                        submitHandler(e);
                    }}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-yellow-600 rounded-full"></div>
                        <input
                            onClick={() => {
                                setPanelOpen(true);
                                setActiveField('pickup');
                            }}
                            value={pickup.address || ''}
                            onChange={handlePickupChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => {
                                setPanelOpen(true);
                                setActiveField('destination');
                            }}
                            value={destination.address || ''}
                            onChange={handleDestinationChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                    <button
                        onClick={findTrip}
                        className='bg-yellow-600 text-white px-4 py-2 rounded-lg mt-3 w-full'>
                        Find Trip
                    </button>
                </div>
                <div ref={panelRef} className='bg-white h-0'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                        onSelect={activeField === 'pickup' ? handlePickupSelect : handleDestinationSelect}
                    />
                </div>
            </div>
            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} nearbyCaptains={captains} />
            </div>
            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup.address}
                    destination={destination.address}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel} 
                    setVehicleFound={setVehicleFound} 
                    socket={socket} // Pass the socket object as a prop
                />
            </div>
            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup.address}
                    destination={destination.address}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound} />
            </div>
            <div ref={waitingForDriverRef} className='fixed w-full  z-10 bottom-0  bg-white px-3 py-6 pt-12'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver} />
            </div>
            {showCaptainPopup && (
                <div className='fixed w-full z-20 bottom-0 bg-white px-3 py-6 pt-12'>
                    <ConfirmRidePopUp
                        ride={newRide}
                        setShowCaptainPopup={setShowCaptainPopup}
                    />
                </div>
            )}
        </div>
    );
};

export default Home;