import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ value, onChange }) => (
  <TextField
    size="small"
    placeholder="Search products..."
    value={value}
    onChange={onChange}
    sx={{ bgcolor: "#fff", borderRadius: 2, minWidth: 260 }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon sx={{ color: "grey.500" }} />
        </InputAdornment>
      ),
    }}
  />
);

export default SearchBar;
