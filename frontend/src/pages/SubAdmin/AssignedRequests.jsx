import { useEffect, useState } from "react";
import Sidebar from "../../components/layouts/Sidebar";
import { getStockDetailsBySubAdmin } from "../../services/stockOrderService";
import { useNotification } from "../../hooks/useNotification";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function AssignedRequests() {
    const [requests, setRequests] = useState([]);
    const { notifyError } = useNotification();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        (async () => {
            try {
                const res = await getStockDetailsBySubAdmin(user.id);
                setRequests(res.data);
            } catch {
                notifyError("Failed to load assigned requests");
            }
        })();
    }, [user]);

    return (
        <div className="flex">
            <Sidebar />
            <div className="p-6 flex-1">
                <h1 className="text-2xl font-bold mb-6">Assigned Stock Requests</h1>

                {requests.length === 0 ? (
                    <p className="text-gray-600">No assigned requests yet.</p>
                ) : (
                    requests.map((req) => (
                        <div
                            key={req.id}
                            className="border p-4 rounded-lg mb-6 bg-white shadow-md"
                        >
                            <h2 className="font-semibold text-xl mb-4 text-gray-800">
                                Request #{req.id}
                            </h2>

                            {/* Table for items in the request */}
                            <table className="w-full border-collapse border border-gray-200 text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border border-gray-200 px-4 py-2 text-left">
                                            Shape
                                        </th>
                                        <th className="border border-gray-200 px-4 py-2 text-left">
                                            Description
                                        </th>
                                        <th className="border border-gray-200 px-4 py-2 text-left">
                                            Quantity
                                        </th>
                                        <th className="border border-gray-200 px-4 py-2 text-left">
                                            Quotation
                                        </th>
                                        <th className="border border-gray-200 px-4 py-2 text-left">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {req.items?.map((it) => (
                                        <tr key={it.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-200 px-4 py-2">
                                                {it.shape}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-2">
                                                {it.description || "-"}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-2">
                                                {it.quantity}
                                            </td>

                                            {/* Quotation column with inner table */}
                                            <td className="border border-gray-200 px-4 py-2">
                                                {it.quotations?.length > 0 ? (
                                                    <table className="w-full border-collapse border border-gray-300 text-xs rounded">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="border border-gray-300 px-2 py-1 text-left">
                                                                    Company
                                                                </th>
                                                                <th className="border border-gray-300 px-2 py-1 text-left">
                                                                    Price / Item
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {it.quotations.map((q, index) => (
                                                                <tr
                                                                    key={q.id}
                                                                    className={
                                                                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                                    }
                                                                >
                                                                    <td className="border border-gray-300 px-2 py-1">
                                                                        {q.company_name}
                                                                    </td>
                                                                    <td className="border border-gray-300 px-2 py-1">
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

                                            <td className="border border-gray-200 px-4 py-2">
                                                <Link
                                                    to={`/sub_admin/submit-quotation/${it.id}/${req.sub_admin_id}`}
                                                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                                                >
                                                    Submit Quotation
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
