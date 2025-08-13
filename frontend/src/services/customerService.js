// src/services/customerService.js
import API from "./api";

export const getAvailableItems = () => API.get("/customer/items");

export const deductSoldQuantity = (itemId, quantitySold) =>
    API.put("/deduct/update-sold", { itemId, quantitySold });

export const placeOrder = (orderData) =>
    API.post("/customer/place-order", orderData);

export const getMyOrders = () => API.get("/customer/orders");
