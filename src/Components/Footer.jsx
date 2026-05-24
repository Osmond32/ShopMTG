import React from "react";
import { Link } from "react-router-dom";
import logoNavBar from "../assets/logoNavBar.webp";

const Footer = () => {
    return (
        <footer className="bg-black text-slate-400 border-t border-neutral-800 pt-16 pb-8 relative overflow-hidden">
            {/* Sottile effetto luminoso in alto */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
            
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    
                    {/* 1. Logo e Bio */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="inline-block mb-4">
                            <img src={logoNavBar} alt="Magic Store Logo" className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
                        </Link>
                        <p className="text-sm leading-relaxed max-w-sm">
                            Il punto di ritrovo per collezionisti e giocatori. Esplora migliaia di carte dal multiverso, scopri le ultime espansioni e arricchisci il tuo grimorio con i pezzi più rari.
                        </p>
                    </div>

                    {/* 2. Link Rapidi */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Navigazione</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/" className="hover:text-amber-500 transition-colors flex items-center gap-2"><span className="text-amber-500/50">›</span> Home</Link></li>
                            <li><Link to="/sets" className="hover:text-amber-500 transition-colors flex items-center gap-2"><span className="text-amber-500/50">›</span> Espansioni</Link></li>
                            <li><Link to="/products" className="hover:text-amber-500 transition-colors flex items-center gap-2"><span className="text-amber-500/50">›</span> Magazzino</Link></li>
                            <li><Link to="/cart" className="hover:text-amber-500 transition-colors flex items-center gap-2"><span className="text-amber-500/50">›</span> Carrello</Link></li>
                        </ul>
                    </div>

                    {/* 3. Contatti / Info */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Supporto</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                <a href="mailto:info@magicstore.com" className="hover:text-white transition-colors">info@magicstore.com</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                <span>+39 012 3456789</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom line e Copyright */}
                <div className="pt-8 border-t border-neutral-800 text-xs text-slate-600 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>
                        © {new Date().getFullYear()} Magic Store. Tutti i diritti riservati.
                    </p>
                    <p className="text-[10px] text-center md:text-right max-w-xl">
                        Magic: The Gathering, i suoi loghi e tutte le illustrazioni sono marchi registrati e di proprietà di Wizards of the Coast LLC. Questo sito non è affiliato o sponsorizzato da Wizards of the Coast.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
