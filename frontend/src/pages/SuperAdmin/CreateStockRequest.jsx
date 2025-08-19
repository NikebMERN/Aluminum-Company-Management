import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layouts/Sidebar";
import { getAllSubAdmins } from "../../services/adminService";
import {
    createStockRequest,
    getAllStockRequests,
} from "../../services/stockOrderService";

export default function CreateStockRequest() {
    const [items, setItems] = useState([
        { shape: "", quantity: "", description: "" },
    ]);
    const [assignedTo, setAssignedTo] = useState("");
    const [subAdmins, setSubAdmins] = useState([]);
    const [stockRequests, setStockRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const data = await getAllSubAdmins();
                setSubAdmins(data.data);
                const res = await getAllStockRequests();
                setStockRequests(res.data);
                console.log(res.data);
            } catch {
                toast.error("Failed to load sub-admins or stock requests");
            }
        })();
    }, []);
    // console.log(subAdmins);

    const handleChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addRow = () =>
        setItems([...items, { shape: "", quantity: "", description: "" }]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createStockRequest({ subAdminId: parseInt(assignedTo), items });
            toast.success("Stock request created successfully!");
            navigate("/super_admin");
        } catch {
            toast.error("Failed to create stock request");
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="p-6 flex-1">
                <h1 className="text-2xl font-bold mb-4">Create Stock Request</h1>

                {/* Stock Requests Table */}
                {stockRequests.length > 0 && (
                    <div className="overflow-x-auto border rounded mb-4">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2 border">Request ID</th>
                                    <th className="p-2 border">Sub Admin</th>
                                    <th className="p-2 border">Status</th>
                                    <th className="p-2 border">Created At</th>
                                    <th className="p-2 border">Items</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50" onClick={()=> navigate(`/super_admin/compare-quotations/${req.id}`)}>
                                        <td className="p-2 border">{req.id}</td>
                                        <td className="p-2 border">
                                            {subAdmins.find((sa) => sa.id === req.sub_admin_id)
                                                ?.name || req.sub_admin_id}
                                        </td>
                                        <td className="p-2 border">
                                            {req.status === "pending" && (
                                                <span className="text-red-600 font-semibold">
                                                    Pending ...
                                                </span>
                                            )}
                                            {req.status === "quotations_collected" && (
                                                <span className="text-yellow-600 font-semibold">
                                                    Quotations Collected
                                                </span>
                                            )}
                                            {req.status === "price_selected" && (
                                                <span className="text-green-600 font-semibold">
                                                    Price Selected
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-2 border">
                                            {new Date(req.created_at).toLocaleString()}
                                        </td>
                                        <td className="p-2 border">
                                            <ul>
                                                {req.items.map((item) => (
                                                    <li key={item.id}>
                                                        <strong>
                                                            {item.id}. {item.shape}
                                                        </strong>{" "}
                                                        - {item.quantity}{" "}
                                                        {item.description && `(${item.description})`}{" "}
                                                        {item.chosen_price && (
                                                            <span className="text-green-600 font-bold">
                                                                (Price: {item.chosen_price})
                                                            </span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Sub-admin Dropdown */}
                    <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="border p-2 w-full"
                        required
                    >
                        <option value="">Select Sub Admin</option>
                        {subAdmins.map((sa) => (
                            <option key={sa.id} value={sa.id}>
                                {sa.name}
                            </option>
                        ))}
                    </select>

                    {/* Dynamic Request Items Table */}
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 border">Shape</th>
                                <th className="p-2 border">Description</th>
                                <th className="p-2 border">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, i) => (
                                <tr key={i}>
                                    <td className="p-2 border">
                                        <input
                                            type="text"
                                            value={item.shape}
                                            onChange={(e) => handleChange(i, "shape", e.target.value)}
                                            className="w-full p-2 border"
                                            required
                                        />
                                    </td>
                                    <td className="p-2 border">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) =>
                                                handleChange(i, "description", e.target.value)
                                            }
                                            className="w-full p-2 border"
                                            required
                                        />
                                    </td>
                                    <td className="p-2 border">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleChange(i, "quantity", e.target.value)
                                            }
                                            className="w-full p-2 border"
                                            required
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        type="button"
                        onClick={addRow}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        + Add Row
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Create Request
                    </button>
                </form>
            </div>
        </div>
    );
}
