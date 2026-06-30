import  { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item, restaurantName) => {
        setCart((prevCart) => {
            const existing = prevCart.find((c) => c.id === item.id);
            if (existing) {
                return prevCart.map((c) =>
                    c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
                );
            } else {
                return [...prevCart, { ...item, quantity: 1, restaurantName }];
            }
        });
    };

    const updateQuantity = (itemId, delta) => {
        setCart((prevCart) => {
            return prevCart
                .map((c) => {
                    if (c.id === itemId) {
                        const newQty = c.quantity + delta;
                        return { ...c, quantity: newQty };
                    }
                    return c;
                })
                .filter((c) => c.quantity > 0);
        });
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter((c) => c.id !== itemId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const toggleCart = () => {
        setIsCartOpen((prev) => !prev);
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider
            value={{
                cart,
                isCartOpen,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                toggleCart,
                openCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
