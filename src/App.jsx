import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import SuggestionSwipePage from "./pages/SuggestionSwipePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/swipe" element={<SuggestionSwipePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
