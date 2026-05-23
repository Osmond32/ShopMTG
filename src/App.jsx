import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./Pages/HomePage";
import ProductsPage from "./Pages/ProductsPage";
import ProductPage from "./Pages/ProductPage"; // Importiamo la pagina di dettaglio

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductPage />} /> {/* Rotta dinamica per i dettagli */}
      </Routes>
    </Router>
    
  );
}

export default App;