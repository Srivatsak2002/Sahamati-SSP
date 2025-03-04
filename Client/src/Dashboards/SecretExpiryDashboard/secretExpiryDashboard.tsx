import * as React from "react";
import { Box, Button, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TabsComponent from "../../Components/TabsComponent/tabsComponent";
import { useApi } from "../../Services/api";
import CustomTable from "../../Components/Table/table";
import "./secretExpiryDashboard.css";
import "react-datepicker/dist/react-datepicker.css";
import { DateRangePicker } from "../../Components/Datepicker/datepicker";
import CircularIndeterminate from "../../Components/CircularProgress/circularProgress";
import { useConfig } from "../../Context/configContext";

  

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
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const { fetchSecretExpiryData } = useApi();
  const config = useConfig();
  const DISPLAY_ENTITIES_WITHOUT_EXPIRYDATE = config.REACT_APP_DISPLAY_ENTITIES_WITHOUT_EXPIRYDATE || false;


  React.useEffect(() => {
    loadData();
  }, []);

  React.useEffect(() => {
    applyFilters();
  }, [rawData, filters, dateRange]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const apiData = await fetchSecretExpiryData();
      setRawData(apiData);
    } catch (error) {
      console.error("Failed to fetch secret expiry data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDaysLeft = (expiryDateString: string | null) => {
    if (!expiryDateString) {
      return NaN;
    }

    const expiryDate = new Date(expiryDateString);
    if (isNaN(expiryDate.getTime())) {
      return NaN;
    }

    const today = new Date();

    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const difference = Math.ceil(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return difference;
  };

  const formatExpiryDate = (expiryDateString: string | null) => {
    if (!expiryDateString) return "Not Available";

    const expiryDate = new Date(expiryDateString);
    if (isNaN(expiryDate.getTime())) {
      return "Invalid Date";
    }
    return expiryDate.toISOString().split("T")[0];
  };

  const applyFilters = () => {
    let filtered = [...rawData];

    if (!DISPLAY_ENTITIES_WITHOUT_EXPIRYDATE) {
      filtered = filtered.filter(
        (item) => item.hasOwnProperty("expiryDate") && item.expiryDate !== null
      );
    }

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

    if (startDate && endDate) {
      const endDateWithFullDay = new Date(endDate);
      endDateWithFullDay.setHours(23, 59, 59, 999);

      filtered = filtered.filter((item) => {
        if (!item.hasOwnProperty("expiryDate") || item.expiryDate === null) {
          return DISPLAY_ENTITIES_WITHOUT_EXPIRYDATE;
        }

        const expiryDate = new Date(item.expiryDate);
        return expiryDate >= startDate && expiryDate <= endDateWithFullDay;
      });
    }

    setFilteredData(
      filtered.map((item, index) => ({
        ...item,
        sno: index + 1,
        expiresIn:
          item.hasOwnProperty("expiryDate") && item.expiryDate !== null
            ? calculateDaysLeft(item.expiryDate)
            : "N/A",
        expiryDate: item.hasOwnProperty("expiryDate")
          ? formatExpiryDate(item.expiryDate)
          : "Not Available",
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

  return (
    <TabsComponent
      tabs={["Expiry Details"]}
      onTabChange={() => {}}
    >
      <Box className="secret-details-container">
        <Box className="secret-search-filters-container">
          <Box className="secret-filters">
            <DateRangePicker
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

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularIndeterminate />
          </Box>
        ) : (
          <>
            <CustomTable columns={columns} data={filteredData} filters={{}} />
            {filteredData.length === 0 && (
              <Box
                className="secret-no-data"
                sx={{ textAlign: "center", py: 4 }}
              >
                No records found, Kindly check the filter values applied
              </Box>
            )}
          </>
        )}
      </Box>
    </TabsComponent>
  );
}
