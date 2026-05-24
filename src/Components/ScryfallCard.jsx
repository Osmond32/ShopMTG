// src/Components/ScryfallCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";

const ScryfallCard = ({ card, isPresent, availableQuantity }) => {
    const { addToCart } = useCart();

    const imageUrl = card.image_uris?.normal || 
                     card.card_faces?.[0]?.image_uris?.normal || 
                     "https://images.scryfall.com/cards/art_crop/front/a/e/ae5107c8-d32d-470b-9b7d-35529c165380.jpg";

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevents navigating when clicking "Add to Cart"
        
        if (card.isFromShopify && card.rawProduct) {
            addToCart(card.rawProduct);
            alert(`🃏 ${card.name} aggiunta al carrello con successo!`);
        } else {
            alert("Questa carta fa parte del database globale Scryfall e non è acquistabile al momento.");
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between group shadow-lg w-full max-w-[280px] mx-auto">
            
            {/* Rendiamo cliccabile l'immagine e il titolo verso la ProductPage */}
            <Link to={`/product/${card.id}`} className="block relative bg-slate-950 p-4 flex items-center justify-center h-72 cursor-pointer">
                <img 
                    src={imageUrl} 
                    alt={card.name} 
                    className="max-h-full max-w-full object-contain group-hover:scale-102 transition-transform duration-300"
                />
                
                {isPresent && (
                    <span className="absolute top-3 right-3 bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full shadow-md z-10">
                        ✨ Disp. {availableQuantity > 0 ? `(${availableQuantity})` : ""}
                    </span>
                )}
            </Link>

            <div className="p-5 flex-1 flex flex-col justify-between border-t border-slate-800/60">
                <div>
                    <Link to={`/product/${card.id}`} className="cursor-pointer">
                        <h3 className="font-bold text-base text-white hover:text-amber-400 transition-colors line-clamp-1">
                            {card.name}
                        </h3>
                    </Link>
                    
                    <p className="text-slate-400 text-xs mt-2 line-clamp-2 min-h-[2rem]">
                        {card.type_line || "Nessuna descrizione disponibile."}
                    </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex flex-col gap-3">
                    {card.isFromShopify ? (
                        <>
                            {availableQuantity > 0 && (
                                <div className="flex justify-between items-center text-xs border-b border-slate-800/40 pb-2 mb-1">
                                    <span className="text-slate-500 font-medium">Magazzino:</span>
                                    <span className="text-emerald-400 font-mono font-bold">
                                        {availableQuantity} pezzi
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-xs font-medium">Prezzo:</span>
                                <span className="text-amber-400 font-mono font-black text-lg">
                                    {parseFloat(card.price).toFixed(2)} EUR
                                </span>
                            </div>
                            
                            <button 
                                onClick={handleAddToCart}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 px-4 rounded-xl text-sm transition-all shadow-md"
                            >
                                🛒 Aggiungi al Carrello
                            </button>
                        </>
                    ) : (
                        <div className="text-center text-xs text-slate-600 font-medium py-2 bg-slate-950/40 rounded-lg border border-slate-950">
                            Solo consultazione
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ScryfallCard;