# 🎨 DESIGN SYSTEM - Business/Corporate

**Generato automaticamente da:** Design System Generator (Free Version)
**URL:** https://magic.wizard.com
**Data:** 24/05/2026

## 📖 Introduzione

**Tipo di sito:** Business/Corporate
**Titolo:** magic.wizard.com
**Descrizione:** 
**Stack consigliato:** React + Tailwind CSS

### Caratteristiche principali
- Layout moderno e responsive
- Componenti riutilizzabili
- Design system coerente
- Ottimizzato per mobile/tablet/desktop

## 🗂️ STRUTTURA SITO COMPLETA

```
/
```

## 🧭 NAVBAR / NAVIGATION

### Layout
```jsx
<nav className="sticky top-0 z-50 bg-white shadow-md">
  <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
    <div className="font-bold text-2xl">LOGO</div>
    
    <div className="hidden md:flex gap-8 text-sm font-semibold">
      
    </div>
    
    <button>CTA Button</button>
  </div>
</nav>
```

## 🎨 PALETTE COLORI

### Colori Estratti
```
#000000 → gray-900
#5F6368 → gray-500
#FFFFFF → white
#202124 → gray-900
#585858 → gray-500
#4285F4 → blue-500
#BBBBBB → gray-400
#1A73E8 → blue-600
#777777 → gray-500
#DDDDDD → gray-300
```

### Colori Standard Tailwind
```
Primary:      bg-blue-600
Dark:         bg-blue-700
Light:        bg-blue-50
Background:   bg-white, bg-gray-50
Text Primary: text-gray-900
Text Sec:     text-gray-600
Border:       border-gray-200
```

## 🔤 TIPOGRAFIA

### Font Sizes Trovati
```
12px → text-xs
13.125px → text-[13px]
15px → text-[15px]
20px → text-xl
24px → text-2xl
```

### Font Families
```
- "Times New Roman"
- "Segoe UI"
- Arial
```

### Font Weights
```
font-normal   400
font-semibold 600
font-bold     700
```

## 📏 SPACING & LAYOUT

```
Section padding:  py-16 (default), py-20 (importante), py-32 (hero)
Container:        max-w-6xl mx-auto px-4
Gap tra card:     gap-6 (standard), gap-8 (large)
Margin bottom:    mb-4, mb-6, mb-8, mb-12, mb-16
```

## 📄 PAGINE PRINCIPALI

### 1. Impossibile trovare la pagina magic.wizard.com
- URL: /impossibile trovare la pagina magic.wizard.com
- Componenti: Hero, Cards, Forms
- Layout: Grid responsive

## 🎴 COMPONENTI CONDIVISI

### Button Style
```jsx
<button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-colors">
  CTA Text
</button>
```

### Card Style
```jsx
<div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
  Content
</div>
```

### Input Style
```jsx
<input className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
```

## 🔘 CTA / BUTTONS TROVATI

```
- Ricarica
```

## 📋 FORMS

Nessun form trovato

## 📱 RESPONSIVE BREAKPOINTS

```
Mobile:  (default)        < 640px
Tablet:  md:              ≥ 640px
Desktop: lg:              ≥ 1024px
```

### Pattern Grid Responsive
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Card... */}
</div>
```

## 🎨 HOVER & TRANSITIONS

```jsx
// Button hover
className="hover:bg-blue-700 transition-colors"

// Card hover
className="hover:shadow-lg hover:scale-105 transition-all"

// Image hover
className="group-hover:scale-110 transition-transform"
```

## ✅ CHECKLIST IMPLEMENTAZIONE

- [ ] Setup React + Router + Tailwind
- [ ] Navbar con links attivi
- [ ] Footer
- [ ] Home page
- [ ] Pagine interne
- [ ] Forms con validazione
- [ ] Responsive testing
- [ ] Hover effects
- [ ] Meta tags / SEO
- [ ] Performance optimization

---

**Versione:** 1.0 (Free - No API Key)
**Stack:** React + Tailwind CSS
**Generato:** 24/05/2026, 00:52:30
