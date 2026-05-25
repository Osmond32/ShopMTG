// src/Pages/CartPage.jsx
import React, { useState } from "react";
import { useCart } from "../Context/CartContext";
import ShopifyService from "../Services/ShopifyService";

const CartPage = () => {
    const { cart, clearCart } = useCart();
    const [loading, setLoading] = useState(false);

    // FUNZIONE DI SICUREZZA: Estrae il prezzo correttamente in base alla struttura dell'oggetto
    const getItemPrice = (item) => {
        if (item.price) return parseFloat(item.price); // Formato semplificato (Nuovo)
        if (item.priceRange?.minVariantPrice?.amount) {
            return parseFloat(item.priceRange.minVariantPrice.amount); // Formato GraphQL (Vecchio)
        }
        return 0;
    };

    // FUNZIONE DI SICUREZZA: Estrae la valuta o mette EUR di default
    const getItemCurrency = (item) => {
        return item.priceRange?.minVariantPrice?.currencyCode || "EUR";
    };

    // Calcoliamo il prezzo totale degli elementi nel carrello usando la funzione sicura
    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const price = getItemPrice(item);
            return total + (price * item.quantity);
        }, 0).toFixed(2);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        setLoading(true);
        try {
            const response = await ShopifyService.createCheckout(cart);
            
            if (!response.data || !response.data.data || !response.data.data.cartCreate) {
                alert("❌ Erreur de communication avec Shopify. Veuillez vérifier la console.");
                console.error("Risposta malformata:", response.data);
                return;
            }

            const { cart: shopifyCart, userErrors } = response.data.data.cartCreate;

            if (userErrors && userErrors.length > 0) {
                alert(`❌ Erreur Shopify : ${userErrors[0].message}`);
                return;
            }

            if (!shopifyCart || !shopifyCart.checkoutUrl) {
                alert("❌ Erreur Critique : Session de paiement non générée.");
                return;
            }

            clearCart();
            window.location.href = shopifyCart.checkoutUrl;

        } catch (error) {
            console.error("❌ Errore durante la creazione del checkout:", error);
            alert("Une erreur réseau s'est produite lors de la redirection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-slate-100 py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                <h1 className="text-3xl font-black text-white mb-6 text-center">Votre Panier 🛒</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-slate-900/40 border border-slate-900 rounded-2xl">
                        Votre panier est vide. Explorez le catalogue pour ajouter des cartes !
                    </div>
                ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                        {/* Lista degli articoli */}
                        <div className="divide-y divide-slate-800 mb-6">
                            {cart.map((item) => (
                                <div key={item.id} className="py-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{item.title}</h3>
                                        <p className="text-slate-400 text-sm">Quantité : {item.quantity}</p>
                                    </div>
                                    <div className="text-right font-mono font-black text-amber-400">
                                        {(getItemPrice(item) * item.quantity).toFixed(2)} {getItemCurrency(item)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totale e Azione */}
                        <div className="border-t border-slate-800 pt-4 flex justify-between items-center mb-6">
                            <span className="text-slate-400 font-semibold">Total Estimé :</span>
                            <span className="text-2xl font-black text-white font-mono">
                                {calculateTotal()} {getItemCurrency(cart[0])}
                            </span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-700 disabled:to-slate-800 text-slate-950 font-black py-3.5 px-4 rounded-xl transition-all shadow-md text-center cursor-none"
                        >
                            {loading ? "Génération du paiement..." : "🔒 Procéder au Paiement Sécurisé"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;