import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { cart, toggleCart } = useCart();
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="header">
            <div className="container">
                <Link to="/" className="logo-container" style={{ textDecoration: 'none' }}>
                    <div className="logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-utensils" style={{ color: 'white', fontSize: '18px' }}></i>
                    </div>
                    <span className="brand-name">FastFood</span>
                </Link>
                <div className="location-picker">
                    <i className="fas fa-map-marker-alt"></i>
                    <span className="current-location">Shrirampur, Maharashtra</span>
                </div>
                <nav className="nav">
                    <div className="cart-trigger" id="cart-icon" onClick={toggleCart}>
                        <i className="fas fa-shopping-cart" style={{ color: 'var(--text-main)' }}></i>
                        {cartCount > 0 && (
                            <span className="cart-count" id="cart-count">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
