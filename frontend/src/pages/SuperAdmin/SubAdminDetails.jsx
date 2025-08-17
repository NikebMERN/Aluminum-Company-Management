import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRevenueReport } from "../../services/salesService";
import { useNotification } from "../../hooks/useNotification";
import Sidebar from "../../components/layouts/Sidebar";
import Topbar from "../../components/layouts/Topbar";

export default function SubAdminDetails() {
    const { id } = useParams();
    const [items, setItems] = useState([]);
    const { notifyError } = useNotification();

    useEffect(() => {
        (async () => {
            try {
                const res = await getRevenueReport(id);
                setItems(res.data); // ✅ now stores array of items
                console.log(res.data);
            } catch {
                notifyError("Failed to fetch sub-admin details");
            }
        })();
    }, [id]);

    if (!items.length) {
        return (
            <div className="flex justify-center items-center h-screen text-lg">
                Loading sub-admin details...
            </div>
        );
    }
    // ✅ compute totals in frontend safely
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

    return (
        <div>
            <Topbar title="Sub-Admin Revenue Report" />
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 p-6 bg-gray-50">
                    <div className="mt-6 bg-white shadow-md rounded p-6 max-w-4xl mx-auto">
                        <h3 className="text-lg font-semibold mb-6">
                            Sub Admin ID: {items[0].sub_admin_id}
                        </h3>

                        {/* ✅ Table for item details */}
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                        Item Name
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                        Price per Item
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                        Assigned Quantity
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                        Sold
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                        Remaining
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                        Revenue
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.item_id}>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {item.item_name}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            ${item.price_per_item}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {item.given_quantity}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {item.total_sold}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {item.given_quantity - item.total_sold}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            ${item.total_sold * item.price_per_item}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* ✅ Totals summary */}
                        <div className="mt-6 space-y-2">
                            <p className="text-gray-700">
                                <span className="font-semibold">Total Revenue:</span> $
                                {totalRevenue}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold">Total Items Sold:</span>{" "}
                                {totalItemsSold}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold">Total Items Assigned:</span>{" "}
                                {totalItemsAssigned}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold">Remaining Stock:</span>{" "}
                                {totalRemaining}
                            </p>
                        </div>

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
