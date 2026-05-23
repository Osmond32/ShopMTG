# 🃏 Magic Cards E-Commerce - Guida al Progetto

Una guida completa per costruire un e-commerce di carte Magic usando **React**, **GraphQL** e **Shopify**.

---

## 📋 Indice

1. [Cos'è questo progetto](#cosè-questo-progetto)
2. [Architettura](#architettura)
3. [Setup iniziale](#setup-iniziale)
4. [GraphQL: Concetti Base](#graphql-concetti-base)
5. [Implementazione](#implementazione)
6. [API Integration](#api-integration)
7. [Prossimi step](#prossimi-step)
8. [Troubleshooting](#troubleshooting)

---

## Cos'è questo progetto?

Un e-commerce full-stack dove puoi:
- 🛍️ **Browsare** carte Magic da un catalogo Shopify
- 🔍 **Filtrare** per rarità, colore, costo
- 🛒 **Aggiungere al carrello** e comprare tramite Shopify
- 💾 **Sincronizzare** dati da API esterna (Magic The Gathering API)

**Stack Tecnologico:**
```
Frontend:  React 18 + Tailwind CSS
Query:     GraphQL (Shopify Storefront API)
Backend:   Shopify (no coding necessario)
API Esterna: Magic The Gathering API (scrapare dati veri)
```

---

## 🏗️ Architettura

```
┌─────────────────────────────────────────────────┐
│             React App (Vite/CRA)                │
│   - componenti per browsare prodotti            │
│   - carrello                                    │
│   - checkout                                    │
└──────────────┬──────────────────────────────────┘
               │ GraphQL Queries
               ▼
┌─────────────────────────────────────────────────┐
│      Shopify Storefront API (GraphQL)           │
│   - Catalogo prodotti                           │
│   - Inventario                                  │
│   - Checkout                                    │
└──────────────┬──────────────────────────────────┘
               │
        ┌──────┴────────┐
        ▼               ▼
   Shopify DB    Magic API
   (prodotti)    (dati carte)
```

---

## 🚀 Setup Iniziale

### 1️⃣ **Crea un Shopify Dev Store** (gratuito)

- Vai su https://www.shopify.com/it
- Clicca "Crea negozio" o "Prova gratuitamente"
- Crea un account con email (puoi usare Gmail)
- Completa il setup base (nome negozio, ecc.)

### 2️⃣ **Genera Access Token Storefront API**

Questa è la chiave che userà React per parlare con Shopify:

1. Nel tuo Shopify Admin, vai a: **Settings** → **Apps and integrations**
2. Clicca **Develop apps** (in alto a destra)
3. Clicca **Create an app**
   - Name: "Magic Cards React App"
   - Clicca **Create app**
4. Vai alla tab **Configuration**
5. Scorri a **Admin API access scopes** e cerca **Storefront API access scopes**
6. Attiva questi permessi:
   ```
   ✅ read_products
   ✅ read_product_variants
   ✅ read_orders
   ✅ write_orders
   ```
7. Clicca **Save**
8. Vai alla tab **API Credentials**
9. Copia il **Storefront API access token** (qualcosa come `eyJhbG...`)
10. Copia l'**Storefront API endpoint** (es. `https://tuonegozio.myshopify.com`)

**Salva questi dati in un file `.env`** nella root del progetto:
```env
VITE_SHOPIFY_STORE_NAME=tuonegozio.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=eyJhbG...
```

### 3️⃣ **Crea i prodotti (Carte Magic) in Shopify**

Nel Shopify Admin:

1. Vai a **Products**
2. Clicca **Add product**
3. Per ogni carta:
   - **Title**: "Black Lotus"
   - **Description**: "Una delle carte più rare di Magic"
   - **Price**: 50 (USD o EUR)
   - **Images**: carica un'immagine della carta
   - **Variants** (opzionale): es. "Condizione: Mint", "Condizione: Played"
   - Clicca **Save**

Almeno 5-10 prodotti per testare bene.

### 4️⃣ **Setup Progetto React**

```bash
npm create vite@latest magic-ecommerce -- --template react
cd magic-ecommerce
npm install

# Dipendenze che userai
npm install axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Struttura cartelle consigliata:**
```
magic-ecommerce/
├── src/
│   ├── api/
│   │   ├── shopifyClient.js      ← Qui farai le query GraphQL
│   │   └── magicApiClient.js     ← Qui chiami Magic API
│   ├── components/
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── Cart.jsx
│   │   └── Header.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   └── Checkout.jsx
│   ├── App.jsx
│   └── main.jsx
├── .env.local              ← I tuoi token (gitignore questo!)
└── package.json
```

---

## 📊 GraphQL: Concetti Base

### Cos'è GraphQL?

È un linguaggio per chiedere dati in modo preciso. Invece di ricevere **tutto** quello che il server decide, tu chiedi esattamente quello che ti serve.

**Analogia:**
- **REST**: Vai in biblioteca e il bibliotecario ti dà l'intero libro
- **GraphQL**: Tu chiedi "voglio solo la pagina 5 e il capitolo 3" e ricevi solo quello

### Struttura di una Query GraphQL

```graphql
query {
  products(first: 10) {          ← Chiedi i primi 10 prodotti
    edges {                        ← Formato Shopify (lista)
      node {                       ← Il prodotto vero
        id                         ← Questi campi
        title                      ← li chiedi
        priceRange {               ← tu esplicitamente
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
```

**Risposta:**
```json
{
  "data": {
    "products": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Product/123",
            "title": "Black Lotus",
            "priceRange": {
              "minVariantPrice": {
                "amount": "50.00",
                "currencyCode": "USD"
              }
            },
            "images": {
              "edges": [
                {
                  "node": {
                    "url": "https://cdn.shopify.com/..."
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }
}
```

### Come funziona in React?

```javascript
// 1. Scrivi la query
const query = `
  query {
    products(first: 10) {
      edges { node { id title } }
    }
  }
`;

// 2. La invii a Shopify tramite fetch
const response = await fetch(shopifyEndpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': token,
  },
  body: JSON.stringify({ query }),
});

// 3. Ricevi i dati formattati
const { data } = await response.json();
```

---

## 💻 Implementazione

### Step 1: Crea `src/api/shopifyClient.js`

Questo è il file che farà tutte le richieste GraphQL a Shopify:

```javascript
const SHOPIFY_STORE = import.meta.env.VITE_SHOPIFY_STORE_NAME;
const SHOPIFY_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

const SHOPIFY_ENDPOINT = `https://${SHOPIFY_STORE}/api/2024-01/graphql.json`;

/**
 * Funzione generica per fare query GraphQL
 * @param {string} query - La query GraphQL
 * @returns {Promise} I dati dalla risposta
 */
async function shopifyFetch(query, variables = {}) {
  const response = await fetch(SHOPIFY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();

  if (json.errors) {
    console.error('GraphQL errors:', json.errors);
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

/**
 * Fetch tutti i prodotti (carte Magic)
 */
export async function fetchAllProducts(first = 20) {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first, sortKey: TITLE) {
        edges {
          node {
            id
            title
            handle
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
                  altText
                }
              }
            }
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch(query, { first });
  return data.products.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    currency: node.priceRange.minVariantPrice.currencyCode,
    image: node.images.edges[0]?.node.url,
    altText: node.images.edges[0]?.node.altText,
    variants: node.variants.edges.map(({ node: v }) => ({
      id: v.id,
      title: v.title,
      price: parseFloat(v.price.amount),
      available: v.availableForSale,
    })),
  }));
}

/**
 * Fetch un singolo prodotto per handle
 */
export async function fetchProductByHandle(handle) {
  const query = `
    query GetProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
              }
              availableForSale
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch(query, { handle });
  return data.productByHandle;
}

/**
 * Crea un checkout (carrello)
 */
export async function createCheckout(lineItems = []) {
  const query = `
    mutation CreateCheckout($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
          lineItems(first: 10) {
            edges {
              node {
                id
                title
                quantity
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    input: {
      lineItems: lineItems.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    },
  };

  const data = await shopifyFetch(query, variables);
  return data.checkoutCreate.checkout;
}

export default { fetchAllProducts, fetchProductByHandle, createCheckout };
```

### Step 2: Crea un componente `ProductCard.jsx`

```javascript
// src/components/ProductCard.jsx
import React from 'react';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
      <img
        src={product.image}
        alt={product.altText || product.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold">
            {product.currency} {product.price}
          </span>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          🛒 Aggiungi al carrello
        </button>
      </div>
    </div>
  );
}
```

### Step 3: Crea la pagina `Products.jsx`

```javascript
// src/pages/Products.jsx
import React, { useEffect, useState } from 'react';
import { fetchAllProducts } from '../api/shopifyClient';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchAllProducts(20);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">🃏 Caricamento carte Magic...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Errore: {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">🃏 Magic Cards</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={(p) => console.log('Aggiunto:', p.title)}
          />
        ))}
      </div>
    </div>
  );
}
```

### Step 4: Configura `App.jsx`

```javascript
// src/App.jsx
import Products from './pages/Products';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Products />
    </div>
  );
}

export default App;
```

---

## 🔗 API Integration

### Aggiungere dati da Magic The Gathering API

Se vuoi arricchire i dati dei tuoi prodotti Shopify con info vere da Magic:

```javascript
// src/api/magicApiClient.js
export async function fetchMagicCardDetails(cardName) {
  try {
    const response = await fetch(
      `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`
    );
    
    if (!response.ok) {
      return null;
    }

    const card = await response.json();
    
    return {
      scryfallId: card.id,
      manaCost: card.mana_cost,
      type: card.type_line,
      text: card.oracle_text,
      power: card.power,
      toughness: card.toughness,
      rarity: card.rarity,
      setCode: card.set,
      imageUrl: card.image_uris?.normal,
    };
  } catch (error) {
    console.error('Errore Scryfall API:', error);
    return null;
  }
}
```

Poi nel tuo componente:
```javascript
useEffect(() => {
  async function loadMagicDetails() {
    const details = await fetchMagicCardDetails(product.title);
    if (details) {
      setCardDetails(details);
    }
  }
  
  loadMagicDetails();
}, [product.title]);
```

---

## 📝 Prossimi Step

### Fase 1: Base (Questa settimana)
- ✅ Setup Shopify dev store
- ✅ Crea 5-10 prodotti (carte Magic)
- ✅ Genera Storefront API token
- ✅ Implementa `fetchAllProducts`
- ✅ Mostra i prodotti in una grid

### Fase 2: Funzionalità (Prossima settimana)
- [ ] Aggiungi al carrello (state locale)
- [ ] Pagina dettagli prodotto
- [ ] Filtri/ricerca per nome, prezzo
- [ ] Integrazione Magic API (dati arricchiti)

### Fase 3: Checkout (Tra 2 settimane)
- [ ] Visualizza carrello
- [ ] Crea checkout Shopify
- [ ] Redirect a pagamento Shopify
- [ ] Pagina di conferma ordine

### Fase 4: Polish (Facoltativo)
- [ ] Deploy (Vercel o Netlify)
- [ ] Dark mode
- [ ] Animazioni con Framer Motion
- [ ] Dashboard admin custom

---

## 🐛 Troubleshooting

### "Errore: VITE_SHOPIFY_STORE_NAME non definito"
**Soluzione:** Assicurati che il file `.env.local` esista nella root del progetto con:
```env
VITE_SHOPIFY_STORE_NAME=tuonegozio.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=eyJhbG...
```

Riavvia il dev server: `npm run dev`

### "GraphQL error: Invalid access token"
**Soluzione:** 
- Controlla che il token nel `.env` sia corretto (copia-incolla dal Shopify Admin)
- Assicurati che il token sia di tipo **Storefront API**, non Admin API
- Rigeneralo se necessario

### "Nessun prodotto visualizzato"
**Soluzione:**
- Assicurati di aver creato almeno 1 prodotto in Shopify Admin
- Controlla nella console del browser gli errori GraphQL (F12 → Console)
- Verifica che il nome dello store nel `.env` sia corretto

### "CORS error: blocked by browser"
**Soluzione:**
- Shopify Storefront API dovrebbe permettere CORS di default
- Se continua, verifica che il token abbia i permessi giusti
- Non è un problema in produzione, solo in localhost

---

## 📚 Risorse Utili

- **Shopify GraphQL API Docs**: https://shopify.dev/docs/api/storefront
- **Scryfall Magic API**: https://scryfall.com/docs/api
- **GraphQL Guide**: https://graphql.org/learn/
- **React Hooks**: https://react.dev/reference/react

---

## 💡 Ricorda

- GraphQL è solo una sintassi per chiedere dati
- Shopify gestisce tutto il backend (database, pagamenti, ordini)
- Tu gestisci solo il frontend in React
- Non puoi alterare i dati Shopify con Storefront API (è read-only), per scrivere dati useresti Admin API

**Buona fortuna! 🚀**
