import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CUSTOMER_LOCATION, restaurants } from '../data/restaurants';

const Tracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [step, setStep] = useState(1);
    const [eta, setEta] = useState(5);
    const [statusText, setStatusText] = useState('Your order has been confirmed!');
    const [progress, setProgress] = useState('0%');
    const [showMap, setShowMap] = useState(false);

    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const deliveryMarkerRef = useRef(null);

    // Load order data
    useEffect(() => {
        const lastOrderStr = localStorage.getItem('lastOrder');
        if (lastOrderStr) {
            try {
                const parsedOrder = JSON.parse(lastOrderStr);
                if (parsedOrder.id === orderId) {
                    setOrder(parsedOrder);
                    const rest = restaurants.find((r) => r.id === parsedOrder.restaurantId) || restaurants[0];
                    setRestaurant(rest);
                } else {
                    navigate('/');
                }
            } catch (e) {
                console.error("Error reading lastOrder in tracking page", e);
                navigate('/');
            }
        } else {
            navigate('/');
        }
    }, [orderId, navigate]);

    // Simulate order progress steps
    useEffect(() => {
        if (!order) return;

        const timeline = [
            { step: 1, progress: '0%', text: 'Your order has been confirmed!', delay: 4000 },
            { step: 2, progress: '33%', text: 'Chef is preparing your delicious meal...', delay: 5000 },
            { step: 3, progress: '66%', text: 'Our delivery partner is on the way!', delay: 35000 }, // long delay to allow map navigation
            { step: 4, progress: '100%', text: 'Food delivered! Enjoy your meal.', delay: 0 }
        ];

        let index = 0;
        let timerId = null;

        const advanceTimeline = () => {
            const current = timeline[index];
            setStep(current.step);
            setProgress(current.progress);
            setStatusText(current.text);

            if (current.step === 3) {
                setShowMap(true);
            }

            if (current.step === 4) {
                setEta(0);
                setShowMap(false);
            }

            index++;
            if (index < timeline.length) {
                timerId = setTimeout(advanceTimeline, current.delay);
            }
        };

        advanceTimeline();

        return () => {
            if (timerId) clearTimeout(timerId);
        };
    }, [order]);

    // Handle map initialization and marker movement
    useEffect(() => {
        if (!showMap || !restaurant || !mapContainerRef.current) return;

        const startCoords = restaurant.coords;
        const endCoords = CUSTOMER_LOCATION;

        // Initialize Map
        const map = L.map(mapContainerRef.current).setView(startCoords, 15);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        // Custom FontAwesome Icons to prevent loading issues in bundler
        const restaurantIcon = L.divIcon({
            className: 'custom-map-marker',
            html: '<div style="background-color: var(--secondary); border: 2px solid white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-soft);"><i class="fas fa-store" style="color: white; font-size: 14px;"></i></div>',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const customerIcon = L.divIcon({
            className: 'custom-map-marker',
            html: '<div style="background-color: var(--success); border: 2px solid white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-soft);"><i class="fas fa-home" style="color: white; font-size: 14px;"></i></div>',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const deliveryIcon = L.divIcon({
            className: 'delivery-boy-marker',
            html: '<div style="background-color: var(--primary); border: 2px solid white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-hover);"><i class="fas fa-motorcycle" style="color: white; font-size: 16px;"></i></div>',
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });

        // Add static markers
        L.marker(startCoords, { icon: restaurantIcon }).addTo(map).bindPopup(restaurant.name);
        L.marker(endCoords, { icon: customerIcon }).addTo(map).bindPopup('Your Location');

        // Add delivery boy marker
        const deliveryMarker = L.marker(startCoords, { icon: deliveryIcon })
            .addTo(map)
            .bindPopup('Delivery Partner')
            .openPopup();
        deliveryMarkerRef.current = deliveryMarker;

        // Move delivery boy from start to end (10 steps)
        const totalSteps = 10;
        let currentStep = 0;
        const intervalTime = 3000; // 3 seconds per step

        const deltaLat = (endCoords[0] - startCoords[0]) / totalSteps;
        const deltaLng = (endCoords[1] - startCoords[1]) / totalSteps;

        let currentPos = [...startCoords];

        const moveInterval = setInterval(() => {
            currentStep++;
            currentPos[0] += deltaLat;
            currentPos[1] += deltaLng;

            if (deliveryMarkerRef.current) {
                deliveryMarkerRef.current.setLatLng(currentPos);
                // Pan map to follow the rider
                map.panTo(currentPos);
            }

            setEta((prev) => {
                if (prev > 1) return prev - 1;
                return 1;
            });

            if (currentStep >= totalSteps) {
                clearInterval(moveInterval);
                setEta(0);
            }
        }, intervalTime);

        // Cleanup Map on unmount or condition change
        return () => {
            clearInterval(moveInterval);
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [showMap, restaurant]);

    return (
        <main id="main-content">
            <section className="tracking-section" style={{ padding: '60px 0' }}>
                <div className="container">
                    <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
                        Tracking Order #{orderId}
                    </h2>
                    
                    <div className="tracking-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div
                            className="step-container"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                position: 'relative',
                                marginBottom: '50px',
                                padding: '0 20px',
                            }}
                        >
                            {/* Static progress track */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    left: 0,
                                    width: '100%',
                                    height: '4px',
                                    background: '#ddd',
                                    zIndex: 0,
                                }}
                            ></div>
                            {/* Dynamic progress track */}
                            <div
                                id="progress-bar"
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    left: 0,
                                    width: progress,
                                    height: '4px',
                                    background: 'var(--success)',
                                    zIndex: 0,
                                    transition: 'width 1s ease-in-out',
                                }}
                            ></div>

                            {[1, 2, 3, 4].map((i) => {
                                const stepTitles = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
                                const isActive = i <= step;
                                return (
                                    <div
                                        key={i}
                                        className="step"
                                        style={{ textAlign: 'center', width: '80px', zIndex: 1 }}
                                    >
                                        <div
                                            className="step-icon"
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '50%',
                                                background: isActive ? 'var(--success)' : 'var(--white)',
                                                border: isActive ? '4px solid var(--success)' : '4px solid #ddd',
                                                color: isActive ? 'white' : '#777',
                                                margin: '0 auto 10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: '700',
                                                fontSize: '12px',
                                                transition: 'background 0.5s, border-color 0.5s',
                                            }}
                                        >
                                            {isActive ? <i className="fas fa-check" style={{ fontSize: '10px' }}></i> : i}
                                        </div>
                                        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-main)' }}>
                                            {stepTitles[i - 1]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div
                            id="tracking-status"
                            style={{
                                textAlign: 'center',
                                fontSize: '20px',
                                fontWeight: '700',
                                color: 'var(--secondary)',
                                marginBottom: '40px',
                            }}
                        >
                            {statusText}
                        </div>

                        {showMap && (
                            <div id="map-area">
                                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                    <span className="eta-badge" id="eta-container">
                                        <i className="fas fa-motorcycle" style={{ marginRight: '8px' }}></i>
                                        Estimated Delivery: <span id="eta-timer" style={{ fontWeight: '700' }}>{eta}</span> mins
                                    </span>
                                </div>
                                <div
                                    ref={mapContainerRef}
                                    style={{
                                        height: '400px',
                                        borderRadius: '12px',
                                        border: '1px solid #ddd',
                                        boxShadow: 'var(--shadow-soft)',
                                        overflow: 'hidden',
                                    }}
                                ></div>
                            </div>
                        )}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <button
                            className="btn"
                            style={{ maxWidth: '200px', border: '1px solid #ddd', background: 'white' }}
                            onClick={() => navigate('/')}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Tracking;
