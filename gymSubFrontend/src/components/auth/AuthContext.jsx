import React, { createContext, useState, useEffect } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  // Check localStorage for authentication status on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token); // Store token in localStorage
    localStorage.setItem("isAuthenticated", "true"); // Store authentication status
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("isAuthenticated"); // Remove authentication status
    setIsAuthenticated(false);
  };

    // Value to be provided to consuming components
    const value = {
      isAuthenticated,
      login,
      logout,
    };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};