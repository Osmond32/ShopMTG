// src/Pages/HomePage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    
    // Stati per gestire i filtri della barra di ricerca avanzata
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedType, setSelectedType] = useState("");

    // Funzione che scatterà quando l'utente preme "Cerca"
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Per ora simuliamo il click stampando i filtri. 
        // Successivamente collegheremo questa logica a Scryfall!
        console.log("🔍 Ricerca avviata con:", { searchQuery, selectedColor, selectedType });
        
        // Esempio: potremmo reindirizzare l'utente su una pagina risultati passandogli i parametri nell'URL
        // navigate(`/search?q=${searchQuery}&color=${selectedColor}&type=${selectedType}`);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            
            {/* 1. HERO SECTION (BANNER) */}
            <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 py-20 px-6 border-b border-slate-800 text-center overflow-hidden">
                {/* Un leggero bagliore color ambra sullo sfondo per fare atmosfera fantasy */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative max-w-3xl mx-auto z-10">
                    <span className="text-amber-500 text-xs font-bold uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                        Collezione & Compravendita
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mt-4 mb-6">
                        Il Tempio delle Carte <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                            Magic: The Gathering
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl font-medium mb-8 leading-relaxed max-w-2xl mx-auto">
                        Esplora l'intero database storico di Scryfall, filtra le carte per strategie e acquista i pezzi unici disponibili nel nostro magazzino privato.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link 
                            to="/products" 
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-amber-500/20"
                        >
                            🛒 Visita il Magazzino
                        </Link>
                        <a 
                            href="#search-panel" 
                            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-xl border border-slate-700 transition-all"
                        >
                            🔍 Ricerca Avanzata
                        </a>
                    </div>
                </div>
            </div>

            {/* 2. SEZIONE FILTRI AVANZATI */}
            <div id="search-panel" className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-white mb-2">Filtra l'Universo di Magic</h2>
                        <p className="text-sm text-slate-400">Trova la carta perfetta combinando nome, colore dell'identità di mana e tipologia.</p>
                    </div>

                    <form onSubmit={handleSearchSubmit} className="space-y-4">
                        {/* Riga 1: Barra di testo principale */}
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Nome della carta</label>
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Es. Black Lotus, Counterspell, Ragavan..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                            />
                        </div>

                        {/* Riga 2: Selezione Colori e Tipi affiancati */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Filtro Colore */}
                            <div className="flex flex-col">
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Identità di Colore</label>
                                <select 
                                    value={selectedColor}
                                    onChange={(e) => setSelectedColor(e.target.value)}
                                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                                >
                                    <option value="">Tutti i colori</option>
                                    <option value="W">⚪ Bianco (White)</option>
                                    <option value="U">🔵 Blu (Blue)</option>
                                    <option value="B">⚫ Nero (Black)</option>
                                    <option value="R">🔴 Rosso (Red)</option>
                                    <option value="G">🟢 Verde (Green)</option>
                                    <option value="C">🐨 Incolore (Colorless)</option>
                                </select>
                            </div>

                            {/* Filtro Tipo */}
                            <div className="flex flex-col">
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Tipo di Carta</label>
                                <select 
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                                >
                                    <option value="">Tutti i tipi</option>
                                    <option value="creature">Creatura</option>
                                    <option value="instant">Istantaneo</option>
                                    <option value="sorcery">Stregoneria</option>
                                    <option value="enchantment">Incantesimo</option>
                                    <option value="artifact">Artefatto</option>
                                    <option value="planeswalker">Planeswalker</option>
                                    <option value="land">Terra</option>
                                </select>
                            </div>
                        </div>

                        {/* Pulsante di invio */}
                        <div className="pt-4">
                            <button 
                                type="submit"
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black py-3 px-4 rounded-xl transition-all shadow-md"
                            >
                                Avvia Ricerca nel Multiverso
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default HomePage;