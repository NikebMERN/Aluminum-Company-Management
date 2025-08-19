import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    submitQuotations,
    getStockDetailsBySubAdmin,
} from "../../services/stockOrderService";
import { toast } from "react-hot-toast";
import Sidebar from "../../components/layouts/Sidebar";
import Topbar from "../../components/layouts/Topbar";

export default function SubmitQuotation() {
    const {
        id,
        // subid
    } = useParams();
    const [price, setPrice] = useState("");
    const [company, setCompany] = useState("");
    const [requestItem, setRequestItem] = useState(null);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchRequestItem = async () => {
    //         try {
    //             const res = await getStockDetailsBySubAdmin(subid);
    //             console.log(res.data);
    //             // Assuming you want the first item of the request
    //             if (res.data.items && res.data.items.length > 0) {
    //                 setRequestItem(res.data);
    //             }
    //         } catch (error) {
    //             toast.error("Failed to load request details");
    //         }
    //     };

    //     fetchRequestItem();
    // }, [subid]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const companyData = {
            requestItemId: id,
            quotations: [
                {
                    companyName: company,
                    price,
                },
            ],
        };

        try {
            await submitQuotations(companyData);
            toast.success("Quotation submitted successfully!");
            setPrice("");
            setCompany("");
            navigate("/sub_admin");
        } catch {
            toast.error("Failed to submit quotation");
        }
    };

    return (
        <>
            <Topbar title={`Submit Quotation for Request #${id}`} />
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar />

                <div className="flex-1 p-6">
                    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
                        <input
                            type="text"
                            placeholder="Company Name"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full border p-2"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full border p-2"
                            required
                        />

                        <button className="bg-blue-600 text-white px-4 py-2 rounded">
                            Submit
                        </button>
                    </form>

                    {requestItem && (
                        <div className="mt-6 bg-white shadow-md rounded p-4 max-w-md">
                            <h3 className="font-semibold mb-2">Request Item Details</h3>
                            <p>
                                <span className="font-semibold">Shape:</span>{" "}
                                {requestItem.shape}
                            </p>
                            <p>
                                <span className="font-semibold">Quantity:</span>{" "}
                                {requestItem.quantity}
                            </p>
                            <p>
                                <span className="font-semibold">Chosen Price:</span>{" "}
                                {requestItem.chosen_price || "Not selected"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
