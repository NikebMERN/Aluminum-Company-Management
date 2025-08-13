// src/services/adminService.js
import API from "./api";

export const getAllSubAdmins = () => API.get("/admin/subadmins");

export const createSubAdmin = (name, email, password) =>
    API.post("/admin/create-subadmin", { name, email, password });

export const assignAluminum = (
    subAdminId,
    shape,
    quantity,
    price_per_item,
    imageFile
) => {
    const formData = new FormData();
    formData.append("subAdminId", subAdminId);
    formData.append("shape", shape);
    formData.append("quantity", quantity);
    formData.append("price_per_item", price_per_item);
    if (imageFile) formData.append("image", imageFile);

    return API.post("/admin/assign-aluminum", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const getAllAluminum = () => API.get("/admin/aluminum");

export const getRevenueReport = () => API.get("/sales/revenue-report");
