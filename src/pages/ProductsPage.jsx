import React, { useState, useEffect, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import ProductGrid from "../components/ProductGrid";
import SearchBar from "../components/SearchBar";
import ProductSuggestionsModal from "../components/ProductSuggestionsModal";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const PRODUCTS_PER_PAGE = 50;
const API_BASE_URL =
  "https://tinder-products-flask-server-364851446262.europe-west4.run.app";

function ProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(null);
  const [pageCache, setPageCache] = useState({});

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handlePageChange = useCallback((_, value) => {
    setPage(value);
  }, []);

  const handleViewSuggestions = useCallback(async (product) => {
    console.log("View suggestions clicked for product:", product);
    setSelectedProduct(product);
    setModalOpen(true);
    setLoadingSuggestions(true);
    setSuggestionsError(null);

    try {
      const productId = product.originalProductId;
      console.log("Using original product ID:", productId);

      if (!productId) {
        throw new Error("No original product ID available");
      }

      const url = `${API_BASE_URL}/api/products/${productId}`;
      console.log("Fetching from URL:", url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch suggestions: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Received data:", data);

      // Map API response to UI product structure
      const mappedSuggestions = Array.isArray(data.items)
        ? data.items.map((item) => ({
            id: item.original_product_id,
            title: item.suggested_product_title,
            image: item.original_main_image_url,
            desc: item.original_status_comment,
            status: item.original_status,
            lastCheckDate: item.original_last_check_date,
            lastOnlineDate: item.original_last_online_date,
            addedAt: item.added_at,
            processingStatus: item.processing_status,
            sniperSuccess: item.sniper_success,
            sniperRejectionReason: item.sniper_rejection_reason,
            originalProductId: item.original_product_id,
            originalSkuAttr: item.original_sku_attr,
            suggestedProductId: item.suggested_product_id,
            suggestedSkuAttr: item.suggested_sku_attr,
            suggestedMainImageUrl: item.suggested_main_image_url,
            suggestedVariantImageUrl: item.suggested_variant_image_url,
            isMatch: item.is_match,
            price: item.original_price ? parseFloat(item.original_price) : null,
            currency: item.original_currency || "USD",
          }))
        : [];

      console.log("Mapped suggestions:", mappedSuggestions);
      setSuggestions(mappedSuggestions);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestionsError(err.message);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleRemoveProduct = useCallback((productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((p) => p.id !== productId)
    );
    // Also remove from cache if it exists
    setPageCache((prevCache) => {
      const newCache = { ...prevCache };
      Object.keys(newCache).forEach((page) => {
        if (newCache[page]?.products) {
          newCache[page].products = newCache[page].products.filter(
            (p) => p.id !== productId
          );
        }
      });
      return newCache;
    });
  }, []);

  // Memoize the pagination count
  const paginationCount = useMemo(
    () => Math.ceil(total / PRODUCTS_PER_PAGE),
    [total]
  );

  useEffect(() => {
    setLoading(true);
    setError(null);
    const offset = (page - 1) * PRODUCTS_PER_PAGE;
    const url = `${API_BASE_URL}/api/products?limit=${PRODUCTS_PER_PAGE}&offset=${offset}`;

    const fetchData = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        // Map API items to UI product structure
        const mapped = Array.isArray(data.items)
          ? data.items.map((item) => ({
              id: item.original_product_id,
              title: item.Title_EN,
              image: item.original_main_image_url,
              desc: item.original_status_comment,
              status: item.original_status,
              lastCheckDate: item.original_last_check_date,
              lastOnlineDate: item.original_last_online_date,
              addedAt: item.added_at,
              processingStatus: item.processing_status,
              sniperSuccess: item.sniper_success,
              sniperRejectionReason: item.sniper_rejection_reason,
              originalProductId: item.original_product_id,
              originalSkuAttr: item.original_sku_attr,
              suggestedProductId: item.suggested_product_id,
              suggestedSkuAttr: item.suggested_sku_attr,
              suggestedMainImageUrl: item.suggested_main_image_url,
              suggestedVariantImageUrl: item.suggested_variant_image_url,
              isMatch: item.is_match,
              price: item.original_price
                ? parseFloat(item.original_price)
                : null,
              currency: item.original_currency || "USD",
            }))
          : [];

        console.log("Mapped products:", mapped);
        // Store in cache
        setPageCache((prevCache) => ({
          ...prevCache,
          [page]: {
            products: mapped,
            total: data.total || 0,
          },
        }));

        setProducts(mapped);
        setTotal(data.total || 0);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Check cache first
    if (pageCache[page]) {
      setProducts(pageCache[page].products);
      setTotal(pageCache[page].total);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    fetchData();
  }, [page, pageCache]);

  return (
    <Box
      sx={{
        bgcolor: "#f7f8fa",
        minHeight: "100vh",
        overflowX: "hidden",
        px: { xs: 2, md: 4 },
        py: 4,
      }}
    >
      {/* Header Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          AliExpress Products
        </Typography>
        <SearchBar value={search} onChange={handleSearchChange} />
      </Box>
      {/* Subheader */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={500} mb={1}>
          All Products
        </Typography>
      </Box>
      {/* Product Grid or Loading/Error */}
      <Box sx={{ position: "relative", minHeight: 400 }}>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(247, 248, 250, 0.8)",
              backdropFilter: "blur(4px)",
              zIndex: 1,
              borderRadius: 2,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {error ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
          >
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : (
          <ProductGrid
            products={products}
            onViewSuggestions={handleViewSuggestions}
          />
        )}
      </Box>
      {/* Pagination */}
      {!error && total > 0 && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            py: 4,
            width: "100%",
            maxWidth: "100%",
            position: "sticky",
            bottom: 0,
            backgroundColor: "rgba(247, 248, 250, 0.9)",
            backdropFilter: "blur(8px)",
            borderTop: "1px solid rgba(0, 0, 0, 0.1)",
            zIndex: 1,
            left: 0,
            right: 0,
          }}
        >
          <Pagination
            count={paginationCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="large"
            showFirstButton
            showLastButton
            disabled={loading}
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "1rem",
                minWidth: "40px",
                height: "40px",
                margin: "0 4px",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              },
            }}
          />
        </Box>
      )}
      {/* Suggestions Modal */}
      <ProductSuggestionsModal
        open={modalOpen}
        onClose={handleCloseModal}
        mainProduct={selectedProduct || {}}
        suggestions={suggestions}
        loading={loadingSuggestions}
        error={suggestionsError}
        onAccept={async (product) => {
          try {
            const response = await fetch(
              `${API_BASE_URL}/api/products/update`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  original_product_id: product.originalProductId,
                }),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to update product");
            }

            // Remove the accepted product from the list
            handleRemoveProduct(product.id);
            handleCloseModal();
          } catch (error) {
            console.error("Error updating product:", error);
            // You might want to show an error message to the user here
          }
        }}
        onReject={(product) => {
          handleRemoveProduct(product.id);
          handleCloseModal();
        }}
      />
    </Box>
  );
}

export default ProductsPage;
