import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import { faCarSide, faMotorcycle, faCaravan } from '@fortawesome/free-solid-svg-icons';

const LiveTracking = ({ captains, pickup, destination }) => {
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const userMarkerRef = useRef(null);
    const userCircleRef = useRef(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        if (!map) {
            const initialMap = L.map(mapRef.current, {
                center: [0, 0],
                zoom: 12,
                zoomControl: true,
                scrollWheelZoom: true,
            });

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: 'Leaflet &copy; OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(initialMap);

            setMap(initialMap);
        }

        if (map && pickup.lat !== null && pickup.lng !== null) {
            map.setView([pickup.lat, pickup.lng], 12);
            console.log(`Map updated with pickup coordinates: Lat: ${pickup.lat}, Lng: ${pickup.lng}`);
        }
    }, [map, pickup]);

    useEffect(() => {
        if (map) {
            markersRef.current.forEach(marker => map.removeLayer(marker));
            markersRef.current = captains.map(captain => {
                const icon = captain.vehicleType === 'car' ? faCarSide : captain.vehicleType === 'moto' ? faMotorcycle : faCaravan;
                const iconHtml = `<div style="font-size: 24px; color: black;"><i class="fa ${icon.iconName}"></i></div>`;
                const customIcon = L.divIcon({
                    html: iconHtml,
                    className: 'custom-icon',
                    iconSize: [30, 30]
                });

                const marker = L.marker([captain.location.coordinates[1], captain.location.coordinates[0]], { icon: customIcon }).addTo(map);
                console.log(`Captain ${captain._id} at coordinates: Lat: ${captain.location.coordinates[1]}, Lng: ${captain.location.coordinates[0]}`);
                return marker;
            });

            if (captains.length > 0) {
                console.log('Captains nearby:', captains.map(captain => ({
                    id: captain._id,
                    lat: captain.location.coordinates[1],
                    lng: captain.location.coordinates[0]
                })));
            }

            if (pickup.lat && pickup.lng && destination.lat && destination.lng) {
                const routeControl = L.Routing.control({
                    waypoints: [
                        L.latLng(pickup.lat, pickup.lng),
                        L.latLng(destination.lat, destination.lng)
                    ],
                    createMarker: () => null,
                    lineOptions: {
                        styles: [{ color: 'blue', opacity: 0.6, weight: 4 }]
                    }
                }).addTo(map);
            }
        }
    }, [map, captains, pickup, destination]);

    useEffect(() => {
        const updateUserLocation = (position) => {
            const { latitude, longitude, accuracy } = position.coords;

            if (userMarkerRef.current) {
                map.removeLayer(userMarkerRef.current);
            }

            if (userCircleRef.current) {
                map.removeLayer(userCircleRef.current);
            }

            userMarkerRef.current = L.marker([latitude, longitude]).addTo(map);
            userCircleRef.current = L.circle([latitude, longitude], { radius: accuracy }).addTo(map);

            const featureGroup = L.featureGroup([userMarkerRef.current, userCircleRef.current]).addTo(map);
            map.fitBounds(featureGroup.getBounds());

            console.log(`Your coordinate is: Lat: ${latitude} Long: ${longitude} Accuracy: ${accuracy}`);
        };

        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(updateUserLocation, (error) => {
                console.error('Geolocation error:', error);
                if (error.code === error.PERMISSION_DENIED) {
                    console.log('Geolocation permission denied.');
                } else if (error.code === error.TIMEOUT) {
                    console.log('Geolocation timeout expired.');
                }
            }, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            });

            return () => {
                navigator.geolocation.clearWatch(watchId);
                if (map) {
                    map.remove();
                }
            };
        } else {
            console.log("Your browser doesn't support geolocation feature!");
        }
    }, [map]);

    return <div ref={mapRef} style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: -1 }} />;
};

export default LiveTracking;