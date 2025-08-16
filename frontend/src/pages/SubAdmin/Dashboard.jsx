import { useEffect, useState } from "react";
import { getAssignedItems } from "../../services/subAdminService";
import { useNotification } from "../../hooks/useNotification";
import { Link } from "react-router-dom";
// import BorderStyleIcon from '@mui/icons-material/BorderStyle';
import Sidebar from "../../components/layouts/Sidebar";
import Topbar from "../../components/layouts/Topbar";
// import Topbar from "../../components/layouts/Topbar";

export default function Dashboard() {
    const [items, setItems] = useState([]);
    const { notifyError } = useNotification();

    useEffect(() => {
        (async () => {
            try {
                const data = await getAssignedItems();
                console.log(data.data);
                setItems(data.data);
            } catch {
                notifyError("Failed to load assigned items");
            }
        })();
    }, []);

    return (
        <div>
            <Topbar title="My Assigned Aluminum Stock" />

            <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                {/* <Topbar /> */}
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border">Shape</th>
                            <th className="p-2 border">Given Qty</th>
                            <th className="p-2 border">Sold Qty</th>
                            <th className="p-2 border">Remaining</th>
                            <th className="p-2 border">Price/Item</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td className="p-2 border">{item.shape}</td>
                                <td className="p-2 border">{item.given_quantity}</td>
                                <td className="p-2 border">{item.sold_quantity}</td>
                                <td className="p-2 border">
                                    {(() => {
                                        const remaining = item.given_quantity - item.sold_quantity;

                                        if (remaining === 0) {
                                            return (
                                                <Link
                                                    to="/sub_admin/notify-soldout"
                                                    className="text-red-500"
                                                >
                                                    Out of Stock (Report)
                                                </Link>
                                            );
                                        } else if (remaining <= 20) {
                                            return (
                                                <Link
                                                    to="/sub_admin/notify-soldout"
                                                    className="text-yellow-500"
                                                >
                                                    {remaining}-Stock is running out (Report)
                                                </Link>
                                            );
                                        } else {
                                            return remaining;
                                        }
                                    })()}
                                </td>
                                <td className="p-2 border">${item.price_per_item}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* <button>
                <Link
                    to="/sub_admin/update-sales"
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Update Sales
                </Link>
            </button> */}
        </div>
    );
}
