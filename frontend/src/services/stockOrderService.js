// src/services/stockService.js
import API from "./api";

// ✅ Super Admin: create new stock request
export const createStockRequest = (data) =>
    API.post("/stock/create", data);

// ✅ Super Admin: choose winning quotation (finalize price)
export const selectQuotation = (data) =>
    API.put("/stock/select-quotation", data);

// ✅ Super Admin: get all stock requests
export const getAllStockRequests = () => API.get("/stock/requests");

// ✅ Super Admin & Sub Admin: get details of a specific stock request
export const getStockRequestById = (id) =>
    API.get(`/stock/subadmin/${id}`);

// ✅ Sub Admin: submit quotations for a request
export const submitQuotations = (companyData) =>
    API.post(`/stock/quotations`, companyData);

// ✅ Sub Admin: deduct stock items when used by engineers
export const useStockItem = (data) =>
    API.post("/stock/use-stock", data);

export const getQuotationsByRequest = (requestId) =>
    API.get(`/stock/quotations/${requestId}`);

export const getStockDetailsBySubAdmin = (id) => {
    // console.log(id)
    const detail = API.get(`/stock/sub-admin/${id}`);
    console.log(detail);
    return detail;
}

export const approveStockQuotation = (quotationId) =>
    API.post(`/stock/quotations/${quotationId}/approve`);

export const disapproveStockQuotation = (id) => 
    API.patch(`/stock/quotations/${id}`);


