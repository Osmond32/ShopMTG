// src/Pages/ProductsPage.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ScryfallService from "../Services/ScryfallService";
import ShopifyService from "../Services/ShopifyService";
import ScryfallCard from "../Components/ScryfallCard";

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlQuery = searchParams.get("q");

    const [query, setQuery] = useState(urlQuery || "");
    const [cards, setCards] = useState([]); // Carte da ricerca Scryfall
    const [shopifyProducts, setShopifyProducts] = useState([]); // Magazzino reale Shopify
    const [loading, setLoading] = useState(false);

    // 1. Carichiamo l'inventario reale da Shopify all'avvio
    const fetchShopifyInventory = async () => {
        setLoading(true);
        try {
            const response = await ShopifyService.getProducts();
            const productsFromShopify = response.data.data.products.edges;

            // TRUCCO INTELLIGENTE: Trasformiamo i prodotti Shopify nel formato "Scryfall"
            // così il tuo componente <ScryfallCard /> funzionerà alla perfezione con entrambi!
            // Dentro src/Pages/ProductsPage.jsx (all'interno di fetchShopifyInventory)
            const mappedProducts = productsFromShopify.map(edge => {
                const p = edge.node;
                return {
                    id: p.id,
                    name: p.title,
                    type_line: p.description || "Carta in Magazzino",
                    image_uris: {
                        normal: p.images?.edges[0]?.node?.url || "https://images.scryfall.com/cards/art_crop/front/a/e/ae5107c8-d32d-470b-9b7d-35529c165380.jpg"
                    },
                    price: p.priceRange?.minVariantPrice?.amount || "0.00",
                    isFromShopify: true,
                    rawProduct: p // ✨ SALVIAMO L'OGGETTO ORIGINALE INTERO PER IL CHECKOUT
                };
            });

            setShopifyProducts(mappedProducts);
            console.log("🏪 Vetrina Shopify pronta:", mappedProducts);
        } catch (error) {
            console.error("❌ Errore nel caricamento del magazzino Shopify:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShopifyInventory();
    }, []);

    // 2. Ricerca automatica tramite parametro URL (es. se si clicca da un set)
    useEffect(() => {
        if (urlQuery) {
            setQuery(urlQuery);
            const performUrlSearch = async () => {
                setLoading(true);
                try {
                    const response = await ScryfallService.searchCards(urlQuery);
                    setCards(response.data.data);
                } catch (error) {
                    console.error("❌ Errore durante la ricerca URL:", error);
                    setCards([]);
                } finally {
                    setLoading(false);
                }
            };
            performUrlSearch();
        } else {
            // Se l'URL viene svuotato, azzeriamo la ricerca globale per mostrare di nuovo la vetrina
            setCards([]);
        }
    }, [urlQuery]);

    // 3. Gestione della ricerca manuale
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            // Se l'utente preme cerca a vuoto, resettiamo e mostriamo la vetrina
            setSearchParams({});
            setCards([]);
            return;
        }

        setSearchParams({ q: query });
        setLoading(true);
        try {
            const response = await ScryfallService.searchCards(query);
            setCards(response.data.data);
        } catch (error) {
            console.error("❌ Errore durante la ricerca:", error);
            setCards([]);
        } finally {
            setLoading(false);
        }
    };

    // Capiamo quali carte mostrare: se l'utente ha cercato qualcosa mostriamo i risultati di Scryfall,
    // altrimenti mostriamo SUBITO la vetrina dei prodotti Shopify!
    // Se c'è una query attiva, mostriamo i risultati Scryfall (anche se array vuoto mentre carica).
    const cardsToDisplay = query ? cards : shopifyProducts;

    // Funzione di controllo per accendere il bollino "Disponibile" quando cerchi su Scryfall
    const checkIfPresent = (cardName) => {
        return shopifyProducts.some(item => item.name.toLowerCase() === cardName.toLowerCase());
    };

    // Ottiene il numero di copie disponibili per la carta nel nostro store
    const getAvailableQuantity = (card) => {
        if (card.isFromShopify && card.rawProduct) {
            return card.rawProduct.variants?.edges?.[0]?.node?.quantityAvailable || 0;
        }
        // Se arriva da Scryfall, cerchiamo il prodotto corrispondente in Shopify
        const match = shopifyProducts.find(
            (item) => item.name.toLowerCase() === card.name.toLowerCase()
        );
        if (match && match.rawProduct) {
            return match.rawProduct.variants?.edges?.[0]?.node?.quantityAvailable || 0;
        }
        return 0;
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-slate-100 py-12 px-4">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 text-center">
                {cards.length > 0 ? "Risultati Ricerca Globale 🃏" : "Il Nostro Magazzino Reale 🏪"}
            </h1>
            <p className="text-center text-slate-400 text-sm mb-8">
                {cards.length > 0
                    ? "Esplorando il database mondiale di Magic."
                    : "Sfoglia le carte attualmente disponibili in negozio e pronte all'acquisto."}
            </p>

            {/* Barra di ricerca sempre presente in cima per esplorare altro */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto mb-12 flex gap-2">
                <input
                    type="text"
                    placeholder="Cerca un'altra carta nel multiverso..."
                    className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black py-3 px-6 rounded-xl transition-all"
                >
                    Cerca
                </button>
            </form>

            {/* Griglia Dinamica */}
            {loading ? (
                <div className="text-center text-slate-400 font-medium py-12">
                    Caricamento del Magazzino...
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {cardsToDisplay.map((card) => (
                        <ScryfallCard
                            card={card}
                            key={card.id}
                            // Se la carta è già un prodotto della vetrina è sicuramente presente,
                            // altrimenti facciamo il controllo sul nome
                            isPresent={card.isFromShopify || checkIfPresent(card.name)}
                            availableQuantity={getAvailableQuantity(card)}
                        />
                    ))}
                </div>
            )}

            {/* Messaggio se lo store Shopify è vuoto e non si è cercato nulla */}
            {cardsToDisplay.length === 0 && !loading && (
                <div className="text-center text-slate-500 mt-12 max-w-sm mx-auto text-sm bg-slate-900/50 border border-slate-900 p-6 rounded-2xl">
                    <p>Il magazzino è attualmente vuoto. Carica dei prodotti su Shopify per vederli apparire qui!</p>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;