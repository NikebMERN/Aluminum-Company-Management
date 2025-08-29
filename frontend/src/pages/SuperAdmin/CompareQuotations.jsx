import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    getQuotationsByRequest,
    approveStockQuotation,
    disapproveStockQuotation, // ✅ new service function
} from "../../services/stockOrderService";
import Sidebar from "../../components/layouts/Sidebar";
import Topbar from "../../components/layouts/Topbar";

export default function CompareQuotations() {
    const { requestId } = useParams();
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchQuotations = async () => {
        try {
            setLoading(true);
            const res = await getQuotationsByRequest(requestId);
            setQuotations(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load quotations");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (quotationId) => {
        try {
            const res = await approveStockQuotation(quotationId);
            if (res.status === 200) {
                toast.success("Quotation approved successfully!");
                fetchQuotations();
                navigate(`/super_admin/create-stock-request`);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to approve quotation"
            );
        }
    };

    const handleDisapprove = async (quotationId) => {
        try {
            console.log(quotationId);
            const res = await disapproveStockQuotation(quotationId); // ✅ call API to delete
            if (res.status === 200) {
                toast.success("Quotation disapproved and deleted!");
                fetchQuotations();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to disapprove quotation"
            );
        }
    };

    useEffect(() => {
        fetchQuotations();
    }, [requestId]);

    return (
        <>
            <Topbar title="Compare Quotations" />
            <div className="flex min-h-screen bg-gray-50">
                <aside className="w-64 sticky top-0 h-screen">
                    <Sidebar />
                </aside>
                <main className="flex-1 p-6">
                    <h1 className="text-2xl font-bold mb-4">
                        Quotations for Request #{requestId}
                    </h1>

                    {loading ? (
                        <p>Loading quotations...</p>
                    ) : quotations.length === 0 ? (
                        <p>No quotations submitted yet.</p>
                    ) : (
                        <table className="w-full border">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2 border">Quotation ID</th>
                                    <th className="p-2 border">Company Name</th>
                                    <th className="p-2 border">Price</th>
                                    <th className="p-2 border">Shape</th>
                                    <th className="p-2 border">Status</th>
                                    <th className="p-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotations.map((q) => (
                                    <tr key={q.id}>
                                        <td className="p-2 border">{q.id}</td>
                                        <td className="p-2 border">{q.company_name}</td>
                                        <td className="p-2 border">${q.price}</td>
                                        <td className="p-2 border">{q.shape}</td>
                                        <td
                                            className={`p-2 border ${q.status === "approved"
                                                    ? "text-green-600 font-semibold"
                                                    : "text-gray-600"
                                                }`}
                                        >
                                            {q.status}
                                        </td>
                                        <td className="p-2 border text-center space-x-2">
                                            {q.status === "approved" ? (
                                                <>
                                                    <span className="text-green-600">✔ Approved</span>
                                                    <button
                                                        onClick={() => handleDisapprove(q.id)}
                                                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                                                    >
                                                        Disapprove
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(q.id)}
                                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleDisapprove(q.id)}
                                                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                                                    >
                                                        Disapprove
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </main>
            </div>
        </>
    );
}
