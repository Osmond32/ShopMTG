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
                !set.code.startsWith("y") &&
                set.card_count > 0 // Esclude set futuri vuoti
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

    if (loading) return <div className="text-center py-12 text-slate-400 font-medium min-h-screen bg-neutral-950">Chargement des extensions...</div>;
    if (error) return <div className="text-center py-12 text-red-500 min-h-screen bg-neutral-950">Erreur : {error}</div>;

    return (
        <div className="min-h-screen bg-neutral-950 text-slate-100 py-12 px-6">
            <div className="max-w-6xl mx-auto mb-10 text-center">
                
                <h1 className="text-4xl font-black text-white mt-3 mb-2">Les Extensions de Magic</h1>
                <p className="text-slate-400 max-w-xl mx-auto text-sm">
                    Parcourez l'histoire de Magic: The Gathering à travers les extensions et les blocs publiés au fil des ans.
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