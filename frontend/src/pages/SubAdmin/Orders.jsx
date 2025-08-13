import { useEffect, useState } from "react";
import { getAssignedItems } from "../../services/subAdminService";
import { useNotification } from "../../hooks/useNotification";
import Sidebar from "../../components/layouts/Sidebar";
import Topbar from "../../components/layouts/Topbar";
// import Topbar from "../../components/layouts/Topbar";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const { notifyError } = useNotification();

    useEffect(() => {
        (async () => {
            try {
                const data = await getAssignedItems();
                setOrders(data.data);
                console.log(data.data)
            } catch {
                notifyError("Failed to fetch orders");
            }
        })();
    }, []);

    return (
        <div>
        <Topbar title="Sub-Admin Sold Quantity" />

        <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        {/* <Topbar /> */}
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">Order ID</th>
                        <th className="p-2 border">Shape</th>
                        <th className="p-2 border">Given Quantity</th>
                        <th className="p-2 border">Sold Quantity</th>
                        <th className="p-2 border">Total Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td className="p-2 border">{order.id}</td>
                            <td className="p-2 border">{order.shape}</td>
                            <td className="p-2 border">{order.given_quantity}</td>
                            {/* <td className="p-2 border">
                                {order.items.map((it) => it.shape).join(", ")}
                            </td> */}
                            <td className="p-2 border">{order.sold_quantity}</td>
                            <td className="p-2 border">${(order.sold_quantity) * (order.price_per_item)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
}
