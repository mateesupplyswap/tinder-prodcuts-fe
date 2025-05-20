import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
} from "@mui/material";
import { ArrowBack, Close, Favorite } from "@mui/icons-material";
import { useSwipeable } from "react-swipeable";

const API_BASE_URL = "https://product-tinder-11259826590.europe-west4.run.app";
const placeholderImg = "https://via.placeholder.com/400x400.png?text=No+Photo";

const cardStyle = {
  width: 400,
  maxWidth: "90vw",
  borderRadius: 6,
  boxShadow: 8,
  background: "#fff",
  mx: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  p: 0,
  overflow: "hidden",
};

const priceStyle = {
  fontWeight: 700,
  fontSize: 20,
  color: "#111",
  ml: 1,
};

function SuggestionSwipePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { suggestions = [], startIndex = 0 } = location.state || {};
  const [current, setCurrent] = useState(startIndex);
  const [accepted, setAccepted] = useState([]);
  const [rejected, setRejected] = useState([]);

  if (!suggestions.length) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h5">No suggestions to swipe.</Typography>
      </Box>
    );
  }

  const suggestion = suggestions[current];

  const handleAccept = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original_product_id: suggestion.originalProductId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      setAccepted([...accepted, suggestion]);
      goNext();
    } catch (error) {
      console.error("Error updating product:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleReject = () => {
    setRejected([...rejected, suggestion]);
    goNext();
  };

  const goNext = () => {
    if (current < suggestions.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate("/", { state: { accepted, rejected } });
    }
  };

  const handleBack = () => {
    if (current > 0) setCurrent(current - 1);
    else navigate("/");
  };

  return (
    <Box
      minHeight="100vh"
      bgcolor="#fff"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ width: "100vw", height: "100vh", overflow: "auto" }}
    >
      <Box
        width="100%"
        display="flex"
        justifyContent="flex-start"
        mt={2}
        mb={2}
      >
        <IconButton onClick={handleBack} sx={{ color: "#111", ml: 2 }}>
          <ArrowBack />
        </IconButton>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flex={1}
      >
        <Box
          {...useSwipeable({
            onSwipedLeft: handleReject,
            onSwipedRight: handleAccept,
            preventDefaultTouchmoveEvent: true,
            trackMouse: true,
          })}
          sx={{ width: "100%" }}
        >
          <Card sx={cardStyle}>
            <CardMedia
              component="img"
              image={suggestion.image || placeholderImg}
              alt={suggestion.title}
              sx={{
                width: "100%",
                height: 300,
                objectFit: "cover",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }}
            />
            <CardContent sx={{ width: "100%", textAlign: "left", p: 3, pb: 2 }}>
              <Typography fontWeight={700} fontSize={20} mb={0.5}>
                {suggestion.title}
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                {suggestion.oldPrice && (
                  <Typography
                    color="text.secondary"
                    sx={{ textDecoration: "line-through" }}
                  >
                    ${suggestion.oldPrice}
                  </Typography>
                )}
                <Typography sx={priceStyle}>
                  ${suggestion.price.toFixed(2)}
                </Typography>
              </Box>
              <Typography color="text.secondary" fontSize={16} mb={1}>
                {suggestion.desc}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={6}
          mt={3}
        >
          <IconButton
            onClick={handleReject}
            sx={{
              bgcolor: "#222",
              color: "#fff",
              width: 64,
              height: 64,
              fontSize: 32,
              boxShadow: 4,
              "&:hover": { bgcolor: "#333" },
            }}
          >
            <Close fontSize="inherit" />
          </IconButton>
          <IconButton
            onClick={handleAccept}
            sx={{
              bgcolor: "linear-gradient(90deg, #ff5f6d, #ffc371)",
              color: "#fff",
              width: 64,
              height: 64,
              fontSize: 32,
              boxShadow: 4,
              "&:hover": { opacity: 0.9 },
            }}
          >
            <Favorite fontSize="inherit" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default SuggestionSwipePage;
