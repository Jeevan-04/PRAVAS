import React, { useState } from 'react';

const RidePopUp = (props) => {
    const [showQrCode, setShowQrCode] = useState(false);

    // Handle Accept Ride
    const handleAcceptRide = () => {
        // Show QR code when "Accept" button is clicked
        setShowQrCode(true);
        props.setPickup({ lat: 19.047321, lng: 73.069908 });
        props.setDestination({ lat: 19.0798, lng: 72.8973 });
    };

    // Extract ride details or use default values
    const userName = props.ride?.user?.fullname
        ? `${props.ride.user.fullname.firstname} ${props.ride.user.fullname.lastname}`
        : 'Jeevan Naidu';
    const pickupLocation = props.ride?.pickup || 'Kharghar';
    const destinationLocation = props.ride?.destination || 'Vidyavihar';
    const fare = props.ride?.fare || 129;
    const distance = props.ride?.distance || '28.7 km';

    return (
        <div className="popup-container">
            {/* Close Popup Button */}
            <h5
                className="p-1 text-center w-[93%] absolute top-0"
                onClick={() => props.setRidePopupPanel(false)}
            >
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>

            <h3 className="text-2xl font-semibold mb-5">Confirm Ride !!!</h3>

            {/* User and Distance Info */}
            <div className="flex items-center justify-between p-3 bg-yellow-600 rounded-lg mt-4">
                <div className="flex items-center gap-3">
                    <img
                        className="h-12 rounded-full object-cover w-12"
                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                        alt="Profile"
                    />
                    <h2 className="text-lg font-medium text-white">{userName}</h2>
                </div>
                <h5 className="text-lg text-yellow-800 font-semibold">{distance}</h5>
            </div>

            <div className="flex gap-2 justify-between flex-col items-center">
                {/* Ride Details */}
                <div className="w-full mt-5">
                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="ri-map-pin-user-fill text-yellow-800"></i>
                        <div>
                            <h3 className="text-lg font-medium">{pickupLocation}</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="text-lg ri-map-pin-2-fill text-yellow-800"></i>
                        <div>
                            <h3 className="text-lg font-medium">{destinationLocation}</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 p-3">
                        <i className="ri-currency-line text-yellow-800 text-2xl"></i>
                        <div>
                            <h3 className="text-lg font-medium text-green-600">₹{fare}</h3>
                            <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
                        </div>
                    </div>
                </div>

                {/* Show QR Code or Buttons */}
                {showQrCode ? (
                    <div className="mt-5 w-full flex justify-center">
                        <img
                            src="https://scontent.fbom51-1.fna.fbcdn.net/v/t39.30808-6/464773349_8447042342017011_6148892434803992553_n.png?_nc_cat=110&ccb=1-7&_nc_sid=0b6b33&_nc_ohc=ErmQbYH3JwkQ7kNvgEg2XTU&_nc_zt=23&_nc_ht=scontent.fbom51-1.fna&_nc_gid=A4re9EqYmUtXG-NvO-kuO4I&oh=00_AYA0Joz9ups4LlJ8k2RguTeXbz1ZuHHPsgkwcxY3ukVX_w&oe=676E15B2"
                            alt="QR Code"
                            className="h-[300px]"
                        />
                    </div>
                ) : (
                    <div className="mt-5 w-full">
                        <button
                            onClick={handleAcceptRide}
                            className="bg-yellow-800 w-full text-white font-semibold p-2 px-10 rounded-lg"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => props.setRidePopupPanel(false)}
                            className="mt-2 w-full bg-gray-300 text-gray-700 font-semibold p-2 px-10 rounded-lg"
                        >
                            Ignore
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RidePopUp;
