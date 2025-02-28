import * as React from "react";
import { Box, Button, TextField, InputAdornment, Link } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TabsComponent from "../../Components/TabsComponent/tabsComponent";
import { fetchTokenData } from "../../Services/api";
import "./tokenTableDashboard.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CustomTable from "../../Components/Table/table";

const mainColumns = [
  { id: "sno", label: "S.NO", minWidth: 50, align: "center" as const },
  {
    id: "entity_name",
    label: "Entity Name",
    minWidth: 150,
    align: "left" as const,
  },
  {
    id: "entity_id",
    label: "Entity ID",
    minWidth: 150,
    align: "left" as const,
  },
  {
    id: "recent_timestamp",
    label: "Recent Token Issued Timestamp",
    minWidth: 200,
    align: "center" as const,
  },
  {
    id: "tokens_issued",
    label: "Tokens Issued",
    minWidth: 100,
    align: "center" as const,
  },
];

const detailColumns = [
  { id: "sno", label: "S.NO", minWidth: 50, align: "center" as const },
  { id: "date", label: "Date", minWidth: 150, align: "center" as const },
  {
    id: "tokens_issued",
    label: "Tokens Issued",
    minWidth: 100,
    align: "center" as const,
  },
];

export default function TokenTableContainer() {
  const [rawData, setRawData] = React.useState<any[]>([]);
  const [data, setData] = React.useState<any[]>([]);
  const [filteredData, setFilteredData] = React.useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = React.useState<string | null>(
    null
  );
  const [selectedEntityInfo, setSelectedEntityInfo] = React.useState<any>(null);
  const [filters, setFilters] = React.useState<{ [key: string]: string }>({});
  const [selectedTab, setSelectedTab] = React.useState<string>("Token Details");
  const [tableData, setTableData] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadData();
  }, []);

  React.useEffect(() => {
    if (filters.expiryDate) {
      const filteredRawData = filterRawDataByDate(rawData, filters.expiryDate);
      const transformedData = transformData(filteredRawData);
      setData(transformedData);

      applyFilters(transformedData);
    } else {
      const transformedData = transformData(rawData);
      setData(transformedData);

      applyFilters(transformedData);
    }
  }, [rawData, filters]);

  // Prepare table data when filtered data changes
  React.useEffect(() => {
    prepareTableData();
  }, [filteredData, selectedEntity]);

  const loadData = async () => {
    const apiData = await fetchTokenData();
    setRawData(apiData);
  };

  // Function to filter raw data by specific date
  const filterRawDataByDate = (data: any[], dateStr: string) => {
    const searchDate = new Date(dateStr);
    if (isNaN(searchDate.getTime())) {
      return data;
    }

    return data.filter((item) => {
      const itemDate = new Date(item.__time);
      return (
        itemDate.getDate() === searchDate.getDate() &&
        itemDate.getMonth() === searchDate.getMonth() &&
        itemDate.getFullYear() === searchDate.getFullYear()
      );
    });
  };

  const transformData = (apiData: any[]): any[] => {
    const entityMap: Record<string, any> = {};
    apiData.forEach((item) => {
      const entityId = item.entity_id;
      const itemDate = new Date(item.__time);

      if (!entityMap[entityId]) {
        entityMap[entityId] = {
          entity_name: item.entity_name,
          entity_id: entityId,
          recent_timestamp: item.__time,
          tokens_issued: item.tokens_issued,
          details: [
            {
              date: item.__time,
              tokens_issued: item.tokens_issued,
              raw_date: itemDate,
            },
          ],
        };
      } else {
        entityMap[entityId].tokens_issued += item.tokens_issued;
        entityMap[entityId].recent_timestamp =
          new Date(entityMap[entityId].recent_timestamp) > new Date(item.__time)
            ? entityMap[entityId].recent_timestamp
            : item.__time;
        entityMap[entityId].details.push({
          date: item.__time,
          tokens_issued: item.tokens_issued,
          raw_date: itemDate,
        });
      }
    });

    return Object.values(entityMap).map((row, index) => ({
      sno: index + 1,
      ...row,
      recent_timestamp: new Date(row.recent_timestamp).toLocaleString(),
      raw_timestamp: new Date(row.recent_timestamp),
    }));
  };

  const applyFilters = (dataToFilter = data) => {
    let filtered = [...dataToFilter];

    // Apply entity name filter
    if (filters.entityName) {
      const searchTerm = filters.entityName.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          typeof item.entity_name === "string" &&
          item.entity_name.toLowerCase().includes(searchTerm)
      );
    }

    // Apply entity ID filter
    if (filters.entityId) {
      const searchTerm = filters.entityId.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          typeof item.entity_id === "string" &&
          item.entity_id.toLowerCase().includes(searchTerm)
      );
    }

    // Update filtered data with sequential S.NO
    filtered = filtered.map((item, index) => ({
      ...item,
      sno: index + 1,
    }));

    setFilteredData(filtered);
  };
  const prepareTableData = () => {
    if (selectedEntity) {
      // Find the entity in filtered data
      const selectedEntityData = filteredData.find(
        (e) => e.entity_id === selectedEntity
      );
  
      if (!selectedEntityData) {
        setTableData([]);
        return;
      }
  
      // Group details by date and sum tokens
      const dateMap: Record<string, { tokens: number, timestamp: number }> = {};
      
      selectedEntityData.details.forEach((detail: any) => {
        // Create a date object
        const dateObj = new Date(detail.date);
        
        // Format date as YYYY-MM-DD for grouping
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        
        if (!dateMap[dateKey]) {
          dateMap[dateKey] = {
            tokens: 0,
            timestamp: new Date(`${year}-${month}-${day}`).getTime()
          };
        }
        
        dateMap[dateKey].tokens += detail.tokens_issued;
      });
  
      // Convert the grouped data to array format
      const entityData = Object.entries(dateMap).map(([dateKey, data]) => {
        // Create a date object for display formatting
        const dateObj = new Date(dateKey);
        const displayDate = dateObj.toLocaleDateString();
        
        return {
          date: displayDate,
          tokens_issued: data.tokens,
          timestamp: data.timestamp // Store timestamp for sorting
        };
      });
  
      // Sort by date (most recent first)
      entityData.sort((a, b) => b.timestamp - a.timestamp);
  
      // Assign S.NO after sorting
      const finalEntityData = entityData.map((item, index) => ({
        sno: index + 1,
        date: item.date,
        tokens_issued: item.tokens_issued
      }));
  
      setTableData(finalEntityData);
    } else {
      const mainData = filteredData.map((row) => ({
        ...row,
        entity_name: (
          <Link
            component="button"
            variant="body2"
            onClick={() => handleEntitySelect(row)}
          >
            {row.entity_name}
          </Link>
        ),
      }));
  
      setTableData(mainData);
    }
  };
  const handleEntitySelect = (entityRow: any) => {
    setSelectedEntityInfo({
      name: entityRow.entity_name,
      id: entityRow.entity_id,
    });
    setSelectedEntity(entityRow.entity_id);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({});
    setSelectedEntity(null);
    setSelectedEntityInfo(null);
  };

  return (
    <TabsComponent
      tabs={["Token Details"]}
      title="Entity Token Usage"
      onTabChange={setSelectedTab}
    >
      {selectedTab === "Token Details" ? (
        <Box className="token-details-container">
          <Box className="search-filters-container">
            <Box className="filters">
              {/* Date Picker */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="For a specific past date"
                  value={filters.expiryDate ? dayjs(filters.expiryDate) : null}
                  onChange={(newDate: Dayjs | null) => {
                    handleFilterChange(
                      "expiryDate",
                      newDate ? newDate.format("YYYY-MM-DD") : ""
                    );
                  }}
                  slotProps={{
                    textField: { variant: "outlined", className: "search-bar" },
                  }}
                />
              </LocalizationProvider>
              {/* Entity ID field */}
              <TextField
                variant="outlined"
                placeholder="Search by entity ID"
                className="search-bar"
                value={filters.entityId || ""}
                onChange={(e) => handleFilterChange("entityId", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Entity Name field */}
              <TextField
                variant="outlined"
                placeholder="Search by entity name"
                className="search-bar"
                value={filters.entityName || ""}
                onChange={(e) =>
                  handleFilterChange("entityName", e.target.value)
                }
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
                className="reset-button"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </Box>
          </Box>
          {selectedEntity ? (
            <Box>
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  setSelectedEntity(null);
                  setSelectedEntityInfo(null);
                }}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  mb: 2,
                  cursor: "pointer",
                }}
              >
                ← Back
              </Link>
              <Box sx={{ fontWeight: "bold", fontSize: "16px", mb: 2 }}>
                Entity Name:{" "}
                {selectedEntityInfo ? selectedEntityInfo.name : "N/A"}
              </Box>
              <CustomTable
                columns={detailColumns}
                data={tableData}
                filters={{}}
              />
              {tableData.length === 0 && (
                <Box className="no-data" sx={{ textAlign: "center", py: 4 }}>
                  No matching data found
                </Box>
              )}
            </Box>
          ) : (
            <>
              <CustomTable
                columns={mainColumns}
                data={tableData}
                filters={{}}
              />
              {tableData.length === 0 && (
                <Box className="no-data" sx={{ textAlign: "center", py: 4 }}>
                  No matching data found
                </Box>
              )}
            </>
          )}
        </Box>
      ) : (
        <Box className="no-data">No data found</Box>
      )}
    </TabsComponent>
  );
}
