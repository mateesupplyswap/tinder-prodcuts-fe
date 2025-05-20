import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import SuggestionSwipePage from "./pages/SuggestionSwipePage";
import ProductVariantsPage from "./pages/ProductVariantsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/swipe" element={<SuggestionSwipePage />} />
        <Route
          path="/product/:productId/:suggestedProductId?"
          element={<ProductVariantsPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
