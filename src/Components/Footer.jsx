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
                           ATTENTION !!! Ce n'est pas une vraie boutique, mais seulement un projet personnel pour présenter mes compétences. Toutes les cartes et les données proviennent de Scryfall, tandis que les produits réels sont simulés via Shopify. Merci d'avoir visité mon projet !
                        </p>
                    </div>

                    {/* 2. Link Rapidi */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Navigation</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/" className="hover:text-amber-500 transition-colors flex items-center gap-2"><span className="text-amber-500/50">›</span> Accueil</Link></li>
                            <li><Link to="/sets" className="hover:text-amber-500 transition-colors flex items-center gap-2"><span className="text-amber-500/50">›</span> Extensions</Link></li>
                            <li><Link to="/products" className="hover:text-amber-500 transition-colors flex items-center gap-2"><span className="text-amber-500/50">›</span> Boutique</Link></li>
                            <li><Link to="/cart" className="hover:text-amber-500 transition-colors flex items-center gap-2"><span className="text-amber-500/50">›</span> Panier</Link></li>
                        </ul>
                    </div>

                    {/* 3. Contatti / Info */}
                    
                </div>

                {/* Bottom line e Copyright */}
                <div className="pt-8 border-t border-neutral-800 text-xs text-slate-600 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>
                        © {new Date().getFullYear()} Magic Store. Tous droits réservés. <br className="md:hidden" />
                        <span className="md:ml-2">Développé par <a href="https://www.giuseppesaia.fr" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Giuseppe Saia</a></span>
                    </p>
                    <p className="text-[10px] text-center md:text-right max-w-xl">
                        Magic: The Gathering, ses logos et toutes les illustrations sont des marques déposées de Wizards of the Coast LLC. Ce site n'est ni affilié ni parrainé par Wizards of the Coast.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
