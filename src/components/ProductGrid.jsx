import React, { memo } from "react";
import Box from "@mui/material/Box";
import ProductCard from "./ProductCard";

const ProductGrid = memo(({ products, onViewSuggestions }) => (
  <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2,
      mb: 4,
      px: { xs: 1, md: 3 },
      width: "100%",
    }}
  >
    {products.map((product, idx) => (
      <Box
        key={product.id}
        sx={{
          flex: {
            xs: "1 1 100%",
            sm: "1 1 calc(50% - 16px)",
            md: "1 1 calc(33.333% - 16px)",
          },
          maxWidth: {
            xs: "100%",
            sm: "calc(50% - 16px)",
            md: "calc(33.333% - 16px)",
          },
          display: "flex",
        }}
      >
        <ProductCard product={product} onViewSuggestions={onViewSuggestions} />
      </Box>
    ))}
  </Box>
));

ProductGrid.displayName = "ProductGrid";

export default ProductGrid;
