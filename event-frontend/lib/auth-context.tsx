"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const checkAuth = useCallback(() => {
    const token = Cookies.get("token");
    const isMissing = !token || token === "undefined" || token === "null";
    setIsAuthenticated(!isMissing);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = (token: string) => {
    Cookies.set("token", token, { expires: 1 });
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    router.push("/");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
