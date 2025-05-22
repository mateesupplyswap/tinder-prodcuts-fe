import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import SuggestionSwipePage from "./pages/SuggestionSwipePage";
import ProductVariantsPage from "./pages/ProductVariantsPage";

function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          minWidth: "1500px",
         
        }}
      >
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/swipe" element={<SuggestionSwipePage />} />
          <Route
            path="/product/:productId/:suggestedProductId?"
            element={<ProductVariantsPage />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
