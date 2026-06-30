import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Confirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        if (location.state?.order) {
            setOrder(location.state.order);
        } else {
            // Fallback to localStorage
            const lastOrderStr = localStorage.getItem('lastOrder');
            if (lastOrderStr) {
                try {
                    setOrder(JSON.parse(lastOrderStr));
                } catch (e) {
                    console.error("Error parsing lastOrder from localStorage", e);
                    navigate('/');
                }
            } else {
                navigate('/');
            }
        }
    }, [location, navigate]);

    if (!order) {
        return null;
    }

    return (
        <main id="main-content">
            <section className="confirmation-section" style={{ padding: '60px 0' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '72px', color: 'var(--success)', marginBottom: '20px' }}>
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '10px' }}>
                        Order Placed Successfully!
                    </h2>
                    <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>Order ID: #{order.id}</p>

                    <div
                        style={{
                            maxWidth: '500px',
                            margin: '40px auto',
                            background: 'white',
                            padding: '30px',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'left',
                            boxShadow: 'var(--shadow-soft)',
                        }}
                    >
                        <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>
                            Order Summary
                        </h4>
                        <hr style={{ margin: '15px 0', opacity: 0.1 }} />
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between"
                                style={{ margin: '10px 0', fontSize: '15px' }}
                            >
                                <span>
                                    {item.name} x {item.quantity}
                                </span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                        <hr style={{ margin: '15px 0', opacity: 0.1 }} />
                        <div
                            className="flex justify-between"
                            style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-main)' }}
                        >
                            <span>Total Paid</span>
                            <span>₹{order.total}</span>
                        </div>
                        <p style={{ marginTop: '25px', color: 'var(--text-muted)', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <i className="fas fa-clock" style={{ color: 'var(--primary)' }}></i>
                            Estimated Delivery: 30-40 mins
                        </p>
                    </div>
                    <button
                        className="btn btn-primary"
                        style={{ maxWidth: '300px', margin: '0 auto', display: 'block', fontSize: '16px' }}
                        onClick={() => navigate(`/tracking/${order.id}`)}
                    >
                        Track My Order
                    </button>
                </div>
            </section>
        </main>
    );
};

export default Confirmation;
