import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRevenueReport } from "../../services/salesService";
import { useNotification } from "../../hooks/useNotification";
import Sidebar from "../../components/layouts/Sidebar";
import Topbar from "../../components/layouts/Topbar";

export default function SubAdminDetails() {
    const { id } = useParams();
    const [details, setDetails] = useState(null);
    const { notifyError } = useNotification();

    useEffect(() => {
        (async () => {
            try {
                const res = await getRevenueReport(id);
                setDetails(res.data); // ✅ now stores single object
            } catch {
                notifyError("Failed to fetch sub-admin details");
            }
        })();
    }, [id]);

    if (!details) {
        return (
            <div className="flex justify-center items-center h-screen text-lg">
                Loading sub-admin details...
            </div>
        );
    }

    return (
        <div>
                    <Topbar title="Sub-Admin Revenue Report" />
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 p-6 bg-gray-50">
                    <div className="mt-6 bg-white shadow-md rounded p-6 max-w-lg mx-auto">
                        <h3 className="text-lg font-semibold mb-4">
                            Sub Admin ID: {details.sub_admin_id}
                        </h3>

                        <div className="space-y-3">
                            <p className="text-gray-700">
                                <span className="font-semibold">Total Revenue:</span> $
                                {details.total_revenue}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold">Total Items Sold:</span>{" "}
                                {details.total_items_sold}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold">Total Items Assigned:</span>{" "}
                                {details.total_items_assigned}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold">Remaining Stock:</span>{" "}
                                {details.total_items_assigned - details.total_items_sold}
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
