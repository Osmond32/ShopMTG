// src/Components/NavBar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import logoNavBar from "../assets/magic-logo.webp";

const NavBar = () => {
    const { cart } = useCart();

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="bg-black text-white shadow-md sticky top-0 z-50 neon-border-bottom">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                
                {/* Logo NavBar tutto sulla sinistra */}
                <Link to="/" className="flex items-center">
                    <img src={logoNavBar} alt="Magic Store Logo" className="h-12 w-auto object-contain hover:scale-105 transition-transform" />
                </Link>

                <div className="flex items-center gap-6 font-bold text-sm text-white">
                    <Link to="/" className="hover:text-amber-400 transition-colors drop-shadow-md">
                        Home
                    </Link>
                    <Link to="/sets" className="hover:text-amber-400 transition-colors drop-shadow-md">
                        Espansioni (Set)
                    </Link>
                    <Link to="/products" className="hover:text-amber-400 transition-colors drop-shadow-md">
                        Magazzino
                    </Link>

                    <Link 
                        to="/cart" 
                        className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 border border-white/20 transition-all relative backdrop-blur-md"
                    >
                        🛒 Carrello
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center animate-bounce shadow-lg border-2 border-black">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>

            </div>
        </nav>
    );
};

export default NavBar;