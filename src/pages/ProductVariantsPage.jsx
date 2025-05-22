import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Divider,
  ButtonGroup,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const API_BASE_URL =
  "https://tinder-products-flask-server-364851446262.europe-west4.run.app";

// Add this function before the ProductVariantsPage component
const getImageUrl = (variant) => {
  const imageUrl = variant.main_image_url;
};

function ProductVariantsPage() {
  const { productId, suggestedProductId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [variants, setVariants] = useState([]);
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [filter, setFilter] = useState("all");
  const [mainProduct, setMainProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);
  const [variantStatus, setVariantStatus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/api/products/new/${productId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }
        const data = await response.json();
        const items = data.items || [];

        // Set the first item as main product if available
        if (items.length > 0) {
          setMainProduct(items[0]);
        }

        // Set all items as variants
        setVariants(items);
        setFilteredVariants(items);

        // Initialize variant statuses
        const initialStatuses = {};
        items.forEach((variant) => {
          const statusKey = `${variant.product_id}-${variant.sku_attr}`;
          initialStatuses[statusKey] = "pending";
        });
        setVariantStatus(initialStatuses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId]);

  // Update filter effect
  useEffect(() => {
    if (filter === "all") {
      setFilteredVariants(variants);
    } else if (filter === "filtered") {
      setFilteredVariants(
        variants.filter(
          (v) => v.sniper_rejection_reason === "Filtered Successfully"
        )
      );
    }
  }, [filter, variants]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAccept = async (variantId, skuAttr) => {
    try {
      const statusKey = `${variantId}-${skuAttr}`;
      setAcceptingId(variantId);
      const response = await fetch(`${API_BASE_URL}/api/products/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original_product_id: parseInt(suggestedProductId),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to accept product");
      }

      // Mark as accepted
      setVariantStatus((prev) => ({
        ...prev,
        [statusKey]: "accepted",
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = (variantId, skuAttr) => {
    const statusKey = `${variantId}-${skuAttr}`;
    // Mark as rejected
    setVariantStatus((prev) => ({
      ...prev,
      [statusKey]: "rejected",
    }));
  };

  return (
    <Box
      sx={{
        bgcolor: "#f7f8fa",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        px: { xs: 2, md: 4 },
        py: 4,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ textTransform: "none" }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight={700}>
          Product Variants
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Variants Section with Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Available Variants
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            label="All Variants"
            onClick={() => setFilter("all")}
            color={filter === "all" ? "primary" : "default"}
            variant={filter === "all" ? "filled" : "outlined"}
            sx={{
              fontWeight: filter === "all" ? 600 : 400,
              "&:hover": {
                backgroundColor:
                  filter === "all" ? "primary.main" : "action.hover",
              },
            }}
          />
          <Chip
            label="Filtered Successfully"
            onClick={() => setFilter("filtered")}
            color={filter === "filtered" ? "primary" : "default"}
            variant={filter === "filtered" ? "filled" : "outlined"}
            sx={{
              fontWeight: filter === "filtered" ? 600 : 400,
              "&:hover": {
                backgroundColor:
                  filter === "filtered" ? "primary.main" : "action.hover",
              },
            }}
          />
        </Box>
      </Box>

      {/* Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : filteredVariants.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No variants available for the selected filter.
        </Alert>
      ) : (
        <Grid
          container
          spacing={2}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {filteredVariants.map((variant, idx) => {
            const statusKey = `${variant.product_id}-${variant.sku_attr}`;
            const currentStatus = variantStatus[statusKey] || "pending";
            return (
              <Grid
                item
                key={`${variant.product_id}-${variant.sku_attr}-${idx}`}
                sx={{
                  width: "100%",
                  display: "flex",
                }}
              >
                <Card
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s",
                    "&:hover": {
                      // Remove or comment out the transform
                      // transform: "translateY(-4px)",
                      boxShadow: 2,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={
                      variant.variant_image_url
                        ? variant.variant_image_url
                        : variant.main_image_url
                    }
                    alt={variant.product_title || "Product image"}
                    sx={{
                      width: "100%",
                      height: 200,
                      borderRadius: 1.5,
                      bgcolor: "#f0f0f0",
                      objectFit: "contain",
                      mb: 2,
                      p: 2,
                      transition: "none",
                    }}
                    onError={(e) => {
                      console.error("Image failed to load:", {
                        variantImage: variant.variant_image_url,
                        mainImage: variant.main_image_url,
                        productId: variant.product_id,
                        sku: variant.sku_attr,
                      });
                      e.target.src = placeholderImg;
                    }}
                  />
                  <CardContent sx={{ p: 0 }}>
                    <Typography
                      fontWeight={700}
                      fontSize={16}
                      mb={1}
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minHeight: "3.2em",
                      }}
                    >
                      {variant.product_title}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="primary"
                      fontWeight={600}
                      mb={1}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      {parseFloat(variant.price).toFixed(2)}{" "}
                      {variant.currency_code}
                    </Typography>

                    {/* Stock and Rating Info */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Stock:
                        </Typography>
                        <Typography
                          variant="body2"
                          color={
                            variant.available_stock > 0
                              ? "success.main"
                              : "error.main"
                          }
                          fontWeight={500}
                        >
                          {variant.available_stock || 0} units
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Rating:
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {variant.avg_reviews_rating
                            ? variant.avg_reviews_rating.toFixed(1)
                            : "N/A"}
                          {variant.avg_reviews_rating && " ★"}
                        </Typography>
                        {variant.total_reviews > 0 && (
                          <Typography variant="body2" color="text.secondary">
                            ({variant.total_reviews} reviews)
                          </Typography>
                        )}
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Sold:
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {variant.total_sold || 0} units
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Status:
                        </Typography>
                        {variant.sniper_rejection_reason && (
                          <Typography fontSize={13} color="error">
                            {variant.sniper_rejection_reason ===
                            "Empty Filtration Output"
                              ? "Rejected because of product reviews or ratings"
                              : variant.sniper_rejection_reason}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.875rem",
                        bgcolor: "#f5f5f5",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        display: "inline-block",
                        wordBreak: "break-all",
                      }}
                    >
                      SKU: {variant.sku_attr}
                    </Typography>
                  </CardContent>
                  <CardContent sx={{ p: 0, mt: 2 }}>
                    {currentStatus === "accepted" ? (
                      <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        disabled
                      >
                        Accepted
                      </Button>
                    ) : currentStatus === "rejected" ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        disabled
                      >
                        Rejected
                      </Button>
                    ) : (
                      <ButtonGroup
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2 }}
                        disabled={acceptingId === variant.product_id}
                      >
                        <Button
                          startIcon={
                            acceptingId === variant.product_id ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              <CheckCircleIcon />
                            )
                          }
                          onClick={() =>
                            handleAccept(variant.product_id, variant.sku_attr)
                          }
                          color="success"
                          sx={{ flex: 1 }}
                        >
                          Accept
                        </Button>
                        <Button
                          startIcon={<CancelIcon />}
                          onClick={() =>
                            handleReject(variant.product_id, variant.sku_attr)
                          }
                          color="error"
                          sx={{ flex: 1 }}
                        >
                          Reject
                        </Button>
                      </ButtonGroup>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}

export default ProductVariantsPage;
