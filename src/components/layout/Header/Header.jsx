import React, { useEffect, useRef } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import "./header.scss";

export default function Header() {
  const { isAuthenticated, user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const account = useRef(null);
  const name =
    [user?.name, user?.surname].filter(Boolean).join(" ") ||
    user?.email ||
    "My account";
  useEffect(() => {
    account.current?.removeAttribute("open");
  }, [pathname]);
  useEffect(() => {
    const dismiss = (event) => {
      if (!account.current?.contains(event.target))
        account.current?.removeAttribute("open");
    };
    const escape = (event) => {
      if (event.key === "Escape" && account.current?.open) {
        account.current.removeAttribute("open");
        account.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  return (
    <header className="app-header">
      <div className="app-header__container">
        <Link className="app-header__brand" to="/" aria-label="GradFix reports">
          <span className="app-header__logo" aria-hidden="true">
            G
          </span>
          GradFix
        </Link>
        <nav className="app-header__navigation" aria-label="Main navigation">
          <NavLink to="/" end>
            Reports
          </NavLink>
          <NavLink to="/map">Map</NavLink>
          {!hasRole("Admin") && (
            <NavLink to="/report/new">Report damage</NavLink>
          )}
          {hasRole("Admin") && <NavLink to="/admin">Administration</NavLink>}
        </nav>
        <div className="app-header__account">
          {isAuthenticated ? (
            <details ref={account} className="account-menu">
              <summary>
                <span>{name}</span>
                <ChevronDown size={14} aria-hidden="true" />
              </summary>
              <nav
                className="account-menu__links"
                aria-label="Account navigation"
              >
                {hasRole("Citizen") && <Link to="/my-reports">My reports</Link>}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  <LogOut size={16} aria-hidden="true" />
                  Log out
                </button>
              </nav>
            </details>
          ) : (
            <Link className="app-header__login" to="/login">
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
