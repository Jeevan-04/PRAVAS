import React from 'react'

const LookingForDriver = (props) => {

    const fare = props.fare && props.vehicleType && props.fare[props.vehicleType] ? props.fare[props.vehicleType].toFixed(2) : '0.00';

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehicleFound(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl text-yellow-600 font-semibold mb-5'>Your Journey</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <img className='h-20' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill text-yellow-800"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{props.pickup}</h3>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill text-yellow-800"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{props.destination}</h3>

                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line text-yellow-800 text-2xl"></i>
                        <div>
                            <h3 className='text-lg font-medium text-green-600'>₹{fare} </h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LookingForDriver