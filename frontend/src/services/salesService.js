// src/services/salesService.js
import API from "./api";

export const getSalesData = () => API.get("/sales");

export const getRevenueReport = (id) => API.get(`/sales/revenue-report/${id}`);
