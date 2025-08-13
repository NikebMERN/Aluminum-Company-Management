import { useEffect, useState } from "react";
import { getMyOrders } from "../../services/customerService";
import { useNotification } from "../../hooks/useNotification";
import Sidebar from "../../components/layouts/Sidebar";
import Topbar from "../../components/layouts/Topbar";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const { notifyError } = useNotification();

    useEffect(() => {
        (async () => {
            try {
                const data = await getMyOrders();
                setOrders(data.data);
                console.log(data.data);
            } catch {
                notifyError("Failed to fetch orders");
            }
        })();
    }, []);

    return (
        <>
            <Topbar title="Customer Orders" />

            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 p-6">
                    <div className="mt-4 bg-white shadow rounded overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-200 text-left">
                                    <th className="p-2 border">Order ID</th>
                                    <th className="p-2 border">Shape</th>
                                    <th className="p-2 border">Bought Quantity</th>
                                    <th className="p-2 border">Total Revenue</th>
                                    <th className="p-2 border">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={order.id-index} className="hover:bg-gray-50">
                                        <td className="p-2 border">{order.id}</td>
                                        <td className="p-2 border">{order.shape}</td>
                                        <td className="p-2 border">{order.quantity}</td>
                                        <td className="p-2 border">
                                            ${order.quantity * order.price_per_item}
                                        </td>
                                        <td className="p-2 border">{order.order_date}</td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-4 text-center text-gray-500">
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
