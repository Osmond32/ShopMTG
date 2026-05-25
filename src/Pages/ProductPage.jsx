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
            let scryfallCardData = null;
            let shopifyMatch = null;
            
            // L'id potrebbe essere un url codificato se proviene da Shopify (es. gid://shopify/Product/...)
            const decodedId = decodeURIComponent(id);

            // Controlliamo se è un ID di Shopify
            if (decodedId.includes("shopify")) {
                const shopifyResponse = await ShopifyService.getProducts();
                const shopifyInventory = shopifyResponse.data.data.products.edges;
                shopifyMatch = shopifyInventory.find(item => item.node.id === decodedId);

                if (shopifyMatch) {
                    setShopifyProduct(shopifyMatch.node);
                    // Cerchiamo la carta su Scryfall usando il nome esatto
                    try {
                        const scryfallResponse = await ScryfallService.searchCards(`!"${shopifyMatch.node.title}"`);
                        if (scryfallResponse.data?.data?.length > 0) {
                            scryfallCardData = scryfallResponse.data.data[0];
                        }
                    } catch (err) {
                        console.warn("Non è stato possibile trovare la carta su Scryfall per:", shopifyMatch.node.title);
                    }
                }
            } else {
                // E' un normale ID di Scryfall
                const scryfallResponse = await ScryfallService.getCardById(decodedId);
                scryfallCardData = scryfallResponse.data;

                const shopifyResponse = await ShopifyService.getProducts();
                const shopifyInventory = shopifyResponse.data.data.products.edges;

                shopifyMatch = shopifyInventory.find(
                    (item) => item.node.title.toLowerCase() === scryfallCardData.name.toLowerCase()
                );

                if (shopifyMatch) {
                    setShopifyProduct(shopifyMatch.node);
                } else {
                    setShopifyProduct(null);
                }
            }

            if (scryfallCardData) {
                setCard(scryfallCardData);
            } else if (shopifyMatch) {
                // Fallback nel caso la carta non esista su scryfall ma l'abbiamo su Shopify
                setCard({
                    id: decodedId,
                    name: shopifyMatch.node.title,
                    image_uris: { normal: shopifyMatch.node.images?.edges[0]?.node?.url },
                    set: "Sconosciuta",
                    rarity: "Sconosciuta",
                    oracle_text: shopifyMatch.node.description || "Nessun dettaglio extra disponibile da Scryfall."
                });
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
        <div className="min-h-screen bg-neutral-950 text-slate-100 py-12 px-4">
            <div className="max-w-4xl mx-auto mb-6">
                <Link to="/products">
                    <button
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2 px-4 rounded-lg transition-colors border border-slate-700"
                    >
                        ← Torna al Catalogo
                    </button>
                </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
                {/* Immagine Grande */}
                <div className="flex-shrink-0 mx-auto md:mx-0 relative">
                    {shopifyProduct && (
                        <span className="absolute top-4 left-4 bg-emerald-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-md z-10 animate-pulse">
                            🟢 Disponibile in Negozio
                        </span>
                    )}
                    <img
                        src={card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || "https://images.scryfall.com/cards/art_crop/front/a/e/ae5107c8-d32d-470b-9b7d-35529c165380.jpg"}
                        alt={card.name}
                        className="w-72 md:w-80 h-auto object-contain rounded-xl shadow-md"
                    />
                </div>

                {/* Dettagli Informativi */}
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">{card.name}</h1>
                        <p className="text-sm font-semibold text-slate-400 mb-4">
                            Espansione: <span className="uppercase text-amber-500">{card.set}</span> — Rarity: <span className="capitalize">{card.rarity}</span>
                        </p>

                        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 mb-6">
                            <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">Testo della Carta (Oracle Text)</h3>
                            <p className="text-slate-300 text-sm whitespace-pre-line font-medium leading-relaxed">
                                {card.oracle_text || "Nessun testo presente per questa carta."}
                            </p>
                        </div>
                    </div>

                    {/* SEZIONE PREZZI */}
                    <div className="border-t border-slate-800 pt-4 mt-4">
                        {shopifyProduct ? (
                            <div className="bg-amber-900/10 border border-amber-900/30 rounded-xl p-4 mb-4">
                                <h4 className="text-xs font-bold text-amber-500 uppercase mb-1">Prezzo nel nostro Store</h4>
                                <div className="text-3xl font-black text-amber-400 mb-2">
                                    {parseFloat(shopifyProduct.priceRange.minVariantPrice.amount).toFixed(2)} {shopifyProduct.priceRange.minVariantPrice.currencyCode}
                                </div>

                                {/* Mostra la quantità a magazzino del prodotto in un badge */}
                                {shopifyProduct.variants?.edges?.[0]?.node?.quantityAvailable > 0 && (
                                    <div className="text-xs font-bold text-emerald-400 mb-4 bg-emerald-900/20 border border-emerald-800/50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-sm">
                                        📦 Disponibili a magazzino: {shopifyProduct.variants.edges[0].node.quantityAvailable} pezzi
                                    </div>
                                )}

                                {/* 3. Colleghiamo la nostra funzione di aggiunta al click */}
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 px-4 rounded-xl transition-colors shadow-sm"
                                >
                                    🛒 Aggiungi al Carrello
                                </button>
                                {/* LINK DI TEST TEMPORANEO */}
                                <Link to="/cart" className="block text-center text-sm font-bold text-amber-500 hover:underline mt-4">
                                    Vai al Carrello →
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 mb-4 text-slate-400 text-sm font-medium">
                                🛑 Questa carta non è attualmente disponibile nel nostro magazzino.
                            </div>
                        )}

                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Valutazione Storica di Mercato (Scryfall)</h4>
                        <div className="flex gap-4 text-slate-300 font-bold text-sm">
                            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">🇺🇸 {card.prices?.usd ? `$${card.prices.usd}` : "N/D"}</div>
                            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">🇪🇺 {card.prices?.eur ? `€${card.prices.eur}` : "N/D"}</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductPage;