import React from "react";
import { Box, Button, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./searchFilters.css";

interface SearchFiltersProps {
  filters: string[];
  onFilterChange: (index: number, value: string) => void;
}

const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <Box className="search-filters-container">
      <Box className="reset-button-container">
        <Button variant="outlined" className="reset-button" onClick={() => onFilterChange(-1, "")}>
          Reset Filters
        </Button>
      </Box>

      <Box className="filters">
        {filters.map((filter, index) => (
          <TextField
            key={index}
            variant="outlined"
            placeholder={filter}
            className="search-bar"
            onChange={(e) => onFilterChange(index, e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SearchFiltersComponent;
