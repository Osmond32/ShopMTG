// src/Components/NavBar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import logoNavBar from "../assets/logoNavBar.webp";

const NavBar = () => {
    const { cart } = useCart();

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="bg-black text-white shadow-md sticky top-0 z-50 neon-border-bottom">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                
                {/* Logo NavBar */}
                <Link to="/" className="flex items-center">
                    <img src={logoNavBar} alt="Magic Store Logo" className="h-14 w-auto object-contain hover:scale-105 transition-transform" />
                </Link>

                <div className="flex items-center gap-8 font-bold text-base tracking-wide text-white uppercase">
                    <Link to="/" className="hover:text-amber-400 transition-colors drop-shadow-md">
                        Accueil
                    </Link>
                    <Link to="/sets" className="hover:text-amber-400 transition-colors drop-shadow-md">
                        Extensions
                    </Link>
                    <Link to="/products" className="hover:text-amber-400 transition-colors drop-shadow-md">
                        Boutique
                    </Link>

                    <Link 
                        to="/cart" 
                        className="bg-red-600 hover:bg-red-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-black transition-all shadow-[0_0_15px_rgba(239,68,68,0.6)] border border-red-300 relative"
                    >
                        🛒 Panier
                        {totalItems > 0 && (
                            <span className="absolute -top-3 -right-3 bg-white text-red-700 text-xs font-black w-7 h-7 rounded-full flex items-center justify-center animate-bounce shadow-lg border-2 border-red-600">
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