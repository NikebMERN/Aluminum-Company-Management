import { useState, useEffect } from "react";
import {
    updateSoldQuantity,
    getAssignedItems,
} from "../../services/subAdminService";
import { useNotification } from "../../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layouts/Sidebar";
import Topbar from "../../components/layouts/Topbar";

export default function UpdateSales() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ itemId: "", sold_quantity: "" });
    const [receipt, setReceipt] = useState(null); // ✅ Store receipt data
    const { notifySuccess, notifyError } = useNotification();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const data = await getAssignedItems();
                setItems(data.data);
            } catch {
                notifyError("Failed to load items");
            }
        })();
    }, []);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await updateSoldQuantity(
                parseInt(form.itemId),
                parseInt(form.sold_quantity)
            );

            notifySuccess("Sales updated successfully");

            // ✅ Save receipt data
            setReceipt(res.data);

            // Reset form
            setForm({ itemId: "", sold_quantity: "" });
        } catch {
            notifyError("Failed to update sales");
        }
    };

    return (
        <div>
            <Topbar title="Update Sold Quantities" />

            <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <div className="p-4 w-full">
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                        <select
                            name="itemId"
                            value={form.itemId}
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        >
                            <option value="">Select Item</option>
                            {items.map((it) => (
                                <option key={it.id} value={it.id}>
                                    {it.shape}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            name="sold_quantity"
                            placeholder="Sold Quantity"
                            value={form.sold_quantity}
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded">
                            Update Sales
                        </button>
                    </form>

                    {/* ✅ Receipt Section */}
                    {receipt && (
                        <div className="mt-8 p-4 border rounded shadow bg-white">
                            <h2 className="text-xl font-semibold mb-3">Sales Receipt</h2>
                            <p><strong>Item:</strong> {receipt.shape}</p>
                            <p><strong>Item ID:</strong> {receipt.itemId}</p>
                            <p><strong>Sub Admin ID:</strong> {receipt.subAdminId}</p>
                            <p><strong>Quantity Sold:</strong> {receipt.quantitySold}</p>
                            <p><strong>Remaining Quantity:</strong> {receipt.remainingQuantity}</p>

                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={() => navigate("/sub_admin")}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                >
                                    Back to Dashboard
                                </button>
                                <button
                                    onClick={() => setReceipt(null)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                                >
                                    Clear Receipt
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
