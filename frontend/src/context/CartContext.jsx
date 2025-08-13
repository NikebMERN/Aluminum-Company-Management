import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        setCartItems((prev) => {
            const existing = prev.find((i) => i.id === item.id);

            // If already in cart, increase quantity only if under limit
            if (existing) {
                if (existing.quantity < item.available_quantity) {
                    return prev.map((i) =>
                        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                    );
                } else {
                    alert(
                        `Max quantity of ${item.available_quantity} reached for ${item.shape}`
                    );
                    return prev;
                }
            }

            // If new item, start at quantity 1
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id, quantity, maxQuantity) => {
        if (quantity < 1) return;
        if (quantity > maxQuantity) {
            alert(`Max quantity of ${maxQuantity} reached`);
            return;
        }
        setCartItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => setCartItems([]);

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price_per_item * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
