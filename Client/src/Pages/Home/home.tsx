import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ResponsiveAppBar from "../../Components/Appbar/appbar";
import "./home.css";
import UserInfo from "../../Components/Userinfo/userinfo";
import Sidebar from "../../Components/Sidebar/sidebar";
import { Typography, Box } from "@mui/material";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import EntityInfoCard from "../../Components/EntityInfoCard/entityInfoCard";

const Home = () => {
  const location = useLocation();
  const { email, token } = location.state as { email: string; token: string };
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const entityMeta = decodedToken.entity_meta || {};
  const username = decodedToken.name;

  const entityDetailsArray = Object.keys(entityMeta).map((key) => ({
    title: key,
    entityId: key,
    value: entityMeta[key].join(", "),
  }));

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div>
      <ResponsiveAppBar name={username} />
      <div className="home-container">
        <Sidebar onToggle={setIsSidebarOpen} />
        <div className="content">
          <Typography
            variant="h4"
            sx={{
              textAlign: "left",
              marginLeft: isSidebarOpen ? "280px" : "90px", 
              marginTop: "1rem",
              transition: "margin-left 0.3s ease", 
            }}
          >
            Welcome, {decodedToken.given_name}
          </Typography>

          <UserInfo
            title="User Information"
            name={decodedToken.name}
            email={decodedToken.email}
            isSidebarOpen={isSidebarOpen}
          />

          <Typography
            variant="h5"
            sx={{
              textAlign: "left",
              marginLeft: isSidebarOpen ? "280px" : "90px", 
              marginTop: "1rem",
              transition: "margin-left 0.3s ease",
            }}
          >
            Entities
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              gap: "16px",
              marginLeft: isSidebarOpen ? "280px" : "90px", 
              marginTop: "20px",
              transition: "margin-left 0.3s ease",
            }}
          >
            {entityDetailsArray.length > 0 ? (
              entityDetailsArray.map((entity, index) => (
                <EntityInfoCard
                  key={index}
                  icon={
                    <AssuredWorkloadIcon sx={{ color: "green" }} fontSize="large" />
                  }
                  title={`Entity ${index + 1}`}
                  entityId={entity.entityId}
                  token={token}
                />
              ))
            ) : (
              <Typography variant="h6">
                No entities available for the user {email}
              </Typography>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Home;
