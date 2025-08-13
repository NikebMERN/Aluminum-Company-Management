// src/services/authService.js
import API from "./api";

export const login = (email, password) =>
    API.post("/auth/login", { email, password });

export const registerCustomer = (name, email, password, role) =>
    API.post("/auth/register", { name, email, password, role });
