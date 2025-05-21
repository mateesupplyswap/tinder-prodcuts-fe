import React, { memo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
  Tooltip,
} from "@mui/material";

const placeholderImg = "https://via.placeholder.com/80x80.png?text=No+Photo";

const ProductCard = memo(({ product, onViewSuggestions }) => {
  const handleViewSuggestions = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (onViewSuggestions) {
        onViewSuggestions(product);
      }
    },
    [onViewSuggestions, product]
  );

  // Format price with currency only if price exists and is valid
  const formattedPrice =
    product.price && typeof product.price === "number" && !isNaN(product.price)
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: product.currency || "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(product.price)
      : null;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        p: 1.5,
        boxShadow: 1,
        borderRadius: 2,
        minHeight: 110,
        bgcolor: "#fff",
        width: "100%",
        height: "100%",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardMedia
        component="img"
        image={product.image || placeholderImg}
        alt={product.title}
        sx={{
          width: 64,
          height: 64,
          bgcolor: "#f8f9fa",
          borderRadius: 1.5,
          mr: 2,
          objectFit: "contain",
          border: "1px solid #f0f0f0",
        }}
      />
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <CardContent sx={{ pb: 0, pr: 0, flex: 1, "&:last-child": { pb: 0 } }}>
          <Tooltip title={product.title} placement="top">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "0.95rem",
                color: "#1a1a1a",
                mb: 0.5,
              }}
            >
              {product.title}
            </Typography>
          </Tooltip>
          {product.desc && (
            <Tooltip title={product.desc} placement="top">
              <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: "0.85rem",
                  mb: 1,
                  color: "#666",
                }}
              >
                {product.desc}
              </Typography>
            </Tooltip>
          )}

          <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
            {formattedPrice && (
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                  fontSize: "1rem",
                  color: "#2e7d32",
                  letterSpacing: "0.02em",
                }}
              >
                {formattedPrice}
              </Typography>
            )}
            {product.originalProductId && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.75rem",
                  color: "#757575",
                  bgcolor: "#f5f5f5",
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                }}
              >
                ID: {product.originalProductId}
              </Typography>
            )}
            {product.ean && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.75rem",
                  color: "#757575",
                  bgcolor: "#f5f5f5",
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                }}
              >
                EAN: {product.ean}
              </Typography>
            )}
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", pb: 0, pr: 0, pt: 1 }}>
          <Button
            variant="contained"
            onClick={handleViewSuggestions}
            sx={{
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 500,
              px: 2,
              py: 0.75,
              minWidth: 0,
              fontSize: "0.875rem",
              boxShadow: "none",
              bgcolor: "#1976d2",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "#1565c0",
                transform: "translateY(-1px)",
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
              },
            }}
          >
            View Suggestions
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
