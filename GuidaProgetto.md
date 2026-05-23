# 📚 Guida Architetturale e Operativa – Progetto React/Vite

## Sommario

- [Struttura del progetto](#struttura-del-progetto)
- [Architettura e convenzioni](#architettura-e-convenzioni)
- [Gestione dei Componenti](#gestione-dei-componenti)
- [Gestione delle Pagine](#gestione-delle-pagine)
- [Servizi (Services)](#servizi-services)
- [Gestione delle dipendenze](#gestione-delle-dipendenze)
- [Configurazioni principali](#configurazioni-principali)
- [Esempi di codice](#esempi-di-codice)
- [Best practices](#best-practices)

---

## Struttura del progetto

```
allo-cine/
│
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── assets/
│   ├── Components/
│   │   ├── NavBar.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MoviesCarousel.jsx
│   │   ├── Paginations.jsx
│   │   ├── PeopleCard.jsx
│   │   └── ... (altri componenti)
│   ├── Pages/
│   │   ├── HomePage.jsx
│   │   ├── MoviesPage.jsx
│   │   ├── MoviePage.jsx
│   │   ├── GenrePage.jsx
│   │   ├── FavoritePage.jsx
│   │   ├── WatchListPage.jsx
│   │   ├── PeoplesPage.jsx
│   │   ├── PeoplePage.jsx
│   │   └── SearchPage.jsx
│   └── Services/
│       ├── config.js
│       ├── MoviesService.js
│       ├── GenreService.js
│       └── PeoplesService.js
├── package.json
├── vite.config.js
├── eslint.config.js
├── index.html
└── README.md
```

---

## Architettura e convenzioni

- **React + Vite**: Progetto creato con Vite per sviluppo rapido e HMR.
- **Componenti riutilizzabili**: Tutti i componenti UI sono in `src/Components`.
- **Pagine**: Ogni pagina principale ha un file dedicato in `src/Pages`.
- **Services**: Tutte le chiamate API sono centralizzate in `src/Services` per separare la logica di business dalla UI.
- **Routing**: Gestito con `react-router-dom` e dichiarato in `App.jsx`.
- **Stato locale**: Gestito con gli hook di React (`useState`, `useEffect`).
- **Stilizzazione**: Bootstrap e file CSS custom.

---

## Gestione dei Componenti

- **Componenti presentazionali**: Ricevono dati tramite props e non gestiscono logica di business.
- **Componenti con logica**: Usano gli hook per fetch, stato, navigazione.
- **Esempio**: `MovieCard.jsx` visualizza un film e gestisce la navigazione al dettaglio.

```jsx
const MovieCard = ({movie}) => {
  const navigate = useNavigate();
  return (
    <Card onClick={() => navigate("/movie/" + movie.id)}>
      <Card.Img src={"https://image.tmdb.org/t/p/original" + movie.poster_path} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Button onClick={() => navigate("/movie/" + movie.id)}>Voir plus</Button>
      </Card.Body>
    </Card>
  );
};
```

---

## Gestione delle Pagine

- Ogni pagina (`HomePage`, `MoviesPage`, ecc.) si occupa di:
  - Chiamare i servizi per recuperare dati.
  - Gestire lo stato locale.
  - Comporre i componenti presentazionali.
- **Routing** centralizzato in `App.jsx`:

```jsx
<BrowserRouter>
  <NavBar />
  <Routes>
    <Route path='/' element={<HomePage />} />
    <Route path='/movies' element={<MoviesPage />} />
    {/* ...altre rotte */}
  </Routes>
</BrowserRouter>
```

---

## Servizi (Services)

- **Pattern**: Ogni servizio esporta funzioni per chiamate API, usando `axios`.
- **Configurazione**: Token, header e costanti sono centralizzati in `config.js`.
- **Esempio**: MoviesService.js

```js
import axios from "axios";
import { ACCOUNT_ID, HEADER } from './config';

function getMoviesPlaying() {
  return axios.get('https://api.themoviedb.org/3/movie/now_playing?language=it-IT', HEADER);
}

function addToFavorite(data) {
  return axios.post(`https://api.themoviedb.org/3/account/${ACCOUNT_ID}/favorite`, data, HEADER);
}

export default {
  getMoviesPlaying,
  addToFavorite,
  // ...altre funzioni
};
```

---

## Gestione delle dipendenze

### Dipendenze principali (`package.json`)

- **React**: UI library
- **Vite**: Dev server e build tool
- **axios**: HTTP client
- **react-bootstrap**: Componenti UI Bootstrap per React
- **react-router-dom**: Routing
- **eslint**: Linting
- **@vitejs/plugin-react**: Plugin Vite per React

```json
"dependencies": {
  "axios": "^1.12.2",
  "bootstrap": "^5.3.8",
  "react": "^19.1.1",
  "react-bootstrap": "^2.10.10",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.9.4"
}
```

---

## Configurazioni principali

### Vite (`vite.config.js`)

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### ESLint (`eslint.config.js`)

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
```

### Configurazione API (`src/Services/config.js`)

```js
export const TOKEN = "TOKEN_HERE";
export const ACCOUNT_ID = "ACCOUNT_ID_HERE";
export const HEADER = {
  headers: {
    "Authorization": "Bearer " + TOKEN
  }
};
```

### HTML principale (`index.html`)

- Carica Bootstrap, font e monta React su `<div id="root"></div>`.
- Script di ingresso: `/src/main.jsx`

---

## Best practices

- **Centralizza le chiamate API** nei servizi.
- **Componenti riutilizzabili** e presentazionali.
- **Gestione dello stato** solo dove serve.
- **Routing chiaro** e centralizzato.
- **Stilizzazione**: usa Bootstrap e classi custom.
- **Linting**: configura ESLint per mantenere il codice pulito.
- **Gestione delle pagine**: ogni pagina si occupa solo della propria logica e UI.

---

## Esempi di pattern ricorrenti

### Fetch dati in una pagina

```jsx
const [movies, setMovies] = useState([]);
useEffect(() => {
  MoviesService.getMoviesPlaying().then(response => setMovies(response.data.results));
}, []);
```

### Navigazione programmatica

```jsx
const navigate = useNavigate();
<Button onClick={() => navigate('/movie/' + movie.id)}>Voir plus</Button>
```

### Uso della paginazione

```jsx
<Paginations currentPage={currentPage} setCurrentPage={setCurrentPage} maxPages={maxPages} />
```

---

## Come riutilizzare questa architettura

1. **Copia la struttura delle cartelle** e i file di configurazione.
2. **Crea i servizi** per ogni risorsa API.
3. **Crea componenti riutilizzabili** per UI e logica comune.
4. **Organizza le pagine** in `src/Pages`.
5. **Configura le dipendenze** in `package.json`.
6. **Adotta le stesse convenzioni** per routing, fetch, stato e stile.

---

**Questa guida può essere adattata e ampliata per progetti futuri, garantendo coerenza e scalabilità.** Se vuoi aggiungere altre sezioni (test, deploy, ecc.), chiedi pure!
