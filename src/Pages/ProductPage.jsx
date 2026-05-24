// src/Pages/ProductPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ScryfallService from "../Services/ScryfallService";
import ShopifyService from "../Services/ShopifyService";
import { useCart } from "../Context/CartContext"; // 1. Importiamo l'hook del carrello

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, cart } = useCart(); // 2. Estraiamo la funzione e lo stato del carrello

    const [card, setCard] = useState(null);
    const [shopifyProduct, setShopifyProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAllDetails = async () => {
        try {
            setLoading(true);
            const scryfallResponse = await ScryfallService.getCardById(id);
            const scryfallCardData = scryfallResponse.data;
            setCard(scryfallCardData);

            const shopifyResponse = await ShopifyService.getProducts();
            const shopifyInventory = shopifyResponse.data.data.products.edges;

            const match = shopifyInventory.find(
                (item) => item.node.title.toLowerCase() === scryfallCardData.name.toLowerCase()
            );

            if (match) {
                setShopifyProduct(match.node);
                console.log("🏪 Match trovato su Shopify:", match.node);
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

    // Funzione interna per gestire il click e monitorare lo stato globale
    const handleAddToCart = () => {
        if (shopifyProduct) {
            addToCart(shopifyProduct);
            alert(`🎉 ${shopifyProduct.title} aggiunta al carrello!`);
            console.log("🛒 Stato attuale del carrello globale:", cart);
        }
    };

    if (loading) return <div className="text-center py-12 text-gray-600 font-medium">Caricamento dettagli...</div>;
    if (!card) return <div className="text-center py-12 text-red-500">Carta non trouvata.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/products">
                <button
                    className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    ← Torna al Catalogo
                </button>
            </Link>

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

                    {/* SEZIONE PREZZI */}
                    <div className="border-t border-gray-100 pt-4 mt-4">
                        {shopifyProduct ? (
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                                <h4 className="text-xs font-bold text-blue-500 uppercase mb-1">Prezzo nel nostro Store</h4>
                                <div className="text-3xl font-black text-blue-900 mb-2">
                                    {parseFloat(shopifyProduct.priceRange.minVariantPrice.amount).toFixed(2)} {shopifyProduct.priceRange.minVariantPrice.currencyCode}
                                </div>

                                {/* Mostra la quantità a magazzino del prodotto in un badge */}
                                {shopifyProduct.variants?.edges?.[0]?.node?.quantityAvailable > 0 && (
                                    <div className="text-xs font-bold text-emerald-600 mb-4 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-sm">
                                        📦 Disponibili a magazzino: {shopifyProduct.variants.edges[0].node.quantityAvailable} pezzi
                                    </div>
                                )}

                                {/* 3. Colleghiamo la nostra funzione di aggiunta al click */}
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-sm"
                                >
                                    🛒 Aggiungi al Carrello
                                </button>
                                {/* LINK DI TEST TEMPORANEO */}
                                <Link to="/cart" className="block text-center text-sm font-bold text-blue-600 hover:underline mt-4">
                                    Vai al Carrello →
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 text-gray-500 text-sm font-medium">
                                🛑 Questa carta non è attualmente disponibile nel nostro magazzino.
                            </div>
                        )}

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