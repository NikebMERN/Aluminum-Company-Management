import { useState, useEffect } from "react";
import {
    notifySoldOut,
    getAssignedItems,
} from "../../services/subAdminService";
import { useNotification } from "../../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layouts/Sidebar";
import Topbar from "../../components/layouts/Topbar";
// import Topbar from "../../components/layouts/Topbar";

export default function NotifySoldOut() {
    const [items, setItems] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const { notifySuccess, notifyError } = useNotification();
    const toEmail = "matimahtem@gmail.com"; // Replace with actual super admin email
    const subject = "Stock Sold Out Notification";
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const data = await getAssignedItems();
                setItems(data.data);
                // console.log(data.data);
            } catch {
                notifyError("Failed to load items");
            }
        })();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let message = `The aluminum item with Shape: ${selectedId} is sold out. Please take necessary actions.`;
            await notifySoldOut(toEmail, subject, message);
            notifySuccess("Notification sent to super admin");
            setSelectedId("");
            navigate("/sub_admin");
        } catch {
            notifyError("Failed to send notification");
        }
    };

    return (
        <div>
                    <Topbar title="Notify Stock Sold-Out" />
            <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            {/* <Topbar /> */}
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-4">
                <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="border p-2 w-full"
                    required
                >
                    <option value="">Select Item</option>
                    {items.map((it) => (
                        <option key={it.id} value={it.shape}>
                            {it.shape}
                        </option>
                    ))}
                </select>
                <button className="bg-red-600 text-white px-4 py-2 rounded">
                    Send Notification
                </button>
            </form>
        </div>
        </div>
    );
}
