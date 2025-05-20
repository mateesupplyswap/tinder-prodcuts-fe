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
  CardActions,
  Grid,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";

const placeholderImg = "https://via.placeholder.com/80x80.png?text=No+Photo";

const ProductSuggestionsModal = ({
  open,
  onClose,
  mainProduct,
  suggestions,
  loading,
  error,
  onAccept,
  onReject,
}) => {
  const navigate = useNavigate();

  const handleAccept = useCallback(
    (suggestion) => {
      console.log("Accepting suggestion:", suggestion);
      onAccept?.(suggestion);
    },
    [onAccept]
  );

  const handleReject = useCallback(
    (suggestion) => {
      console.log("Rejecting suggestion:", suggestion);
      onReject?.(suggestion);
    },
    [onReject]
  );

  const handleCardClick = useCallback(
    (idx) => {
      navigate("/swipe", {
        state: {
          suggestions,
          startIndex: idx,
        },
      });
      onClose();
    },
    [navigate, suggestions, onClose]
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
              $
              {mainProduct?.price !== undefined
                ? mainProduct.price.toFixed(2)
                : "--"}{" "}
              | {mainProduct?.rating ?? "--"}★ ({mainProduct?.reviews ?? "--"}{" "}
              reviews)
            </Typography>
            <Typography fontSize={15} color="text.secondary">
              {mainProduct?.desc ?? ""}
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
          <Grid container spacing={2} mb={2}>
            {suggestions.map((s, idx) => (
              <Grid item xs={12} md={4} key={`${s.id}-${idx}`}>
                <Card
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    height: "100%",
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
                      onClick={() => handleCardClick(idx)}
                    />
                    <CardContent sx={{ p: 0, textAlign: "center" }}>
                      <Typography
                        fontWeight={700}
                        fontSize={15}
                        mb={0.5}
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleCardClick(idx)}
                      >
                        {s.title}
                      </Typography>
                      <Typography fontSize={14} color="text.secondary" mb={0.5}>
                        ${s.price.toFixed(2)} | {s.rating}★ ({s.reviews}{" "}
                        reviews)
                      </Typography>
                      {s.desc && (
                        <Typography
                          fontSize={13}
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            mt: 0.5,
                          }}
                        >
                          {s.desc}
                        </Typography>
                      )}
                    </CardContent>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 2,
                      mt: 2,
                      pt: 1,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleAccept(s)}
                      size="small"
                      sx={{
                        minWidth: 100,
                        textTransform: "none",
                        fontWeight: 500,
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => handleReject(s)}
                      size="small"
                      sx={{
                        minWidth: 100,
                        textTransform: "none",
                        fontWeight: 500,
                      }}
                    >
                      Reject
                    </Button>
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
