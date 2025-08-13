// src/services/subAdminService.js
import API from "./api";

export const getAssignedItems = () => API.get("/subadmin/items");

export const updateSoldQuantity = (itemId, quantitySold) =>
    API.put("/subadmin/update-sold", { itemId, quantitySold });

export const notifySoldOut = (toEmail, subject, message) =>
    API.post("/notifications/notify-stock-soldout", { toEmail, subject, message });
