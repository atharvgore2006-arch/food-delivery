import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartModal = () => {
    const { cart, isCartOpen, toggleCart, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (cart.length === 0) return;
        toggleCart(); // Close the modal
        navigate('/checkout');
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className={`modal ${isCartOpen ? 'active' : ''}`} id="cart-modal">
            <div className="modal-content">
                <span className="close-modal" onClick={toggleCart}>&times;</span>
                <h2>Your Cart</h2>
                <div id="cart-items-container" style={{ marginTop: '20px' }}>
                    {cart.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '20px' }}>Your cart is empty.</p>
                    ) : (
                        cart.map((item) => (
                            <div
                                key={item.id}
                                className="cart-item"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '20px',
                                }}
                            >
                                <div style={{ maxWidth: '60%' }}>
                                    <h4 style={{ margin: 0, fontSize: '16px' }}>{item.name}</h4>
                                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                                        ₹{item.price} x {item.quantity} <span style={{ fontSize: '11px' }}>({item.restaurantName})</span>
                                    </p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        style={{ padding: '2px 8px', cursor: 'pointer' }}
                                    >
                                        -
                                    </button>
                                    <span style={{ minWidth: '15px', textAlign: 'center', fontWeight: '600' }}>
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        style={{ padding: '2px 8px', cursor: 'pointer' }}
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{
                                            color: '#ff4d4f',
                                            border: 'none',
                                            background: 'none',
                                            cursor: 'pointer',
                                            padding: '4px',
                                        }}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {cart.length > 0 && (
                    <div className="cart-summary" style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                        <div
                            className="total-price-row"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '18px',
                                fontWeight: '700',
                                marginBottom: '20px',
                            }}
                        >
                            <span>Total Amount</span>
                            <span id="cart-total">₹{total}</span>
                        </div>
                        <button id="checkout-btn" className="btn btn-primary" onClick={handleCheckout}>
                            Place Order
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;
