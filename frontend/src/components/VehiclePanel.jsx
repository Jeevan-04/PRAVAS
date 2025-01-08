import React from 'react';

const VehiclePanel = ({ selectVehicle, fare, setConfirmRidePanel, setVehiclePanel, nearbyCaptains }) => {
    const handleVehicleSelect = (vehicleType) => {
        selectVehicle(vehicleType);
        setVehiclePanel(false);
        setConfirmRidePanel(true);
    };

    return (
        <div>
            <h3 className='text-2xl text-yellow-700 font-semibold mb-5'>Select your Vehicle</h3>
            <div className='flex flex-col gap-4'>
                <div className='flex items-center justify-between p-3 border-b-2' onClick={() => handleVehicleSelect('car')}>
                    <div className='flex items-center gap-3'>
                        <i className="ri-car-line text-yellow-600 text-4xl"></i>
                        <div>
                            <h3 className='text-lg text-yellow-800 font-medium'>Car</h3>
                            <p className='text-sm -mt-1 text-green-600'>₹{fare.car ? fare.car.toFixed(2) : 'N/A'}</p>
                        </div>
                    </div>
                    <i className="ri-arrow-right-s-line text-yellow-600 text-4xl"></i>
                </div>
                <div className='flex items-center justify-between p-3 border-b-2' onClick={() => handleVehicleSelect('motorcycle')}>
                    <div className='flex items-center gap-3'>
                        <i className="ri-motorbike-line text-yellow-600 text-4xl"></i>
                        <div>
                            <h3 className='text-lg text-yellow-800 font-medium'>Motorcycle</h3>
                            <p className='text-sm -mt-1 text-green-600'>₹{fare.moto ? fare.moto.toFixed(2) : 'N/A'}</p>
                        </div>
                    </div>
                    <i className="ri-arrow-right-s-line text-yellow-600 text-4xl"></i>
                </div>
                <div className='flex items-center justify-between p-3 border-b-2' onClick={() => handleVehicleSelect('auto')}>
                    <div className='flex items-center gap-3'>
                        <i className="ri-taxi-line text-yellow-600 text-4xl"></i>
                        <div>
                            <h3 className='text-lg text-yellow-800 font-medium'>Auto</h3>
                            <p className='text-sm -mt-1 text-green-600'>₹{fare.auto ? fare.auto.toFixed(2) : 'N/A'}</p>
                        </div>
                    </div>
                    <i className="ri-arrow-right-s-line text-yellow-600 text-4xl"></i>
                </div>
            </div>
        </div>
    );
};

export default VehiclePanel;