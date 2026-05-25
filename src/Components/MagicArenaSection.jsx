// src/Components/MagicArenaSection.jsx
import React from "react";
import ArenaBg from "../assets/Img.png";

export default function MagicArenaSection() {
  return (
    <section className="w-full relative overflow-hidden min-h-[400px] flex items-center border-y border-neutral-800 shadow-2xl bg-neutral-950">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center md:bg-right-center"
        style={{ 
          backgroundImage: `url(${ArenaBg})`,
        }}
      />
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 md:via-neutral-950/70 to-transparent z-10" />

      {/* Content Area */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-16 relative z-20 flex flex-col justify-center items-start text-left">
        <div className="max-w-2xl">
          {/* Subtitle / Category */}
          <span className="text-amber-500 font-extrabold uppercase tracking-widest text-xs md:text-sm mb-3 block">
            MTG Arena
          </span>
          
          {/* Title */}
          <h2 
            className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 tracking-wide uppercase"
            style={{ fontFamily: "Georgia, serif" }}
          >
            JOUEZ À MAGIC PARTOUT
          </h2>

          {/* Description */}
          <p className="text-slate-300 text-sm md:text-base mb-8 leading-relaxed max-w-lg font-medium">
            Commencez à jouer gratuitement ! MTG Arena est un jeu de cartes à collectionner numérique disponible sur PC et mobile. 
            Obtenez <span className="text-amber-400 font-bold">3 boosters numériques gratuits</span> envoyés dans votre boîte de réception en jeu lors de votre connexion !
          </p>

          {/* Get Started Button (Torch orange style matching the reference image) */}
          <a
            href="https://magic.wizards.com/en/mtgarena"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white font-extrabold uppercase tracking-wider text-sm md:text-base px-8 md:px-10 py-3.5 md:py-4 rounded-full border border-orange-400/30 transition-all hover:scale-105 shadow-[0_5px_25px_rgba(249,115,22,0.45)] hover:shadow-[0_8px_35px_rgba(249,115,22,0.6)] cursor-none"
          >
            {/* Windows SVG Icon */}
            <svg 
              className="w-4 h-4 md:w-5 md:h-5 fill-current" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.1zM10.95 1.95L24 0v11.55H10.95V1.95zM10.95 12.45H24v11.55l-13.05-1.95v-9.6z" />
            </svg>
            <span>COMMENCER</span>
          </a>
        </div>
      </div>
    </section>
  );
}
