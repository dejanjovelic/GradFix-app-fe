import React from "react";
import {
  ClipboardList,
  Home,
  Map,
  PlusCircle,
  UserRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";

import "./bottom-navigation.scss";

function BottomNavigation() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="bottom-navigation" aria-label="Main navigation">
      <NavLink
        className={({ isActive }) =>
          `bottom-navigation__item ${
            isActive ? "bottom-navigation__item--active" : ""
          }`
        }
        to="/"
        end
      >
        <Home size={21} />
        <span>Home</span>
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          `bottom-navigation__item ${
            isActive ? "bottom-navigation__item--active" : ""
          }`
        }
        to="/map"
      >
        <Map size={21} />
        <span>Map</span>
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          `bottom-navigation__item bottom-navigation__item--primary ${
            isActive ? "bottom-navigation__item--active" : ""
          }`
        }
        to={isAuthenticated ? "/report/new" : "/login"}
        aria-label="Create new report"
      >
        <PlusCircle size={26} />
        <span>Report</span>
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          `bottom-navigation__item ${
            isActive ? "bottom-navigation__item--active" : ""
          }`
        }
        to={isAuthenticated ? "/my-reports" : "/login"}
      >
        <ClipboardList size={21} />
        <span>My reports</span>
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          `bottom-navigation__item ${
            isActive ? "bottom-navigation__item--active" : ""
          }`
        }
        to={isAuthenticated ? "/profile" : "/login"}
      >
        <UserRound size={21} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}

export default BottomNavigation;