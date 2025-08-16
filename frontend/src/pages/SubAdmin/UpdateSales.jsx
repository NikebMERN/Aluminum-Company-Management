import { useState, useEffect } from "react";
import {
    updateSoldQuantity,
    getAssignedItems,
} from "../../services/subAdminService";
import { useNotification } from "../../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layouts/Sidebar";
import Topbar from "../../components/layouts/Topbar";
import { jsPDF } from "jspdf";

export default function UpdateSales() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ itemId: "", sold_quantity: "" });
    const [receipt, setReceipt] = useState(null); // ✅ Store receipt data
    const { notifySuccess, notifyError } = useNotification();
    const navigate = useNavigate();
    const now = new Date();
    const currentDate = `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    // console.log(currentDate);

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
            console.log(res.data);

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
                            <h2 className="text-xl font-semibold mb-3">
                                Item Issued ({currentDate})
                            </h2>
                            <p>
                                <strong>Item:</strong> {receipt.shape}
                            </p>
                            <p>
                                <strong>Item ID:</strong> {receipt.itemId}
                            </p>
                            <p>
                                <strong>Sub Admin ID:</strong> {receipt.subAdminId}
                            </p>
                            <p>
                                <strong>Quantity Sold:</strong> {receipt.quantitySold}
                            </p>
                            <p>
                                <strong>Remaining Quantity:</strong> {receipt.remainingQuantity}
                            </p>
                            <p>
                                <strong>Unit Price:</strong> {receipt.pricePerItem}
                            </p>
                            <p>
                                <strong>Total Price:</strong>{" "}
                                {parseInt(receipt.pricePerItem) * receipt.quantitySold +
                                    parseInt(receipt.pricePerItem) * receipt.quantitySold * 0.15}
                            </p>

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
                                <button
                                    onClick={() => {
                                        const doc = new jsPDF();

                                        // 🧾 Calculate values
                                        const unitPrice = parseFloat(receipt.pricePerItem);
                                        const subtotal = unitPrice * receipt.quantitySold;
                                        const vat = subtotal * 0.15; // 15% VAT
                                        const totalRevenue = subtotal + vat;

                                        // ===== HEADER (Company Info) =====
                                        doc.setFontSize(16);
                                        doc.text("Aluminum Company PLC", 65, 15); // Company name
                                        doc.setFontSize(10);
                                        doc.text("Addis Ababa, Ethiopia", 80, 20);
                                        doc.text("Tel: +251-900-000-000", 78, 25);
                                        doc.text(
                                            "-----------------------------------------",
                                            14,
                                            32
                                        );

                                        // ===== Receipt Title =====
                                        doc.setFontSize(14);
                                        doc.text("Sales Receipt", 85, 40);

                                        // ===== Receipt Info =====
                                        doc.setFontSize(12);
                                        doc.text(`Date: ${currentDate}`, 14, 50);
                                        doc.text(`Receipt ID: R-${receipt.itemId}`, 14, 57);

                                        // ===== Item Details =====
                                        doc.text(
                                            "-----------------------------------------",
                                            14,
                                            65
                                        );
                                        doc.text(`Item: ${receipt.shape}`, 14, 72);
                                        doc.text(`Item ID: ${receipt.itemId}`, 14, 79);
                                        doc.text(`Sub Admin ID: ${receipt.subAdminId}`, 14, 86);
                                        doc.text(`Quantity Sold: ${receipt.quantitySold}`, 14, 93);
                                        doc.text(
                                            `Unit Price: ${unitPrice.toFixed(2)} ETB`,
                                            14,
                                            100
                                        );
                                        doc.text(
                                            "-----------------------------------------",
                                            14,
                                            106
                                        );

                                        // ===== Financial Summary =====
                                        doc.text(`Subtotal: ${subtotal.toFixed(2)} ETB`, 14, 115);
                                        doc.text(`VAT (15%): ${vat.toFixed(2)} ETB`, 14, 122);
                                        doc.setFontSize(13);
                                        doc.text(
                                            `Total Revenue: ${totalRevenue.toFixed(2)} ETB`,
                                            14,
                                            132
                                        );

                                        // ===== Footer =====
                                        doc.setFontSize(10);
                                        doc.text(
                                            "-----------------------------------------",
                                            14,
                                            142
                                        );
                                        doc.text("Thank you for your business!", 75, 150);
                                        // doc.text(
                                        //     "Ethiopian VAT applied as per law (15%).",
                                        //     55,
                                        //     157
                                        // );

                                        // Save PDF
                                        doc.save(`receipt_${receipt.itemId}.pdf`);
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                    Download Receipt
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
