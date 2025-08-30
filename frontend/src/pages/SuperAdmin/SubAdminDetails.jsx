import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRevenueReport } from "../../services/salesService";
import { getStockDetailsBySubAdmin } from "../../services/stockOrderService";
import { useNotification } from "../../hooks/useNotification";
import Sidebar from "../../components/layouts/Sidebar";
import Topbar from "../../components/layouts/Topbar";
import { motion, AnimatePresence } from "framer-motion";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function SubAdminDetails() {
    const { id } = useParams();
    const [items, setItems] = useState([]);
    const [stockDetails, setStockDetails] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [quotationExpanded, setQuotationExpanded] = useState({});
    const { notifyError } = useNotification();

    useEffect(() => {
        (async () => {
            try {
                const res = await getRevenueReport(id);
                const details = await getStockDetailsBySubAdmin(id);
                setItems(res.data);
                setStockDetails(details.data);
            } catch {
                notifyError("Failed to fetch sub-admin details");
            }
        })();
    }, [id]);

    if (!items.length && !stockDetails.length) {
        return (
            <div className="flex justify-center items-center h-screen text-lg">
                Loading sub-admin details(There is no sub-admin details)...
            </div>
        );
    }

    // Revenue Calculations
    let totalRevenue = 0;
    let totalItemsSold = 0;
    let totalItemsAssigned = 0;

    items.forEach((item) => {
        const sold = Number(item.total_sold) || 0;
        const assigned = Number(item.given_quantity) || 0;
        const price = Number(item.price_per_item) || 0;

        totalItemsSold += sold;
        totalItemsAssigned += assigned;
        totalRevenue += sold * price;
    });

    const totalRemaining = totalItemsAssigned - totalItemsSold;

    // Status color map
    const statusColor = {
        pending: "bg-red-100",
        quotation_collected: "bg-yellow-100",
        price_selected: "bg-green-100",
    };

    return (
        <div>
            <Topbar title="Sub-Admin Full Details" />
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 p-6 bg-gray-50">
                    <div className="mt-6 bg-white shadow-md rounded p-6 max-w-6xl mx-auto">
                        <h3 className="text-lg font-semibold mb-6">Sub Admin ID: {id}</h3>

                        {/* Revenue Summary */}
                        <h4 className="text-md font-semibold mb-2">Revenue Summary</h4>
                        <table className="w-full border-collapse border border-gray-300 mb-6 text-sm">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border px-4 py-2 text-left">Item Name</th>
                                    <th className="border px-4 py-2 text-left">Price per Item</th>
                                    <th className="border px-4 py-2 text-left">Assigned Qty</th>
                                    <th className="border px-4 py-2 text-left">Sold</th>
                                    <th className="border px-4 py-2 text-left">Remaining</th>
                                    <th className="border px-4 py-2 text-left">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items?.map((item) => {
                                    const remaining = item.given_quantity - item.total_sold;
                                    return (
                                        <tr key={item.item_id}>
                                            <td className="border px-4 py-2">{item.item_name}</td>
                                            <td className="border px-4 py-2">
                                                ${item.price_per_item}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {item.given_quantity}
                                            </td>
                                            <td className="border px-4 py-2">{item.total_sold}</td>
                                            <td
                                                className={`border px-4 py-2 font-semibold ${remaining === 0 ? "text-red-600" : "text-green-600"
                                                    }`}
                                            >
                                                {remaining}
                                            </td>
                                            <td className="border px-4 py-2 font-semibold">
                                                ${item.total_sold * item.price_per_item}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="mb-6 space-y-2 text-sm">
                            <p className="font-semibold">
                                Total Revenue:{" "}
                                <span className="text-green-700">${totalRevenue}</span>
                            </p>
                            <p className="font-semibold">
                                Total Items Sold: <span>{totalItemsSold}</span>
                            </p>
                            <p className="font-semibold">
                                Total Items Assigned: <span>{totalItemsAssigned}</span>
                            </p>
                            <p className="font-semibold">
                                Remaining Stock:{" "}
                                <span
                                    className={
                                        totalRemaining === 0 ? "text-red-600" : "text-green-700"
                                    }
                                >
                                    {totalRemaining}
                                </span>
                            </p>
                        </div>

                        {/* Stock Requests */}
                        {stockDetails.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-md font-semibold mb-4">
                                    Stock Requests Assigned
                                </h4>
                                {stockDetails?.map((req) => (
                                    <div
                                        key={req.id}
                                        className={`mb-6 border rounded-lg shadow-sm ${statusColor[req.status]
                                            }`}
                                    >
                                        <div className="px-4 py-2 flex justify-between items-center">
                                            <span className="font-semibold">
                                                Request ID: {req.id}
                                            </span>
                                            <div className="flex gap-4 items-center">
                                                <button
                                                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                    onClick={() =>
                                                        setExpanded(expanded === req.id ? null : req.id)
                                                    }
                                                >
                                                    {expanded === req.id ? "Hide" : "View More"}
                                                    <KeyboardArrowDownIcon
                                                        className={`w-5 h-5 transform transition-transform ${expanded === req.id ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Slide Animation */}
                                        <AnimatePresence>
                                            {expanded === req.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-4 py-3 text-sm text-gray-600">
                                                        Created At:{" "}
                                                        {new Date(req.created_at).toLocaleString()}
                                                    </div>

                                                    {/* Items Table */}
                                                    <table className="w-full border-collapse border border-gray-300 mt-2 text-sm">
                                                        <thead className="bg-gray-200">
                                                            <tr>
                                                                <th className="border px-3 py-1 text-left">
                                                                    Shape
                                                                </th>
                                                                <th className="border px-3 py-1 text-left">
                                                                    Description
                                                                </th>
                                                                <th className="border px-3 py-1 text-left">
                                                                    Quantity
                                                                </th>
                                                                <th className="border px-3 py-1 text-left">
                                                                    Total Qty
                                                                </th>
                                                                <th className="border px-3 py-1 text-left">
                                                                    Used Qty
                                                                </th>
                                                                <th className="border px-3 py-1 text-left">
                                                                    Remaining
                                                                </th>
                                                                <th className="border px-3 py-1 text-left">
                                                                    Quotation
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {req.items?.map((item) => {
                                                                const remaining =
                                                                    Math.abs(item.total_quantity - item.used_quantity);
                                                                return (
                                                                    <tr key={item.id}>
                                                                        <td className="border px-3 py-1">
                                                                            {item.shape}
                                                                        </td>
                                                                        <td className="border px-3 py-1">
                                                                            {item.description || "-"}
                                                                        </td>
                                                                        <td className="border px-3 py-1">
                                                                            {item.quantity}
                                                                        </td>
                                                                        <td className="border px-3 py-1">
                                                                            {item.total_quantity}
                                                                        </td>
                                                                        <td className="border px-3 py-1">
                                                                            {item.used_quantity}
                                                                        </td>
                                                                        <td
                                                                            className={`border px-3 py-1 font-semibold ${remaining === 0
                                                                                    ? "text-red-600"
                                                                                    : "text-green-600"
                                                                                }`}
                                                                        >
                                                                            {remaining}
                                                                        </td>
                                                                        <td className="border px-3 py-1">
                                                                            {item.quotations?.length > 0 ? (
                                                                                <table className="w-full border-collapse border border-gray-300 text-xs">
                                                                                    <thead className="bg-gray-100">
                                                                                        <tr>
                                                                                            <th className="border px-2 py-1 text-left">
                                                                                                Company
                                                                                            </th>
                                                                                            <th className="border px-2 py-1 text-left">
                                                                                                Price / Item
                                                                                            </th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {item.quotations.map((q) => (
                                                                                            <tr
                                                                                                key={q.id}
                                                                                                className={`${q.price === item.chosen_price
                                                                                                        ? "bg-green-200 font-semibold"
                                                                                                        : "bg-white"
                                                                                                    }`}
                                                                                            >
                                                                                                <td className="border px-2 py-1">
                                                                                                    {q.company_name}
                                                                                                </td>
                                                                                                <td className="border px-2 py-1">
                                                                                                    ${q.price}
                                                                                                </td>
                                                                                            </tr>
                                                                                        ))}
                                                                                    </tbody>
                                                                                </table>
                                                                            ) : (
                                                                                <span className="text-gray-500 italic text-xs">
                                                                                    No quotations
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => window.history.back()}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
