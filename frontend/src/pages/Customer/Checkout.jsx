import { useCart } from "../../context/CartContext";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layouts/Sidebar";
import { deductSoldQuantity, placeOrder } from "../../services/customerService";
import Topbar from "../../components/layouts/Topbar";
import { notifySoldOut } from "../../services/subAdminService";

export default function Checkout() {
    const { cartItems, totalPrice, clearCart } = useCart();
    const [customerInfo, setCustomerInfo] = useState({
        receiverName: "",
        companyName: "",
        email: "",
        phone: "",
        address: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const superAdminEmail = import.meta.env.VITE_API_ADMIN_EMAIL; // Replace with actual super admin email

    const handleInputChange = (e) => {
        setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
    };

    const handleCheckout = async () => {
        if (!customerInfo.receiverName || !customerInfo.phone || !customerInfo.address) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                customer: customerInfo,
                items: cartItems.map((item) => ({
                    itemId: item.id,
                    quantity: item.quantity,
                })),
                total: totalPrice,
            };

            const res = await placeOrder(payload);

            if (res.status === 201 || res.status === 200) {
                toast.success("Order placed successfully!");

                // 1️⃣ Update sold quantities and notify if sold out
                for (const item of cartItems) {
                    const qtyRes = await deductSoldQuantity(
                        parseInt(item.id),
                        parseInt(item.quantity)
                    );

                    if (qtyRes.status !== 200) {
                        toast.error(`Failed to update sold quantity for ${item.shape}`);
                        return;
                    }

                    const remaining = item.remainingQuantity - item.quantity;
                    if (remaining <= 0) {
                        const subject = `Stock Sold Out: ${item.shape}`;
                        const message = `
Product: ${item.shape}
Last Ordered By: ${customerInfo.receiverName}
Company: ${customerInfo.companyName || "Not provided"}
Delivery Address: ${customerInfo.address}
Quantity Ordered: ${item.quantity}
Sub-admin ID: ${item.subAdminId}
                        `;
                        try {
                            await notifySoldOut(superAdminEmail, subject, message);
                            toast.success(`Super Admin notified: ${item.shape} is sold out`);
                        } catch {
                            toast.error(`Failed to notify Super Admin for ${item.shape}`);
                        }
                    }
                }

                // 2️⃣ Send order confirmation to the customer (if email provided)
                if (customerInfo.email) {
                    const subject = "Order Confirmation - Aluminum Company";
                    const message = `
Dear ${customerInfo.receiverName},

Thank you for your order! Here are your order details:

${cartItems
                            .map(
                                (item) =>
                                    `${item.shape} x ${item.quantity} = $${(
                                        item.price_per_item * item.quantity
                                    ).toFixed(2)}`
                            )
                            .join("\n")}

Total Price: $${totalPrice.toFixed(2)}
Company: ${customerInfo.companyName || "Not provided"}
Delivery Address: ${customerInfo.address}

We will contact you shortly for delivery details.
                    `;

                    try {
                        await notifySoldOut(customerInfo.email, subject, message);
                        toast.success("Order confirmation email sent to customer");
                    } catch {
                        toast.error("Failed to send confirmation email to customer");
                    }
                }

                // 3️⃣ Send full order details to the super admin
                const adminSubject = "New Customer Order Placed";
                const adminMessage = `
A new order has been placed.

Receiver: ${customerInfo.receiverName}
Company: ${customerInfo.companyName || "Not provided"}
Phone: ${customerInfo.phone}
Email: ${customerInfo.email || "Not provided"}
Address: ${customerInfo.address}

Order Details:
${cartItems
                        .map(
                            (item) =>
                                `${item.shape} x ${item.quantity} = $${(
                                    item.price_per_item * item.quantity
                                ).toFixed(2)}`
                        )
                        .join("\n")}

Total Price: $${totalPrice.toFixed(2)}
                `;

                try {
                    await notifySoldOut(superAdminEmail, adminSubject, adminMessage);
                    toast.success("Super Admin notified of new order");
                } catch {
                    toast.error("Failed to notify super admin of order");
                }

                clearCart();
                setCustomerInfo({
                    receiverName: "",
                    companyName: "",
                    email: "",
                    phone: "",
                    address: "",
                });
                navigate("/customer/orders");
            } else {
                toast.error(res.data?.message || "Failed to place order");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Topbar title="Checkout" />
            <div className="flex min-h-screen bg-gray-50">
                <aside className="w-64 sticky top-0 h-screen">
                    <Sidebar />
                </aside>

                <main className="flex-1 p-6">
                    <div className="space-y-3 mb-6 max-w-lg">
                        <input
                            type="text"
                            name="receiverName"
                            placeholder="Receiver Name"
                            value={customerInfo.receiverName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            name="companyName"
                            placeholder="Company Name (optional)"
                            value={customerInfo.companyName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email (optional)"
                            value={customerInfo.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={customerInfo.phone}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <textarea
                            name="address"
                            placeholder="Delivery Address"
                            value={customerInfo.address}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            rows="3"
                            required
                        ></textarea>
                    </div>

                    <div className="border-t pt-4 mb-6">
                        <h3 className="text-lg font-semibold">Order Summary</h3>
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between py-1">
                                <span>
                                    {item.shape} x {item.quantity}
                                </span>
                                <span>${(item.price_per_item * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold border-t mt-2 pt-2">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded disabled:opacity-50"
                    >
                        {loading ? "Placing Order..." : "Place Order"}
                    </button>
                </main>
            </div>
        </>
    );
}
