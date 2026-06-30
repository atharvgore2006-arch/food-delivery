// import React from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
    const navigate = useNavigate();

    return (
        <div className="restaurant-card" onClick={() => navigate(`/restaurant/${restaurant.id}`)}>
            <img src={restaurant.image} alt={restaurant.name} className="restaurant-img" />
            <div className="restaurant-info">
                <h3 className="restaurant-name">{restaurant.name}</h3>
                <div className="restaurant-details">
                    <span className="rating-badge">
                        <i className="fas fa-star" style={{ fontSize: '12px' }}></i> {restaurant.rating}
                    </span>
                    <span>{restaurant.distance}</span>
                    <span>{restaurant.time}</span>
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;
