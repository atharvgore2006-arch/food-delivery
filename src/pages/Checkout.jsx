import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        address: '',
        phone: '',
    });

    useEffect(() => {
        // Redirect to home if cart is empty and page is visited
        if (cart.length === 0) {
            const lastOrder = localStorage.getItem('lastOrder');
            // If they just submitted an order, let it be, but if not, go home
            if (!lastOrder) {
                navigate('/');
            }
        }

        // Pre-fill userDetails if they exist
        const savedUser = localStorage.getItem('userDetails');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                setForm((prev) => ({
                    ...prev,
                    name: parsed.name || '',
                    address: parsed.address || '',
                    phone: parsed.phone || '',
                }));
            } catch (e) {
                console.error("Error parsing userDetails from localStorage", e);
            }
        }
    }, [cart, navigate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const orderId = 'ORD' + Math.floor(Math.random() * 1000000);
        const order = {
            id: orderId,
            user: form,
            items: [...cart],
            total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
            status: 1, // 1: Confirmed, 2: Preparing, 3: Out for delivery, 4: Delivered
            timestamp: new Date().getTime(),
        };

        localStorage.setItem('lastOrder', JSON.stringify(order));
        localStorage.setItem('userDetails', JSON.stringify(form));

        // Clear cart context
        clearCart();

        // Redirect to confirmation
        navigate('/confirmation', { state: { order } });
    };

    return (
        <main id="main-content">
            <section className="checkout-section">
                <div className="container">
                    <h2 className="section-title" style={{ textAlign: 'center' }}>Checkout</h2>
                    <div
                        style={{
                            maxWidth: '600px',
                            margin: '0 auto',
                            background: 'white',
                            padding: '30px',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-soft)',
                        }}
                    >
                        <form id="checkout-form" onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    value={form.name}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '16px',
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                    Delivery Address
                                </label>
                                <textarea
                                    id="address"
                                    required
                                    value={form.address}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        height: '100px',
                                        fontFamily: 'inherit',
                                        fontSize: '16px',
                                        resize: 'vertical',
                                    }}
                                ></textarea>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    required
                                    pattern="[0-9]{10}"
                                    placeholder="10 digit number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '16px',
                                    }}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ fontSize: '16px', fontWeight: '600' }}>
                                Confirm Order
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Checkout;
