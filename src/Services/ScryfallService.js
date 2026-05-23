
import axios from "axios";
import { SCRYFALL_BASE_URL } from "./config";


function searchCards(query) {

    return axios.get(`${SCRYFALL_BASE_URL}/cards/search?q=${encodeURIComponent(query)}`);
}

/**
 * Recupera i dettagli artistici e di mercato di una singola carta tramite il suo ID Scryfall.
 */
function getCardById(id) {
    return axios.get(`${SCRYFALL_BASE_URL}/cards/${id}`);
}

// Esportiamo i metodi del servizio come da blueprint
export default {
    searchCards,
    getCardById
};