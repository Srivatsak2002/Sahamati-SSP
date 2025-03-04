import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import "./tabsComponent.css";

interface TabsComponentProps {
  tabs: string[];
  onTabChange: (tab: string) => void;
  children?: React.ReactNode;
}

export default function TabsComponent({
  tabs,
  onTabChange,
  children,
}: TabsComponentProps) {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    onTabChange(tabs[newValue]);
  };

  return (
    <Box className="container">
      {/* <Box className="header">
        <img src="images/sahamati-logo.png" alt="Sahamati Logo" className="logo" />
      </Box> */}

      <Tabs value={tabValue} onChange={handleTabChange} className="tabs">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab}
            className={`tab ${tabValue === index ? "active-tab" : ""}`}
          />
        ))}
      </Tabs>

      <Box className="tab-content">{children}</Box>
    </Box>
  );
}
