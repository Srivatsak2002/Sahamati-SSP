import * as React from "react";
import { Box, Button, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TabsComponent from "../../Components/TabsComponent/tabsComponent";
import { fetchSecretExpiryData } from "../../Services/api";
import CustomTable from "../../Components/Table/table";
import "./secretExpiryDashboard.css";
import "react-datepicker/dist/react-datepicker.css";
import { EnhancedDateRangePicker } from "../../Components/Datepicker/datepicker";


const columns = [
  { id: "sno", label: "S.NO", minWidth: 50, align: "center" as const },
  { id: "id", label: "Entity ID", minWidth: 150, align: "left" as const },
  { id: "name", label: "Entity Name", minWidth: 150, align: "left" as const },
  { id: "type", label: "Type", minWidth: 100, align: "center" as const },
  {
    id: "expiryDate",
    label: "Expiry Date",
    minWidth: 150,
    align: "center" as const,
  },
  {
    id: "expiresIn",
    label: "Expires In ",
    minWidth: 200,
    align: "center" as const,
  },
];

export default function SecretExpiryTableContainer() {
  const [rawData, setRawData] = React.useState<any[]>([]);
  const [filteredData, setFilteredData] = React.useState<any[]>([]);
  const [dateRange, setDateRange] = React.useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const [filters, setFilters] = React.useState<{ [key: string]: string }>({});

  React.useEffect(() => {
    loadData();
  }, []);

  React.useEffect(() => {
    applyFilters();
  }, [rawData, filters, dateRange]);

  const loadData = async () => {
    const apiData = await fetchSecretExpiryData();
    setRawData(apiData);
  };

  const calculateDaysLeft = (expiryDate: string) => {
    const parts = expiryDate.split(/[-\/]/);

    if (parts.length !== 3) {
      return NaN;
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const expiry = new Date(year, month, day);
    const today = new Date();

    expiry.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const difference = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return difference;
  };

  const parseExpiryDate = (expiryDate: string): Date => {
    const parts = expiryDate.split(/[-\/]/);
    if (parts.length !== 3) {
      return new Date(NaN);
    }
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  };

  const applyFilters = () => {
    let filtered = [...rawData];

    if (filters.id) {
      filtered = filtered.filter((item) =>
        item.id.toLowerCase().includes(filters.id.toLowerCase())
      );
    }

    if (filters.name) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter((item) =>
        item.type.toLowerCase().includes(filters.type.toLowerCase())
      );
    }

    // Filter by date range if both start and end dates are set
    if (startDate && endDate) {
      const endDateWithFullDay = new Date(endDate);
      endDateWithFullDay.setHours(23, 59, 59, 999);

      filtered = filtered.filter((item) => {
        const expiryDate = parseExpiryDate(item.expiryDate);
        return expiryDate >= startDate && expiryDate <= endDateWithFullDay;
      });
    }

    setFilteredData(
      filtered.map((item, index) => ({
        ...item,
        sno: index + 1,
        expiresIn: calculateDaysLeft(item.expiryDate),
      }))
    );
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({});
    setDateRange([null, null]);
  };

  // Custom input component to make react-datepicker look like MUI
  const CustomInput = React.forwardRef(({ value, onClick }: any, ref: any) => (
    <TextField
      inputRef={ref}
      variant="outlined"
      placeholder="Search by date range"
      className="secret-search-bar"
      value={value}
      onClick={onClick}
      InputProps={{
        readOnly: true,
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{ width: "300px" }}
    />
  ));

  return (
    <TabsComponent
      tabs={["Expiry Details"]}
      title="Expiry Data"
      onTabChange={() => {}}
    >
      <Box className="secret-details-container">
        <Box className="secret-search-filters-container">
          <Box className="secret-filters">
            <EnhancedDateRangePicker
              dateRange={dateRange}
              setDateRange={setDateRange}
            />

            <TextField
              variant="outlined"
              placeholder="Search by ID"
              className="secret-search-bar"
              value={filters.id || ""}
              onChange={(e) => handleFilterChange("id", e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              placeholder="Search by Name"
              className="secret-search-bar"
              value={filters.name || ""}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              placeholder="Search by Type"
              className="type-search-bar"
              value={filters.type || ""}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              className="secret-reset-button"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </Box>
        </Box>
        <CustomTable columns={columns} data={filteredData} filters={{}} />
        {filteredData.length === 0 && (
          <Box className="secret-no-data" sx={{ textAlign: "center", py: 4 }}>
            No matching data found
          </Box>
        )}
      </Box>
    </TabsComponent>
  );
}
