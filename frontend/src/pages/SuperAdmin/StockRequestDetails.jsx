import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getStockRequestById,
    selectQuotation,
} from "../../services/stockOrderService";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

export default function StockRequestDetails() {
    const { id } = useParams();
    const [details, setDetails] = useState(null);
    const { role } = useAuth();

    useEffect(() => {
        (async () => {
            try {
                const res = await getStockRequestById(id);
                setDetails(res.data);
            } catch {
                toast.error("Failed to fetch details");
            }
        })();
    }, [id]);

    const handleSelectQuotation = async (quotationId) => {
        try {
            await selectQuotation({ requestId: id, quotationId });
            toast.success("Quotation selected successfully!");
        } catch {
            toast.error("Failed to select quotation");
        }
    };

    if (!details) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Stock Request #{id}</h2>
            <h3 className="font-semibold mb-2">Items</h3>
            <ul className="list-disc pl-6 mb-4">
                {details.items.map((it) => (
                    <li key={it.id}>
                        {it.shape} — Qty: {it.quantity}{" "}
                        {it.price && `(Price: $${it.price})`}
                    </li>
                ))}
            </ul>

            <h3 className="font-semibold mb-2">Quotations</h3>
            <ul className="list-disc pl-6">
                {details.quotations.map((q) => (
                    <li key={q.id}>
                        Price: ${q.price} (From: {q.company_name})
                        {role === "super_admin" && (
                            <button
                                onClick={() => handleSelectQuotation(q.id)}
                                className="ml-4 bg-green-600 text-white px-3 py-1 rounded"
                            >
                                Select
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
