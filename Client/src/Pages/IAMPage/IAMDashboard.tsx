import React, { useState } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import TokenTableContainer from "../TokensDashboard/tokenTableDashboard";
import "./IAMDashboard.css";
import SecretExpiryTableContainer from "../SecretExpiryDashboard/secretExpiryDashboard";

const tabs = ["Secret Expiry", "Entity Tokens"];

const IAMDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Card className="dashboard-container">
      <CardContent>
        <Typography variant="h4" className="dashboard-title">
          Identity And Access Management (IAM)
        </Typography>
        
        {/* Custom Tab Navigation */}
        <Box className="tabs-container">
          {tabs.map((tab, index) => (
            <Box
              key={index}
              onClick={() => setActiveTab(index)}
              className={`tab ${activeTab === index ? "active" : ""}`}
            >
              {tab}
            </Box>
          ))}
        </Box>

        {/* Content Area */}
        <Box className="content-container">
          {activeTab === 0 && <SecretExpiryTableContainer/>}
          {activeTab === 1 && <TokenTableContainer />}
          {activeTab === 2 && <Typography>User Tokens Content (To be implemented)</Typography>}
          {activeTab === 3 && <Typography>Login Activity Content (To be implemented)</Typography>}
        </Box>
      </CardContent>
    </Card>
  );
};

export default IAMDashboard;
