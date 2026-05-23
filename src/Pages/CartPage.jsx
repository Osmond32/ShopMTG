// src/Pages/CartPage.jsx
import React, { useState } from "react";
import { useCart } from "../Context/CartContext";
import ShopifyService from "../Services/ShopifyService";

const CartPage = () => {
    const { cart, clearCart } = useCart();
    const [loading, setLoading] = useState(false);

    // Calcoliamo il prezzo totale degli elementi nel carrello
    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.priceRange.minVariantPrice.amount);
            return total + (price * item.quantity);
        }, 0).toFixed(2);
    };

   const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
       const response = await ShopifyService.createCheckout(cart);
        
        // Controlliamo la nuova struttura dati (cartCreate)
        if (!response.data || !response.data.data || !response.data.data.cartCreate) {
            alert("❌ Errore di comunicazione con Shopify. Controlla la console.");
            console.error("Risposta malformata:", response.data);
            return;
        }

        const { cart: shopifyCart, userErrors } = response.data.data.cartCreate;

        // Gestione errori della nuova API
        if (userErrors && userErrors.length > 0) {
            alert(`❌ Errore Shopify: ${userErrors[0].message}`);
            return;
        }

        if (!shopifyCart || !shopifyCart.checkoutUrl) {
            alert("❌ Errore Critico: Sessione di pagamento non generata.");
            return;
        }

        // Tutto pronto! Svuotiamo il carrello locale e andiamo all'URL aggiornato
        clearCart();
        window.location.href = shopifyCart.checkoutUrl;

    } catch (error) {
        console.error("❌ Errore durante la creazione del checkout:", error);
        alert("Si è verificato un errore di rete durante il reindirizzamento.");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-black text-gray-900 mb-6 text-center">Il Tuo Carrello 🛒</h1>

            {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    Il tuo carrello è vuoto. Esplora il catalogo per aggiungere delle carte!
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    {/* Lista degli articoli */}
                    <div className="divide-y divide-gray-100 mb-6">
                        {cart.map((item) => (
                            <div key={item.id} className="py-4 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
                                    <p className="text-gray-500 text-sm">Quantità: {item.quantity}</p>
                                </div>
                                <div className="text-right font-black text-gray-900">
                                    {(parseFloat(item.priceRange.minVariantPrice.amount) * item.quantity).toFixed(2)} {item.priceRange.minVariantPrice.currencyCode}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totale e Azione */}
                    <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6">
                        <span className="text-gray-500 font-semibold">Totale Stimato:</span>
                        <span className="text-2xl font-black text-slate-950">
                            {calculateTotal()} {cart[0]?.priceRange.minVariantPrice.currencyCode}
                        </span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm text-center"
                    >
                        {loading ? "Generazione pagamento..." : "🔒 Procedi al Pagamento Sicuro"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartPage;