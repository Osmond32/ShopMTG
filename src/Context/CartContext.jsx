// src/Context/CartContext.jsx
import React, { createContext, useState, useContext } from "react";

// Creiamo il contesto nativo di React
const CartContext = createContext();

// Creiamo il Provider, ovvero il "guscio" che conterrà lo stato e avvolgerà l'app
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Funzione per aggiungere un prodotto Shopify al carrello
    const addToCart = (productNode) => {
        setCart((prevCart) => {
            // Controlliamo se la carta è già nel carrello
            const existingItem = prevCart.find(item => item.id === productNode.id);
            
            if (existingItem) {
                // Se c'è già, aumentiamo solo la quantità
                return prevCart.map(item => 
                    item.id === productNode.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            
            // Se non c'è, la aggiungiamo con quantità 1
            return [...prevCart, { ...productNode, quantity: 1 }];
        });
    };

    // Funzione per svuotare completamente il carrello dopo il checkout
    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook personalizzato per usare il carrello al volo nei componenti senza fare doppi import
export const useCart = () => useContext(CartContext);