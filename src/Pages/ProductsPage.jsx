// src/Pages/ProductsPage.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // Importiamo useSearchParams per leggere i parametri URL
import ScryfallService from "../Services/ScryfallService";
import ShopifyService from "../Services/ShopifyService"; // 1. Importiamo il servizio Shopify
import ScryfallCard from "../Components/ScryfallCard";

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlQuery = searchParams.get("q");

    const [query, setQuery] = useState(urlQuery || "");
    const [cards, setCards] = useState([]);
    const [shopifyProducts, setShopifyProducts] = useState([]); // Stato per il magazzino Shopify
    const [loading, setLoading] = useState(false);

    // Funzione per caricare i prodotti dal nostro negozio Shopify
    const fetchShopifyInventory = async () => {
        try {
            const response = await ShopifyService.getProducts();
            const productsFromShopify = response.data.data.products.edges;
            setShopifyProducts(productsFromShopify);
            console.log("🏪 Magazzino Shopify caricato:", productsFromShopify);
        } catch (error) {
            console.error("❌ Errore nel caricamento del magazzino Shopify:", error);
        }
    };

    // Carichiamo l'inventario Shopify non appena la pagina si monta, come da blueprint
    useEffect(() => {
        fetchShopifyInventory();
    }, []);

    // Avvia la ricerca automatica se c'è una query nell'URL (ad es. cliccando da SetsPage)
    useEffect(() => {
        if (urlQuery) {
            setQuery(urlQuery);
            const performUrlSearch = async () => {
                setLoading(true);
                try {
                    const response = await ScryfallService.searchCards(urlQuery);
                    setCards(response.data.data);
                } catch (error) {
                    console.error("❌ Errore durante la ricerca automatica dell'URL:", error);
                    setCards([]);
                } finally {
                    setLoading(false);
                }
            };
            performUrlSearch();
        }
    }, [urlQuery]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        // Aggiorna anche il parametro URL per mantenere coerente lo stato e consentire condivisione link
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

    // Funzione di controllo: verifica se l'ID Scryfall è presente nei prodotti Shopify
    // Nota: Per ora confrontiamo i titoli per semplicità di test, poi useremo i codici/ID precisi!
    const checkIfPresent = (cardName) => {
        return shopifyProducts.some(
            (item) => item.node.title.toLowerCase() === cardName.toLowerCase()
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-black text-gray-900 mb-6 text-center">
                Catalogo Globale Magic 🃏
            </h1>

            {/* Barra di ricerca */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8 flex gap-2">
                <input
                    type="text"
                    placeholder="Cerca una carta (es. Black Lotus)..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                    {loading ? "Cerca..." : "Cerca"}
                </button>
            </form>

            {/* Griglia dei Risultati */}
            {loading ? (
                <div className="text-center text-gray-600 font-medium">Caricamento in corso...</div>
            ) : (
                <div className="flex flex-wrap gap-6 justify-center">
                    {cards.map((card) => (
                        <ScryfallCard 
                            card={card} 
                            key={card.id} 
                            // Passiamo il risultato del controllo come prop booleana
                            isPresent={checkIfPresent(card.name)} 
                        />
                    ))}
                </div>
            )}

            <div className="text-center text-gray-500 mt-4">
                {cards.length === 0 && !loading && (
                    <p>Digita il nome di una carta in inglese e premi Cerca per esplorare.</p>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;