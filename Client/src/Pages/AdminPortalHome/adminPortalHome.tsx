import * as React from "react";
import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import SecurityIcon from "@mui/icons-material/Security";
import PeopleIcon from "@mui/icons-material/People";
import KeyIcon from "@mui/icons-material/Key";
import IAMDashboard from "../IAMPage/IAMDashboard";

const LOGO_HEIGHT = 34;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function AdminPortalHome() { 
  const [value, setValue] = React.useState(1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box sx={{ padding: 2, height: `${LOGO_HEIGHT}px`, flexShrink: 0 }}>
        <img
          src="images/sahamati-logo.png"
          alt="Sahamati Logo"
          className="logo"
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          bgcolor: "#f5f5f5",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            width: 240,
            flexShrink: 0,
            bgcolor: "#f5f5f5",
            borderRight: "1px solid #e0e0e0",
            height: `calc(100vh - ${LOGO_HEIGHT}px)`,
            paddingTop: 2,
            overflowY: "auto",
          }}
        >
          <Box sx={{ pl: 2, mb: 4 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              display="flex"
              alignItems="center"
              color="#333"
            >
              <Box
                component="span"
                sx={{
                  mr: 1,
                  display: "flex",
                  alignItems: "center",
                  color: "#1976d2",
                }}
              >
                <SettingsIcon sx={{ color: "#240F9B" }} />
              </Box>
              L1 Ops
            </Typography>
          </Box>

          <Typography
            variant="subtitle2"
            sx={{ pl: 2, mb: 1, color: "#757575", fontWeight: "bold" }}
          >
            Applications
          </Typography>

          <Tabs
            orientation="vertical"
            variant="standard"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider", height: "auto" }}
          >
            <Tab
              {...a11yProps(0)}
              sx={{
                textTransform: "none",
                justifyContent: "flex-start",
                minWidth: "220px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
              icon={<SecurityIcon />}
              iconPosition="start"
              label={
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  Central Registry (CR)
                </Box>
              }
            />
            <Tab
              {...a11yProps(1)}
              sx={{
                textTransform: "none",
                justifyContent: "flex-start",
                minWidth: "220px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
              icon={<PeopleIcon />}
              iconPosition="start"
              label={
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  Identity And Access Management (IAM)
                </Box>
              }
            />
            <Tab
              {...a11yProps(2)}
              sx={{
                textTransform: "none",
                justifyContent: "flex-start",
                minWidth: "220px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
              icon={<KeyIcon />}
              iconPosition="start"
              label={
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  Password Reset
                </Box>
              }
            />
          </Tabs>
        </Paper>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            p: 2,
            overflow: "hidden",
          }}
        >
          <TabPanel value={value} index={0}>
            <Typography variant="body1" sx={{ minHeight: "100px" }}>
              Central Registry: To be implemented
            </Typography>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <IAMDashboard />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Typography variant="body1" sx={{ minHeight: "100px" }}>
              Password Reset: To be implemented
            </Typography>
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
}
