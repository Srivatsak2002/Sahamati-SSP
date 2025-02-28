import * as React from "react";
import { Box, TextField, InputAdornment, Paper, Popover } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Enhanced DateRangePicker component
export const EnhancedDateRangePicker = ({ 
  dateRange, 
  setDateRange 
}: {
  dateRange: [Date | null, Date | null];
  setDateRange: React.Dispatch<React.SetStateAction<[Date | null, Date | null]>>;
}) => {
  const [startDate, endDate] = dateRange;
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    } else if (startDate) {
      return `${startDate.toLocaleDateString()} - Select end date`;
    } else {
      return "";
    }
  };

  const handleClear = () => {
    setDateRange([null, null]);
  };

  return (
    <Box>
      <Box ref={anchorRef}>
        <TextField
          variant="outlined"
          placeholder="Select date range"
          className="secret-search-bar"
          value={formatDateRange()}
          onClick={() => setOpen(true)}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <CalendarTodayIcon 
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpen(true)}
                />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          elevation: 3,
          sx: { 
            mt: 1, 
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              left: 20,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          }
        }}
      >
        <Box sx={{ p: 1 }}>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update: [Date | null, Date | null]) => {
              setDateRange(update);
              if (update[0] && update[1]) {
                setOpen(false);
              }
            }}
            inline
            isClearable={false}
          />
        </Box>
      </Popover>
    </Box>
  );
};
