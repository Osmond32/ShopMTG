// src/Components/OurGamesSection.jsx
import React from "react";

export default function OurGamesSection() {
  const games = [
    {
      title: "MTG ARENA",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80", // Gaming setup / e-sport
      desc: "Déployez votre stratégie. Entrez dans l'action. MTG Arena apporte le légendaire jeu de cartes stratégique sur PC, Mac, Android et iOS.",
      links: [
        { text: "Jouer Gratuitement", url: "https://magic.wizards.com/en/mtgarena" }
      ]
    },
    {
      title: "SUR TABLE",
      image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80", // Board game night with friends
      desc: "Magic est une question de communauté. Rassemblez-vous et jouez à votre façon, que ce soit dans votre boutique locale, chez vous avec des amis ou en ligne avec SpellTable.",
      links: [
        { text: "Trouver un Produit", url: "/products" },
        { text: "Essayer SpellTable", url: "https://www.spelltable.com/" }
      ]
    },
    {
      title: "MAGIC ONLINE",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80", // Classic gaming setup / retro screen
      desc: "Découvrez la plateforme numérique originale pour les fans de Legacy, Modern et autres formats classiques de Magic. Disponible sur PC !",
      links: [
        { text: "Jouer Maintenant", url: "https://magic.wizards.com/en/mtgo" }
      ]
    },
    {
      title: "COMPÉTITIF",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80", // Champion trophy / e-sports arena
      desc: "Suivez la Magic Pro League, participez à des tournois numériques et sur table et soulevez la coupe du champion !",
      links: [
        { text: "En savoir plus", url: "https://magic.wizards.com/en/news/competitive" }
      ]
    }
  ];

  return (
    <section className="w-full bg-neutral-950 border-t border-neutral-900 py-24 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Title Block */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            NOS JEUX
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {games.map((game, index) => (
            <div 
              key={index}
              className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-2xl overflow-hidden flex flex-col h-full group hover:border-amber-500/40 hover:shadow-[0_10px_30px_rgba(245,158,11,0.05)] transition-all duration-300"
            >
              {/* Image Container with Zoom effect */}
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
                <img 
                  src={game.image} 
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>

              {/* Card Body */}
              <div className="p-8 flex flex-col flex-grow items-center text-center">
                {/* Game Title */}
                <h3 
                  className="text-xl font-extrabold text-white mb-4 tracking-wider group-hover:text-amber-400 transition-colors"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {game.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                  {game.desc}
                </p>

                {/* Action Links */}
                <div className="flex flex-col gap-3 mt-auto w-full items-center">
                  {game.links.map((link, lIndex) => (
                    <a
                      key={lIndex}
                      href={link.url}
                      target={link.url.startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="text-amber-500 hover:text-amber-400 font-bold text-sm tracking-wider uppercase inline-flex items-center gap-1 group/link transition-colors cursor-none"
                    >
                      <span>{link.text}</span>
                      <span className="transform group-hover/link:translate-x-1 transition-transform">&rarr;</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
