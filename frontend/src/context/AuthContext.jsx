// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { login as loginService, registerCustomer } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // useEffect(() => {
  //   if (token) {
  //     const storedUser = JSON.parse(localStorage.getItem("user"));
  //     setUser(storedUser);
  //     setRole(storedUser?.role);
  //   }
  // }, [token]);

  const login = async (email, password, selectedRole) => {
    const res = await loginService(email, password);
    const userData = res.data.user;
    setUser(userData);
    setRole(userData.role);
    setToken(res.data.token);
    if (selectedRole === userData.role) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", selectedRole);
    } else {
      throw new Error("Role mismatch");
    }
    
    // localStorage.setItem("user", JSON.stringify(userData));
  };

  const register = async (name, email, password, role) => {
    await registerCustomer(name, email, password, role);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
