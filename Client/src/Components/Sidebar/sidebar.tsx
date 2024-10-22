import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import AppsIcon from "@mui/icons-material/Apps";
import DashboardIcon from "@mui/icons-material/Dashboard";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { useLocation } from "react-router-dom";
import "./sidebar.css";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true); 
  const dashboardLink = process.env.REACT_APP_DASHBOARD_URL;

  const toggleSidebar = () => {
    setIsOpen(!isOpen); 
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className={`sidebar-header ${isOpen ? "open" : "closed"}`}>
        <button onClick={toggleSidebar} className="toggle-button">
          {isOpen ? <KeyboardDoubleArrowLeftIcon /> : <KeyboardDoubleArrowRightIcon />} 
        </button>
      </div>
      <nav className="sidebar-menu">
        <ul>
          <li>
            <a
              href="/home"
              className={location.pathname === "/home" ? "active" : ""}
            >
              <HomeIcon className="sidebar-icon" />
              {isOpen && "Home"}
            </a>
          </li>
          <li>
            <a href={dashboardLink} target="_blank" rel="noopener noreferrer">
              <DashboardIcon className="sidebar-icon" />
              {isOpen && "Dashboard"}
            </a>
          </li>
          <li>
            <a
              href="/profile"
              className={location.pathname === "/profile" ? "active" : ""}
            >
              <PersonIcon className="sidebar-icon" />
              {isOpen && "Profile"}
            </a>
          </li>
          <li>
            <a
              href="/users"
              className={location.pathname === "/users" ? "active" : ""}
            >
              <GroupIcon className="sidebar-icon" />
              {isOpen && "Users"}
            </a>
          </li>
          <li>
            <a
              href="/settings"
              className={location.pathname === "/settings" ? "active" : ""}
            >
              <AppsIcon className="sidebar-icon" />
              {isOpen && "Settings"}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
