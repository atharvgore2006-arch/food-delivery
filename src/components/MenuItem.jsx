import React from 'react';
import { useCart } from '../context/CartContext';

const MenuItem = ({ item, restaurantName, onShowToast }) => {
    const { addToCart } = useCart();

    const handleAdd = () => {
        addToCart(item, restaurantName);
        if (onShowToast) {
            onShowToast(`${item.name} added to cart!`);
        }
    };

    return (
        <div className="menu-item">
            <div className="menu-item-info">
                <h3 className="menu-item-name">{item.name}</h3>
                <p className="menu-item-price">₹{item.price}</p>
            </div>
            <div className="menu-item-img-container">
                <img src={item.image} alt={item.name} className="menu-item-img" />
                <button className="add-btn" onClick={handleAdd}>ADD</button>
            </div>
        </div>
    );
};

export default MenuItem;
