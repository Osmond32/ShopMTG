

// Estraiamo in modo sicuro le variabili dal file .env gestito da Vite
const STORE_NAME = import.meta.env.VITE_SHOPIFY_STORE_NAME;
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

// URL base centrale per l'API GraphQL di Shopify
export const SHOPIFY_ENDPOINT = `https://${STORE_NAME}/api/2024-01/graphql.json`;

// Header centralizzati per l'autenticazione delle richieste, come da blueprint
export const SHOPIFY_HEADER = {
    headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN
    }
};

export const SCRYFALL_BASE_URL = "https://api.scryfall.com";

