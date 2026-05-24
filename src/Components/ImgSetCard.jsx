// src/Components/ImgSetCard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ScryfallService from "../Services/ScryfallService";

// Cache in-memory per memorizzare gli URL delle immagini di copertina già caricati.
// Questo evita di fare chiamate API doppie quando l'utente scorre su e giù.
const setCoverCache = {};

// Helper per generare un gradiente deterministico basato sul codice del set.
// Offre un'estetica premium anche prima del caricamento dell'immagine o come fallback.
const getDeterministicGradient = (code) => {
    const gradients = [
        "from-indigo-900/40 to-slate-900/80 hover:border-indigo-500/40",
        "from-emerald-900/40 to-slate-900/80 hover:border-emerald-500/40",
        "from-amber-900/40 to-slate-900/80 hover:border-amber-500/40",
        "from-purple-900/40 to-slate-900/80 hover:border-purple-500/40",
        "from-rose-900/40 to-slate-900/80 hover:border-rose-500/40",
        "from-cyan-900/40 to-slate-900/80 hover:border-cyan-500/40"
    ];
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
        hash = code.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
};

const ImgSetCard = ({ set }) => {
    const navigate = useNavigate();
    const cardRef = useRef(null);

    // Stati per gestire il caricamento dell'immagine
    const [coverUrl, setCoverUrl] = useState(setCoverCache[set.code] || null);
    const [loadingImg, setLoadingImg] = useState(!setCoverCache[set.code]);
    const [isVisible, setIsVisible] = useState(false);

    // 1. Lazy Loading con IntersectionObserver
    useEffect(() => {
        // Se l'immagine è già in cache, la consideriamo già "visibile" per saltare l'observer
        if (setCoverCache[set.code]) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Una volta visibile, scolleghiamo l'osservatore
                }
            },
            {
                rootMargin: "150px", // Inizia a caricare 150px prima di entrare nel viewport per fluidità
                threshold: 0.01
            }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [set.code]);

    // 2. Chiamata API controllata (solo se visibile e non in cache)
    useEffect(() => {
        if (!isVisible || setCoverCache[set.code]) return;

        let isMounted = true;
        setLoadingImg(true);

        // Proviamo a cercare le carte booster per trovare una copertina eccezionale ordinata per popolarità (EDHREC)
        ScryfallService.getSetCoverCard(set.code)
            .catch(() => {
                // Fallback: se fallisce (es. mazzi speciali, set promozionali senza bustine), cerchiamo qualsiasi carta del set
                return ScryfallService.searchCards(`set:${set.code}`);
            })
            .then((res) => {
                if (!isMounted) return;
                
                const cards = res.data?.data;
                if (cards && cards.length > 0) {
                    // Troviamo la prima carta che contiene immagini valide
                    const cardWithImg = cards.find((c) => c.image_uris?.art_crop || c.image_uris?.normal);
                    if (cardWithImg) {
                        const imgUrl = cardWithImg.image_uris.art_crop || cardWithImg.image_uris.normal;
                        setCoverCache[set.code] = imgUrl; // Salva in cache
                        setCoverUrl(imgUrl);
                    }
                }
            })
            .catch((err) => {
                console.warn(`[SetsPage] Impossibile caricare copertina per set ${set.code}:`, err);
            })
            .finally(() => {
                if (isMounted) setLoadingImg(false);
            });

        return () => {
            isMounted = false;
        };
    }, [isVisible, set.code]);

    // Gradiente di sfondo personalizzato in caso di mancanza dell'immagine
    const gradientClasses = getDeterministicGradient(set.code);

    // Formattiamo la data di rilascio
    const releaseYear = set.released_at ? set.released_at.split("-")[0] : "N/D";

    return (
        <div
            ref={cardRef}
            onClick={() => navigate(`/products?q=set:${set.code}`)}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientClasses} border border-slate-800/80 backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between h-56 group`}
        >
            {/* Immagine di sfondo caricata dinamicamente con alta visibilità e zoom morbido all'hover */}
            {coverUrl && (
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-95"
                    style={{
                        backgroundImage: `url(${coverUrl})`,
                    }}
                />
            )}

            {/* Overlay scuro calibrato: scuro in fondo per il testo, trasparente in alto per far risaltare l'illustrazione */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

            {/* Contenuto principale della card */}
            <div className="relative z-20 p-5 flex flex-col justify-between h-full">
                {/* Riga Superiore: Logo del Set e Codice */}
                <div className="flex justify-between items-start">
                    {/* SVG del set con filtro per renderlo visibile sul tema scuro */}
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-black/30">
                        <img
                            src={set.icon_svg_uri}
                            alt={set.name}
                            className="w-6 h-6 object-contain filter invert brightness-200 contrast-100 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                        />
                    </div>

                    <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 bg-slate-950/90 text-amber-400 rounded-md border border-slate-800/80 uppercase shadow-lg shadow-black/20">
                        {set.code}
                    </span>
                </div>

                {/* Info Centrali: Nome, Data e Conteggio Carte */}
                <div>
                    <h3 className="font-black text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        {set.name}
                    </h3>
                    
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1 bg-slate-950/40 px-2 py-0.5 rounded border border-slate-900">
                            📅 {releaseYear}
                        </span>
                        <span className="flex items-center gap-1 bg-slate-950/40 px-2 py-0.5 rounded border border-slate-900">
                            🃏 {set.card_count} carte
                        </span>
                    </div>
                </div>

                {/* Riga Inferiore: Link "Esplora" */}
                <div className="pt-3 border-t border-slate-800/50 flex justify-between items-center text-xs">
                    <span className="text-[11px] text-slate-500 font-semibold capitalize">
                        {set.set_type.replace("_", " ")}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-500 group-hover:text-amber-400 transition-colors">
                        Esplora Carte
                        <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                            →
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ImgSetCard;
