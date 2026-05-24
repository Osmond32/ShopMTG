import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroVideo from "../assets/Hero.mp4";
import LogoHero from "../assets/LogoHero.png";
import ScryfallService from "../Services/ScryfallService";
import ImgSetCard from "../Components/ImgSetCard";

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

    const [latestSets, setLatestSets] = useState([]);
    const [loadingSets, setLoadingSets] = useState(true);

    useEffect(() => {
        const fetchLatestSets = async () => {
            try {
                const response = await ScryfallService.getSets();
                const allSets = response.data.data;
                const principalSets = allSets.filter(set => 
                    (set.set_type === "expansion" || set.set_type === "core") && 
                    !set.code.startsWith("y") &&
                    set.card_count > 0 // Esclude set non ancora usciti (con 0 carte e senza foto)
                );
                // Prendiamo le ultime 4 espansioni
                setLatestSets(principalSets.slice(0, 4));
            } catch (err) {
                console.error("Errore recupero set in HomePage:", err);
            } finally {
                setLoadingSets(false);
            }
        };
        fetchLatestSets();
    }, []);

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

            {/* 2. ULTIME USCITE (FETCH DA SCRYFALL) */}
            <div className="max-w-7xl mx-auto px-4 py-16 relative z-20 mt-12 border-t border-neutral-800/50">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>Ultime Espansioni</h2>
                        <div className="w-20 h-1 bg-amber-500 mt-2"></div>
                    </div>
                    <Link to="/sets" className="text-amber-500 hover:text-amber-400 font-semibold text-sm hidden sm:block transition-colors">Vedi tutti i set &rarr;</Link>
                </div>
                
                {loadingSets ? (
                    <div className="text-center py-12 text-slate-400">Caricamento delle ultime espansioni...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {latestSets.map((set) => (
                            <ImgSetCard key={set.id} set={set} />
                        ))}
                    </div>
                )}
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