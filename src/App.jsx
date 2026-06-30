// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import Tracking from './pages/Tracking';

function App() {
    return (
        <CartProvider>
            <Router>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <div style={{ flex: 1 }}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/restaurant/:id" element={<Menu />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/confirmation" element={<Confirmation />} />
                            <Route path="/tracking/:orderId" element={<Tracking />} />
                            <Route path="*" element={<Home />} />
                        </Routes>
                    </div>
                    <Footer />
                    <CartModal />
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;
