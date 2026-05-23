// src/Pages/ProductPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScryfallService from "../Services/ScryfallService";
import ShopifyService from "../Services/ShopifyService"; // 1. Importiamo il servizio Shopify

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [card, setCard] = useState(null);
    const [shopifyProduct, setShopifyProduct] = useState(null); // Stato per memorizzare il match di Shopify
    const [loading, setLoading] = useState(true);

    const fetchAllDetails = async () => {
        try {
            setLoading(true);
            
            // 2. Lanciamo la chiamata a Scryfall
            const scryfallResponse = await ScryfallService.getCardById(id);
            const scryfallCardData = scryfallResponse.data;
            setCard(scryfallCardData);

            // 3. Lanciamo la chiamata a Shopify per controllare il magazzino
            const shopifyResponse = await ShopifyService.getProducts();
            const shopifyInventory = shopifyResponse.data.data.products.edges;

            // 4. Cerchiamo se questa specifica carta esiste su Shopify (confrontando i titoli)
            const match = shopifyInventory.find(
                (item) => item.node.title.toLowerCase() === scryfallCardData.name.toLowerCase()
            );

            if (match) {
                setShopifyProduct(match.node); // Salviamo il nodo Shopify (prezzo, inventario, ecc.)
                console.log("🏪 Match trovato su Shopify per questa carta:", match.node);
            } else {
                setShopifyProduct(null);
            }

        } catch (error) {
            console.error("❌ Errore nel recupero dei dettagli combinati:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllDetails();
    }, [id]);

    if (loading) return <div className="text-center py-12 text-gray-600 font-medium">Caricamento dettagli...</div>;
    if (!card) return <div className="text-center py-12 text-red-500">Carta non trovata.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <button 
                onClick={() => navigate(-1)} 
                className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
            >
                ← Torna al Catalogo
            </button>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
                {/* Immagine Grande */}
                <div className="flex-shrink-0 mx-auto md:mx-0 relative">
                    {shopifyProduct && (
                        <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 animate-pulse">
                            🟢 Disponibile in Negozio
                        </span>
                    )}
                    <img 
                        src={card.image_uris?.normal} 
                        alt={card.name} 
                        className="w-72 md:w-80 h-auto object-contain rounded-xl shadow-sm"
                    />
                </div>

                {/* Dettagli Informativi */}
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">{card.name}</h1>
                        <p className="text-sm font-semibold text-gray-500 mb-4">
                            Espansione: <span className="uppercase text-blue-600">{card.set}</span> — Rarity: <span className="capitalize">{card.rarity}</span>
                        </p>
                        
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
                            <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">Testo della Carta (Oracle Text)</h3>
                            <p className="text-gray-700 text-sm whitespace-pre-line font-medium leading-relaxed">
                                {card.oracle_text || "Nessun testo presente per questa carta."}
                            </p>
                        </div>
                    </div>

                    {/* SEZIONE PREZZI: Uniamo Shopify e Scryfall */}
                    <div className="border-t border-gray-100 pt-4 mt-4">
                        {shopifyProduct ? (
                            // Se la carta è su Shopify, mostriamo il NOSTRO prezzo e il bottone di acquisto
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                                <h4 className="text-xs font-bold text-blue-500 uppercase mb-1">Prezzo nel nostro Store</h4>
                                <div className="text-3xl font-black text-blue-900 mb-3">
                                    {parseFloat(shopifyProduct.priceRange.minVariantPrice.amount).toFixed(2)} {shopifyProduct.priceRange.minVariantPrice.currencyCode}
                                </div>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-sm">
                                    🛒 Aggiungi al Carrello
忠                                </button>
                            </div>
                        ) : (
                            // Se non è su Shopify, avvisiamo l'utente
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 text-gray-500 text-sm font-medium">
                                🛑 Questa carta non è attualmente disponibile nel nostro magazzino.
                            </div>
                        )}

                        {/* Mostriamo comunque i prezzi di mercato di Scryfall come riferimento */}
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Valutazione Storica di Mercato (Scryfall)</h4>
                        <div className="flex gap-4 text-gray-600 font-bold text-sm">
                            <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">🇺🇸 {card.prices?.usd ? `$${card.prices.usd}` : "N/D"}</div>
                            <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">🇪🇺 {card.prices?.eur ? `€${card.prices.eur}` : "N/D"}</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductPage;