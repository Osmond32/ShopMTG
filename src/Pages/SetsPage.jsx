// src/Pages/SetsPage.jsx
import React, { useEffect, useState } from "react";
import ScryfallService from "../Services/ScryfallService";
import ImgSetCard from "../Components/ImgSetCard"; // 1. Importiamo con il nuovo nome del file

const SetsPage = () => {
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSets = async () => {
        try {
            setLoading(true);
            const response = await ScryfallService.getSets();
            const allSets = response.data.data;
            
            const principalSets = allSets.filter(set => 
                (set.set_type === "expansion" || set.set_type === "core") && 
                !set.code.startsWith("y")
            );

            setSets(principalSets.slice(0, 150));
        } catch (error) {
            console.error("❌ Errore nel recupero dei set:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSets();
    }, []);

    if (loading) return <div className="text-center py-12 text-slate-400 font-medium min-h-screen bg-neutral-950">Caricamento espansioni...</div>;
    if (error) return <div className="text-center py-12 text-red-500 min-h-screen bg-neutral-950">Errore: {error}</div>;

    return (
        <div className="min-h-screen bg-neutral-950 text-slate-100 py-12 px-6">
            <div className="max-w-6xl mx-auto mb-10 text-center">
                <span className="text-amber-500 text-xs font-bold uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    Cronologia Globale
                </span>
                <h1 className="text-4xl font-black text-white mt-3 mb-2">Le Espansioni di Magic</h1>
                <p className="text-slate-400 max-w-xl mx-auto text-sm">
                    Sfoglia la storia di Magic: The Gathering attraverso i set e i blocchi rilasciati nel corso degli anni.
                </p>
            </div>

            {/* 2. Utilizziamo il componente ImgSetCard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {sets.map((set) => (
                    <ImgSetCard key={set.id} set={set} />
                ))}
            </div>
        </div>
    );
};

export default SetsPage;