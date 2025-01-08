import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.withCredentials = true;

const FinishRide = (props) => {
    const navigate = useNavigate()

    const handleFinishRide = () => {
        console.log('Finishing ride:', props.ride._id);
        props.finishRide();
    };

    async function endRide() {
        const response = await axios.post(`/rides/end-ride`, {

            rideId: props.ride._id


        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if (response.status === 200) {
            navigate('/captain-home')
        }

    }

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setShowFinishRide(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Finish Ride</h3>
            <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 rounded-full object-cover w-12' src={props.ride?.user?.profilePicture} alt="" />
                    <h2 className='text-lg font-medium'>{props.ride?.user?.fullname ? `${props.ride.user.fullname.firstname} ${props.ride.user.fullname.lastname}` : 'Jeevan Naidu'}</h2>
                </div>
                <h5 className='text-lg font-semibold'>2.2 KM</h5>
            </div>
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{props.ride?.pickup ? props.ride.pickup : 'Kharghar'}</h3>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{props.ride?.destination ? props.ride.destination : 'Vidyavihar'}</h3>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.ride?.fare ? props.ride.fare : 129} </h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                        </div>
                    </div>
                </div>
                <div className='mt-5 w-full '>
                    <button onClick={handleFinishRide} className=' bg-green-600 w-full text-white font-semibold p-2 px-10 rounded-lg'>Finish Ride</button>
                </div>
            </div>
        </div>
    )
}

export default FinishRide;