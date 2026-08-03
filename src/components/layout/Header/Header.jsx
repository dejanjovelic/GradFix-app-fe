import React from "react";
import { LogIn, LogOut, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";

import "./header.scss";

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="app-header__container">
        <Link className="app-header__brand" to="/">
          <span className="app-header__logo" aria-hidden="true">
            <MapPin size={22} />
          </span>

          <span>GradFix</span>
        </Link>

        <div className="app-header__actions">
          {isAuthenticated ? (
            <>
              <span className="app-header__user">
                {user?.name || user?.email}
              </span>

              <button
                className="app-header__action"
                type="button"
                onClick={handleLogout}
                aria-label="Log out"
              >
                <LogOut size={20} />
                <span>Log out</span>
              </button>
            </>
          ) : (
            <Link className="app-header__action" to="/login">
              <LogIn size={20} />
              <span>Log in</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;