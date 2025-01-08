import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

axios.defaults.baseURL = 'http://localhost:8000/api';

const firebaseConfig = {
  apiKey: "AIzaSyBvXluY3Zc5OJTFQ_dgnj6_1xuKnLcvWQY",
  authDomain: "pravas-49bde.firebaseapp.com",
  projectId: "pravas-49bde",
  storageBucket: "pravas-49bde.appspot.com",
  messagingSenderId: "10799918834",
  appId: "1:10799918834:web:39a6f2359f69fe12d0aa6b",
  measurementId: "G-R1V2BBDC2H"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    color: '',
    plate: '',
    capacity: '',
    vehicleType: '',
    location: {
      type: 'Point',
      coordinates: [0, 0]
    }
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData) => ({
            ...prevData,
            location: {
              type: 'Point',
              coordinates: [position.coords.longitude, position.coords.latitude]
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          // Provide default coordinates if user denies geolocation
          setFormData((prevData) => ({
            ...prevData,
            location: {
              type: 'Point',
              coordinates: [0, 0] // Default coordinates
            }
          }));
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const { setCaptain } = useContext(CaptainDataContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log('Signup form submitted');
    try {
        console.log('Attempting to create user with email and password');
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        console.log('Firebase user created:', user.uid);
        const idToken = await user.getIdToken(true);
        console.log('Firebase ID token retrieved:', idToken);

        const captainData = {
            fullname: {
                firstname: formData.firstname,
                lastname: formData.lastname
            },
            email: formData.email,
            password: formData.password,
            vehicle: {
                color: formData.color,
                plate: formData.plate,
                capacity: Number(formData.capacity), // Ensure capacity is a number
                vehicleType: formData.vehicleType
            },
            location: {
                type: 'Point',
                coordinates: formData.location.coordinates
            },
            firebaseUid: user.uid
        };

        console.log('Sending captain data to server:', captainData);

        const response = await axios.post('/captains/register', captainData, {
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });

        console.log('Server response:', response);

        if (response.status === 201) {
            const data = response.data;
            console.log('Captain registered in MongoDB:', data.captain._id);
            setCaptain(data.captain);
            localStorage.setItem('captain-token', data.token); // Store the token from the server response
            navigate('/captain-home'); // Ensure this line is present
        }

        setFormData({
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            color: '',
            plate: '',
            capacity: '',
            vehicleType: '',
            location: {
                type: 'Point',
                coordinates: [0, 0]
            }
        });
    } catch (error) {
        if (error.response) {
            console.error("Error during signup:", error.response.data.message);
            console.error("Error response data:", error.response.data);
            if (error.response.data.message && error.response.data.message.includes("email address is already in use")) {
                alert("Signup failed: The email address is already in use by another account.");
            } else {
                alert("Signup failed: " + error.response.data.message);
            }
        } else {
            console.error("Error during signup:", error.message);
            alert("Signup failed: " + error.message);
        }
    }
  };

  return (
    <div className='py-5 px-5 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-20 mb-3' src="https://github.com/Jeevan-04/PRAVAS/blob/main/mylogo.png?raw=true" alt="" />

        <form onSubmit={submitHandler}>
          <h3 className='text-lg w-full font-medium mb-2'>What's our Captain's name</h3>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='First name'
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
            />
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Last name'
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
            />
          </div>

          <h3 className='text-lg font-medium mb-2'>What's our Captain's email</h3>
          <input
            required
            value={formData.email}
            onChange={handleChange}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            name="email"
            placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
          <input
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            value={formData.password}
            onChange={handleChange}
            required type="password"
            name="password"
            placeholder='password'
          />

          <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Vehicle Color'
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Vehicle Plate'
              name="plate"
              value={formData.plate}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="number"
              placeholder='Vehicle Capacity'
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
            />
            <select
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
            >
              <option value="" disabled>Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="moto">Moto</option>
            </select>
          </div>

          <button
            className='bg-yellow-600 text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
          >Create Captain Account</button>
        </form>
        <p className='text-center'>Already have a account? <Link to='/captain-login' className='text-blue-600'>Login here</Link></p>
      </div>
      <div>
        <p className='text-[10px] mt-6 leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
          Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
      </div>
    </div>
  );
};

export default CaptainSignup;