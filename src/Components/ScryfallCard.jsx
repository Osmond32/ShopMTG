// src/Components/ScryfallCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // 1. Importiamo l'hook di navigazione

const ScryfallCard = ({ card, isPresent }) => {
    const navigate = useNavigate(); // 2. Inizializziamo l'hook

    const title = card.name;
    const description = card.oracle_text;
    const imageUrl = card.image_uris?.normal || card.image_uris?.small;

    const priceUSD = card.prices?.usd;
    const priceEUR = card.prices?.eur;

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between p-4 w-64 relative">

            {isPresent && (
                <span className="absolute top-6 left-6 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md z-10 animate-pulse">
                    🟢 In Magazzino
                </span>
            )}

            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-72 object-contain rounded-lg bg-gray-50 mb-4"
                />
            ) : (
                <div className="w-full h-72 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 text-sm">
                    Immagine non disponibile
                </div>
            )}

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-1 truncate" title={title}>
                        {title}
                    </h3>
                    <p className="text-gray-600 text-xs mb-4 line-clamp-3">
                        {description || "Nessun testo di espansione disponibile."}
                    </p>
                </div>

                <div className="mt-auto border-t border-gray-100 pt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-3">
                        <span>Valore USD: {priceUSD ? `$${priceUSD}` : "N/D"}</span>
                        <span>Valore EUR: {priceEUR ? `€${priceEUR}` : "N/D"}</span>
                    </div>

                    {/* 3. Al click, navighiamo verso la rotta di dettaglio passando l'ID unico di Scryfall */}
                    <button
                        onClick={() => {
                            console.log("Id della carta cliccata:", card.id); // <-- Aggiungi questo per testare
                            navigate(`/product/${card.id}`);
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200"
                    >
                        Dettagli Catalogo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScryfallCard;