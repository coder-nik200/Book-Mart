// import React, { createContext, useState, useEffect, useCallback } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Check if user is logged in on mount
//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     const savedUser = localStorage.getItem("user");

//     if (token && savedUser) {
//       setUser(JSON.parse(savedUser));
//       setIsAuthenticated(true);
//     }

//     setLoading(false);
//   }, []);

//   const login = useCallback((userData, accessToken) => {
//     setUser(userData);
//     setIsAuthenticated(true);
//     localStorage.setItem("accessToken", accessToken);
//     localStorage.setItem("user", JSON.stringify(userData));
//   }, []);

//   const logout = useCallback(() => {
//     setUser(null);
//     setIsAuthenticated(false);
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("user");
//   }, []);

//   const value = {
//     user,
//     isAuthenticated,
//     loading,
//     login,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = React.useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/apiClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USER ON APP START ================= */
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authAPI.getCurrentUser();
        setUser(res.data.user);
      } catch {
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /* ================= LOGIN ================= */
  const login = useCallback((userData, accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    setUser(userData);
  }, []);

  /* ================= LOGOUT ================= */
  const logout = useCallback(async () => {
    try {
      await authAPI.logout(); // backend logout (cookie / session cleanup)
    } catch {
      // ignore backend failure
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);               // 🔥 clears profile data
      navigate("/", { replace: true }); // 🔥 redirect to home
    }
  }, [navigate]);

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};