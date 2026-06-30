import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { restaurants } from '../data/restaurants';
import MenuItem from '../components/MenuItem';

const Menu = () => {
    const { id } = useParams();
    const [toastMessage, setToastMessage] = useState('');
    const restaurant = restaurants.find((r) => r.id === parseInt(id));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!restaurant) {
        return (
            <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <h2>Restaurant not found</h2>
            </div>
        );
    }

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage('');
        }, 3000);
    };

    return (
        <main id="main-content">
            <div className="menu-header">
                <div className="container">
                    <h1 className="restaurant-name" style={{ fontSize: '32px' }}>
                        {restaurant.name}
                    </h1>
                    <p className="restaurant-details" style={{ fontSize: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span className="rating-badge" style={{ display: 'inline-flex' }}>
                            <i className="fas fa-star" style={{ fontSize: '12px' }}></i> {restaurant.rating}
                        </span>
                        <span>{restaurant.distance}</span>
                        <span>&bull;</span>
                        <span>{restaurant.time}</span>
                    </p>
                </div>
            </div>

            <section className="menu-section">
                <div className="container" id="menu-items-list">
                    {restaurant.menu.map((item) => (
                        <MenuItem
                            key={item.id}
                            item={item}
                            restaurantName={restaurant.name}
                            onShowToast={showToast}
                        />
                    ))}
                </div>
            </section>

            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'var(--secondary)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '30px',
                        zIndex: 3000,
                        boxShadow: 'var(--shadow-hover)',
                        fontWeight: '500',
                        animation: 'fadeIn 0.3s ease-in-out',
                    }}
                >
                    {toastMessage}
                </div>
            )}
        </main>
    );
};

export default Menu;
