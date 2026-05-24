import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroVideo from "../assets/Hero.mp4";
import LogoHero from "../assets/LogoHero.png";

const HomePage = () => {
    const navigate = useNavigate();
    
    // Stati per gestire i filtri della barra di ricerca avanzata
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedType, setSelectedType] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log("🔍 Ricerca avviata con:", { searchQuery, selectedColor, selectedType });
        // navigate(`/search?q=${searchQuery}&color=${selectedColor}&type=${selectedType}`);
    };

    const latestSets = [
        { name: "Bloomburrow", date: "Q3 2024", img: "https://images.unsplash.com/photo-1542838686-37ed7a95781a?q=80&w=600&auto=format&fit=crop" },
        { name: "Modern Horizons 3", date: "Giugno 2024", img: "https://images.unsplash.com/photo-1618365908648-e71bf571633e?q=80&w=600&auto=format&fit=crop" },
        { name: "Outlaws of Thunder Junction", date: "Aprile 2024", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop" },
        { name: "Murders at Karlov Manor", date: "Febbraio 2024", img: "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?q=80&w=600&auto=format&fit=crop" },
    ];

    const formats = [
        { name: "Commander", desc: "Gioca in multiplayer con il tuo generale e altri 99 alleati.", color: "from-amber-800 to-amber-950" },
        { name: "Standard", desc: "Costruisci mazzi con le espansioni più recenti e rimani al passo.", color: "from-blue-800 to-blue-950" },
        { name: "Modern", desc: "Il formato competitivo più amato. Usa carte dall'8a Edizione in poi.", color: "from-slate-800 to-slate-950" },
        { name: "Pauper", desc: "La vera essenza di Magic. Gioca usando esclusivamente carte comuni.", color: "from-green-800 to-green-950" },
    ];

    return (
        <div className="min-h-screen bg-neutral-950 text-slate-100 font-sans selection:bg-amber-500/30">
            
            {/* 1. HERO SECTION */}
            <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-neutral-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                {/* Background Video */}
                <video 
                    className="absolute inset-0 w-full h-full object-cover"
                    src={HeroVideo} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent"></div>
                
                {/* Logo in alto a destra */}
                <div className="absolute top-6 right-6 z-20">
                    <img src={LogoHero} alt="Hero Logo" className="w-48 md:w-64 lg:w-80 h-auto drop-shadow-2xl" />
                </div>

                {/* CTA Buttons - in basso a sinistra */}
                <div className="absolute bottom-12 md:bottom-20 left-8 md:left-20 z-20 flex flex-col sm:flex-row gap-4">
                    <Link 
                        to="/sets" 
                        className="bg-purple-700 hover:bg-purple-600 text-white font-black uppercase tracking-widest py-4 px-10 rounded-xl border-2 border-cyan-400 shadow-[0_0_15px_rgba(107,33,168,0.6)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all flex items-center justify-center"
                    >
                        Espansioni
                    </Link>
                    <Link 
                        to="/products" 
                        className="bg-white hover:bg-gray-200 text-black font-black uppercase tracking-widest py-4 px-10 rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center"
                    >
                        Magazzino
                    </Link>
                </div>
            </div>

            {/* 2. ULTIME USCITE (CAROUSEL / GRID) */}
            <div className="max-w-7xl mx-auto px-4 py-20 relative z-20 -mt-20">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>Ultime Espansioni</h2>
                        <div className="w-20 h-1 bg-amber-500 mt-2"></div>
                    </div>
                    <Link to="/products" className="text-amber-500 hover:text-amber-400 font-semibold text-sm hidden sm:block transition-colors">Vedi tutti i set &rarr;</Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {latestSets.map((set, i) => (
                        <div key={i} className="group relative rounded-lg overflow-hidden border border-slate-800 bg-slate-900 cursor-pointer hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                            <div className="h-48 w-full overflow-hidden">
                                <img src={set.img} alt={set.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                            </div>
                            <div className="p-5 absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-12">
                                <p className="text-amber-500 text-xs font-bold mb-1">{set.date}</p>
                                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors" style={{ fontFamily: "Georgia, serif" }}>{set.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. RICERCA E DATABASE */}
            <div id="database" className="py-24 bg-slate-900 relative border-y border-slate-800">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
                
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "Georgia, serif" }}>L'Archivio del Mago</h2>
                        <p className="text-slate-400 text-lg">Cerca tra migliaia di carte. Trova la strategia perfetta per il tuo mazzo.</p>
                    </div>

                    <form onSubmit={handleSearchSubmit} className="bg-slate-950/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 uppercase tracking-widest mb-3">Nome Carta</label>
                                <input 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Es. Loto Nero, Contromagia, Jace..."
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-5 py-4 text-white text-lg placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 uppercase tracking-widest mb-3">Identità Mana</label>
                                    <div className="flex gap-2">
                                        {[
                                            { id: 'W', color: 'bg-white text-slate-900', label: 'W' },
                                            { id: 'U', color: 'bg-blue-500 text-white', label: 'U' },
                                            { id: 'B', color: 'bg-slate-800 text-white border border-slate-600', label: 'B' },
                                            { id: 'R', color: 'bg-red-500 text-white', label: 'R' },
                                            { id: 'G', color: 'bg-green-600 text-white', label: 'G' },
                                            { id: 'C', color: 'bg-slate-400 text-slate-900', label: 'C' }
                                        ].map(mana => (
                                            <button 
                                                key={mana.id}
                                                type="button"
                                                onClick={() => setSelectedColor(selectedColor === mana.id ? '' : mana.id)}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all ${mana.color} ${selectedColor === mana.id ? 'ring-2 ring-offset-2 ring-offset-slate-950 ring-amber-500 scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'}`}
                                                title={`Colore ${mana.id}`}
                                            >
                                                {mana.label}
                                            </button>
                                        ))}
                                    </div>
                                    <input type="hidden" value={selectedColor} name="color" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-300 uppercase tracking-widest mb-3">Tipo Carta</label>
                                    <select 
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none cursor-pointer"
                                        style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem top 50%", backgroundSize: "0.65rem auto" }}
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

                            <button 
                                type="submit"
                                className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-6 rounded-lg border border-slate-600 hover:border-amber-500 transition-all shadow-lg flex items-center justify-center gap-2 group"
                            >
                                <svg className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                Scansiona il Multiverso
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* 4. FORMATI DI GIOCO */}
            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "Georgia, serif" }}>Scegli il tuo Campo di Battaglia</h2>
                    <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {formats.map((format, i) => (
                        <div key={i} className={`relative rounded-xl p-8 bg-gradient-to-br ${format.color} overflow-hidden group cursor-pointer border border-white/10 shadow-xl min-h-[240px] flex flex-col`}>
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "Georgia, serif" }}>{format.name}</h3>
                                <p className="text-white/80 text-sm mb-6 flex-grow">{format.desc}</p>
                                <span className="text-white font-bold text-sm flex items-center gap-1 group-hover:text-amber-300 transition-colors mt-auto">
                                    Scopri di più <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default HomePage;