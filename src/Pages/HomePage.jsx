// src/Pages/HomePage.jsx
import { useEffect, useState } from "react";
import ShopifyService from "../Services/ShopifyService";

const HomePage = () => {
    // Stato locale per contenere i prodotti che arriveranno da Shopify
    const [products, setProducts] = useState([]);

    // Funzione asincrona che si occupa di chiamare il servizio, come da metodo di lavoro
    const fetchShopifyProducts = async () => {
        try {
            const response = await ShopifyService.getProducts();
            
            // GraphQL restituisce i dati dentro una struttura fissa: data.products.edges
            const dataReceived = response.data.data.products.edges;
            
            console.log("🃏 Carte Magic ricevute da Shopify:", dataReceived);
            setProducts(dataReceived);
        } catch (error) {
            console.error("❌ Errore durante il recupero dei prodotti:", error);
        }
    };

    // L'effetto si attiva una sola volta al montaggio della pagina
    useEffect(() => {
        fetchShopifyProducts();
    }, []);

    return (
        <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-slate-800">
                Magic E-Commerce Portfolio 🃏
            </h1>
            <p className="text-gray-600 mt-2">
                Controlla la console del browser (F12) per vedere i dati!
            </p>
        </div>
    );
};

export default HomePage;