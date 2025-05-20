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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const API_BASE_URL =
  "https://tinder-products-flask-server-364851446262.europe-west4.run.app";
const placeholderImg = "https://via.placeholder.com/80x80.png?text=No+Photo";

function ProductVariantsPage() {
  const { productId, suggestedProductId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [variants, setVariants] = useState([]);
  const [mainProduct, setMainProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);
  const [variantStatus, setVariantStatus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // If we have a suggestedProductId, use that as the main product
        const targetProductId = suggestedProductId || productId;

        // Fetch main product details
        const mainProductResponse = await fetch(
          `${API_BASE_URL}/api/products/new/${targetProductId}`
        );
        if (!mainProductResponse.ok) {
          throw new Error("Failed to fetch main product");
        }
        const mainProductData = await mainProductResponse.json();
        if (mainProductData.items && mainProductData.items.length > 0) {
          setMainProduct(mainProductData.items[0]);
        }

        // Fetch variants using the original productId
        const variantsResponse = await fetch(
          `${API_BASE_URL}/api/products/new/${productId}`
        );
        if (!variantsResponse.ok) {
          throw new Error("Failed to fetch product variants");
        }
        const variantsData = await variantsResponse.json();
        // Extract the items array from the response
        const variants = variantsData.items || [];
        setVariants(variants);

        // Initialize variant statuses
        const initialStatuses = {};
        variants.forEach((variant) => {
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
  }, [productId, suggestedProductId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAccept = async (variantId, skuAttr) => {
    try {
      const statusKey = `${variantId}-${skuAttr}`;
      setAcceptingId(variantId);
      const response = await fetch(
        `${API_BASE_URL}/api/products/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            original_product_id: parseInt(suggestedProductId),
          }),
        }
      );

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

      {/* Variants Section */}
      <Typography variant="h6" fontWeight={600} mb={2}>
        Available Variants
      </Typography>

      {/* Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : variants.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No variants available for this product.
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
          {variants.map((variant, idx) => {
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
                      transform: "translateY(-4px)",
                      boxShadow: 2,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={variant.main_image_url || placeholderImg}
                    alt={variant.product_title}
                    sx={{
                      width: "100%",
                      height: 200,
                      borderRadius: 1.5,
                      bgcolor: "#f0f0f0",
                      objectFit: "contain",
                      mb: 2,
                      p: 2,
                    }}
                    onError={(e) => {
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
