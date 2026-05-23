// src/Pages/SetsPage.jsx
import React, { useEffect, useState } from "react";
import ScryfallService from "../Services/ScryfallService";

const SetsPage = () => {
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSets = async () => {
        try {
            setLoading(true);
            const response = await ScryfallService.getSets();
            
            // Scryfall restituisce i set dentro un array chiamato .data
            // Filtriamo solo i set di tipo "core" o "expansion" per evitare di mostrare set minori o promozionali se preferisci, 
            // ma per ora prendiamo i principali per non appesantire.
            const allSets = response.data.data;
            
            // Prendiamo i primi 60 set storici per evitare di sovraccaricare la pagina al primo colpo
            setSets(allSets.slice(0, 60));
        } catch (error) {
            console.error("❌ Errore nel recupero dei set:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSets();
    }, []);

    if (loading) {
        return <div className="text-center py-12 text-slate-400 font-medium min-h-screen bg-slate-950">Caricamento espansioni...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
            <div className="max-w-6xl mx-auto mb-10 text-center">
                <span className="text-amber-500 text-xs font-bold uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    Cronologia Globale
                </span>
                <h1 className="text-4xl font-black text-white mt-3 mb-2">Le Espansioni di Magic</h1>
                <p className="text-slate-400 max-w-xl mx-auto text-sm">
                    Sfoglia la storia di Magic: The Gathering attraverso i set e i blocchi rilasciati nel corso degli anni.
                </p>
            </div>

            {/* Griglia dei Set */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {sets.map((set) => (
                    <div 
                        key={set.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold px-2 py-0.5 bg-slate-800 text-amber-400 rounded uppercase tracking-wider font-mono">
                                    {set.code}
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                    {set.released_at ? set.released_at.split("-")[0] : "N/D"}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                                {set.name}
                            </h3>
                            <p className="text-slate-500 text-xs mt-1 capitalize">
                                Tipo: {set.set_type.replace("_", " ")}
                            </p>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-slate-800 text-right">
                            <span className="text-xs text-slate-400 font-semibold group-hover:text-white transition-colors">
                                Esplora Carte →
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SetsPage;