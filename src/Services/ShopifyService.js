// src/Services/ShopifyService.js
import axios from "axios";
import { SHOPIFY_ENDPOINT, SHOPIFY_HEADER } from "./config";

/**
 * Recupera i prodotti (le carte Magic) dal catalogo Shopify.
 * Utilizza una query GraphQL per richiedere solo i dati necessari.
 */
function getProducts() {
  // Questo è il "foglietto" con la richiesta GraphQL in formato stringa
  const graphQLQuery = {
    query: `
      query {
        products(first: 10) {
          edges {
            node {
              id
              title
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
            }
          }
        }
      }
    `
  };

  // Inviamo la richiesta POST all'endpoint unico, passando la query e gli header di sicurezza
  return axios.post(SHOPIFY_ENDPOINT, graphQLQuery, SHOPIFY_HEADER);
}

// Esportiamo il servizio come oggetto per renderlo utilizzabile dalle Pagine, come da blueprint
export default {
  getProducts
};