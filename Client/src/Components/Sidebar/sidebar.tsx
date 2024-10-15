import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import AppsIcon from "@mui/icons-material/Apps";
import BookIcon from "@mui/icons-material/Book";
import { useLocation } from "react-router-dom";
import "./sidebar.css";

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <nav className="sidebar-menu">
        <ul>
          <li>
            <a
              href="/home"
              className={location.pathname === "/home" ? "active" : ""}
            >
              <HomeIcon className="sidebar-icon" />
              Home
            </a>
          </li>
          <li>
            <a
              href="/profile"
              className={location.pathname === "/profile" ? "active" : ""}
            >
              <PersonIcon className="sidebar-icon" />
              Profile
            </a>
          </li>
          <li>
            <a
              href="/users"
              className={location.pathname === "/users" ? "active" : ""}
            >
              <GroupIcon className="sidebar-icon" />
              Users
            </a>
          </li>
          <li>
            <a
              href="/settings"
              className={location.pathname === "/settings" ? "active" : ""}
            >
              <AppsIcon className="sidebar-icon" />
              Settings
            </a>
          </li>
          <li>
            <a
              href="/explore-terminology"
              className={
                location.pathname === "/explore-terminology" ? "active" : ""
              }
            >
              <BookIcon className="sidebar-icon" />
              Explore
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
