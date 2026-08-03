import React, { createContext, useState } from "react";

export const AuthContext = createContext();

function getStoredProfile() {
  const storedProfile = localStorage.getItem("profile");

  if (!storedProfile) {
    return null;
  }

  try {
    return JSON.parse(storedProfile);
  } catch {
    localStorage.removeItem("profile");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(() =>
    getStoredProfile()
  );

  const login = (authData) => {
    localStorage.setItem("token", authData.token);
    localStorage.setItem(
      "profile",
      JSON.stringify(authData.profile)
    );

    setToken(authData.token);
    setUser(authData.profile);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");

    setToken(null);
    setUser(null);
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role) ?? false;
  };

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    login,
    logout,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}