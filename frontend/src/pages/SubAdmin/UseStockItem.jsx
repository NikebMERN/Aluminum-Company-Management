import { useEffect, useState } from "react";
import Sidebar from "../../components/layouts/Sidebar";
import Topbar from "../../components/layouts/Topbar";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../hooks/useNotification";
import { toast } from "react-hot-toast";
import {
    useStockItem,
    getStockDetailsBySubAdmin,
} from "../../services/stockOrderService";

export default function UseStockItem() {
    const { user } = useAuth();
    const { notifyError } = useNotification();
    const [requests, setRequests] = useState([]);
    const [deducted, setDeducted] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState("");
    const [quantity, setQuantity] = useState("");

    // Fetch all assigned stock for this sub-admin
    useEffect(() => {
        if (!user) return;

        (async () => {
            try {
                const res = await getStockDetailsBySubAdmin(user.id);
                setRequests(res.data || []);
            } catch {
                notifyError("Failed to load assigned stock");
            }
        })();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((!selectedItemId || !quantity)) return;
        for(let m of requests) {
            for(let itm of m.items) {
                if(itm.id == selectedItemId) {  
                    if(quantity > (itm.quantity - itm.used_quantity)) {
                        // console.log(itm.quantity - itm.used_quantity)
                        toast.error("Quantity exceeds available stock");
                        return;
                        // console.log("exceeds");
                        // break;
                    }
                }
            }
        }

        try {
            // console.log(selectedItemId, quantity);
            const res = await useStockItem({
                projectStockId: selectedItemId,
                usedQuantity: Number(quantity),
            });
            // console.log(res.data);
            setDeducted(res.data);

            toast.success("Stock item deducted successfully!");
            setSelectedItemId("");
            setQuantity("");

            // refresh stock after deduction
            const refreshed = await getStockDetailsBySubAdmin(user.id);
            setRequests(refreshed.data || []);
        } catch {
            toast.error("Failed to deduct stock item");
        }
    };

    return (
        <>
            <Topbar title="Use Stock Item" />
            <div className="flex min-h-screen bg-gray-50">
                <aside className="w-64 sticky top-0 h-screen">
                    <Sidebar />
                </aside>

                <div className="flex-1 p-6">
                    <h2 className="text-xl font-bold mb-4">Deduct Stock</h2>
                    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
                        <select
                            value={selectedItemId}
                            onChange={(e) => setSelectedItemId(e.target.value)}
                            className="w-full border p-2"
                            required
                        >
                            <option value="">Select an item</option>
                            {requests.map(
                                (req) =>
                                    req.status === "price_selected" &&
                                    req.items?.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.shape}
                                            {item.description ? ` - ${item.description}` : ""}
                                        </option>
                                    ))
                            )}
                        </select>

                        <input
                            type="number"
                            placeholder="Quantity to deduct"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full border p-2"
                            required
                        />

                        <button className="bg-blue-600 text-white px-4 py-2 rounded">
                            Deduct
                        </button>
                    </form>
                    {deducted && (
                        <div className="mt-4 p-4 border rounded bg-green-50 shadow-sm">
                            <h3 className="font-semibold text-green-700 mb-2">
                                {deducted.message}
                            </h3>
                            <p>
                                <span className="font-medium">Deducted:</span>{" "}
                                {deducted.deducted}
                            </p>
                            <p>
                                <span className="font-medium">Used Quantity:</span>{" "}
                                {deducted.used_quantity}
                            </p>
                            <p>
                                <span className="font-medium">Remaining:</span>{" "}
                                {deducted.total ? deducted.total : ""}
                            </p>
                        </div>
                    )}

                    {requests.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-semibold mb-2">Assigned Stock Items</h3>
                            {requests.map((req) => (
                                <div
                                    key={req.id}
                                    className="border p-3 rounded mb-3 bg-white shadow-sm"
                                >
                                    <p className="font-semibold mb-2">
                                        Request #{req.id} —{" "}
                                        {req.status === "pending" && (
                                            <span className="text-red-600 font-semibold">
                                                Not purchased yet
                                            </span>
                                        )}
                                        {req.status === "quotations_collected" && (
                                            <span className="text-yellow-600 font-semibold">
                                                Coming soon...
                                            </span>
                                        )}
                                        {req.status === "price_selected" && (
                                            <span className="text-green-600 font-semibold">
                                                Purchased
                                            </span>
                                        )}
                                    </p>
                                    <ul className="list-disc ml-6">
                                        {req.items?.map((item) => {
                                            const remaining = item.quantity - item.used_quantity;
                                            {
                                                /* console.log(item); */
                                            }
                                            return (
                                                <li key={item.id}>
                                                    <span className="font-medium">
                                                        {item.shape}
                                                        {item.description ? ` - ${item.description}` : ""}
                                                    </span>{" "}
                                                    <div className="ml-2 text-sm text-gray-700">
                                                        Total: {item.quantity} | Used: {item.used_quantity}{" "}
                                                        | Remaining: {remaining}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
