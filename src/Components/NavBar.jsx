// src/Components/NavBar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext"; // Importiamo il carrello globale

const NavBar = () => {
    const { cart } = useCart();

    // Calcoliamo il numero totale di oggetti nel carrello (sommando le quantità)
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                
                {/* Logo / Nome del Portfolio */}
                <Link to="/" className="text-xl font-black tracking-wider text-amber-500 hover:text-amber-400 transition-colors">
                    🃏 MAGIC STORE
                </Link>

                {/* Link di Navigazione tra le Pagine che hai pianificato */}
                <div className="flex items-center gap-6 font-medium text-sm text-gray-300">
                    <Link to="/" className="hover:text-white transition-colors">
                        Home
                    </Link>
                    <Link to="/sets" className="hover:text-white transition-colors">
                        Espansioni (Set)
                    </Link>
                    <Link to="/products" className="hover:text-white transition-colors">
                        Magazzino
                    </Link>

                    {/* Pulsante Carrello con Contatore Dinamico */}
                    <Link 
                        to="/cart" 
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-700 transition-all relative"
                    >
                        🛒 Carrello
                        {totalItems > 0 && (
                            <span className="bg-amber-500 text-slate-950 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
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