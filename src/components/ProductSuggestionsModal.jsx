import React, { useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const placeholderImg = "https://via.placeholder.com/80x80.png?text=No+Photo";

const ProductSuggestionsModal = ({
  open,
  onClose,
  mainProduct,
  suggestions,
  loading,
  error,
}) => {
  const navigate = useNavigate();
  console.log(suggestions);
  const originalId = mainProduct?.originalProductId;

  const handleCardClick = useCallback(
    (suggestion) => {
      navigate(`/product/${suggestion.suggestedProductId}/${originalId}`);
      onClose();
    },
    [navigate, onClose, originalId]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: 22, pb: 0 }}>
        Product Suggestions
      </DialogTitle>
      <DialogContent sx={{ pb: 0 }}>
        {/* Main Product */}
        <Typography variant="subtitle1" fontWeight={600} mt={1} mb={1}>
          Main Product
        </Typography>
        <Box
          sx={{
            bgcolor: "#f7f8fa",
            borderRadius: 2,
            p: 2,
            display: "flex",
            alignItems: "center",
            mb: 3,
          }}
        >
          <CardMedia
            component="img"
            image={mainProduct.image || placeholderImg}
            alt={mainProduct.title}
            sx={{
              width: 64,
              height: 64,
              borderRadius: 1.5,
              mr: 2,
              bgcolor: "#f0f0f0",
              objectFit: "contain",
            }}
          />
          <Box>
            <Typography fontWeight={700} fontSize={17} mb={0.5}>
              {mainProduct?.title ?? "-"}
            </Typography>
            <Typography fontSize={15} color="text.secondary" mb={0.5}>
              {mainProduct?.status ? `Status: ${mainProduct.status}` : ""}
              {mainProduct?.desc ? ` | ${mainProduct.desc}` : ""}
            </Typography>
            <Typography fontSize={15} color="text.secondary">
              Last Check:{" "}
              {mainProduct?.lastCheckDate
                ? new Date(mainProduct.lastCheckDate).toLocaleDateString()
                : "N/A"}
            </Typography>
          </Box>
        </Box>
        {/* AI Suggestions */}
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          AI Suggestions
        </Typography>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={4}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : suggestions.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No suggestions available for this product.
          </Alert>
        ) : (
          <Grid
            container
            spacing={2}
            mb={2}
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
            {suggestions.map((s, idx) => (
              <Grid
                item
                key={`${s.id}-${idx}`}
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
                  <Box sx={{ flex: 1 }}>
                    <CardMedia
                      component="img"
                      image={s.image || placeholderImg}
                      alt={s.title}
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 1.5,
                        mx: "auto",
                        bgcolor: "#f0f0f0",
                        objectFit: "contain",
                        mb: 1,
                        cursor: "pointer",
                      }}
                      onClick={() => handleCardClick(s)}
                    />
                    <CardContent
                      sx={{ p: 0, textAlign: "center", cursor: "pointer" }}
                      onClick={() => handleCardClick(s)}
                    >
                      <Typography fontWeight={700} fontSize={15} mb={0.5}>
                        {s.title}
                      </Typography>
                      <Typography fontSize={14} color="text.secondary" mb={0.5}>
                        Status: {s.status || "N/A"}
                        {s.desc ? ` | ${s.desc}` : ""}
                      </Typography>
                      <Typography fontSize={13} color="text.secondary">
                        Last Check:{" "}
                        {s.lastCheckDate
                          ? new Date(s.lastCheckDate).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                      {s.sniperRejectionReason && (
                        <Typography
                          fontSize={13}
                          color="error"
                          sx={{ mt: 0.5 }}
                        >
                          Rejection: {s.sniperRejectionReason}
                        </Typography>
                      )}
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        <Box display="flex" justifyContent="flex-end" mt={2} mb={1}>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{ px: 4, fontWeight: 500 }}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductSuggestionsModal;
