// src/Services/ShopifyService.js
import axios from "axios";
// Assicuriamoci di importare correttamente sia SHOPIFY_ENDPOINT che SHOPIFY_HEADERS
import { SHOPIFY_ENDPOINT, SHOPIFY_HEADERS } from "./config";

function getProducts() {
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
              variants(first: 1) {
                edges {
                  node {
                    id
                    quantityAvailable
                  }
                }
              }
            }
          }
        }
      }
    `
  };

  return axios.post(SHOPIFY_ENDPOINT, graphQLQuery, SHOPIFY_HEADERS);
}


function createCheckout(cartItems) {
  // Mappiamo gli articoli nel formato richiesto dalla Cart API di Shopify
  const lines = cartItems.map(item => ({
    merchandiseId: item.variants.edges[0].node.id, // ID della variante
    quantity: item.quantity
  }));

  const graphQLMutation = {
    query: `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      input: {
        lines: lines
      }
    }
  };

  return axios.post(SHOPIFY_ENDPOINT, graphQLMutation, SHOPIFY_HEADERS);
}

export default {
  getProducts,
  createCheckout
};