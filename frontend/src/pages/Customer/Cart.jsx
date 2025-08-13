import Sidebar from "../../components/layouts/Sidebar";
import Topbar from "../../components/layouts/Topbar";
import { useCart } from "../../context/CartContext";
import { useNotification } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } =
        useCart();
    const { notifySuccess, notifyError } = useNotification();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            notifyError("Your cart is empty!");
            return;
        }
        navigate("/customer/checkout");
    };

    return (
        <>
                    <Topbar title="Shopping Cart" />

            <div className="flex min-h-screen bg-gray-50">
                {/* Sidebar */}
                <aside className="w-64 sticky top-0 h-screen">
                    <Sidebar />
                </aside>

                {/* Main content */}
                <main className="flex-1 p-6">

                    {cartItems.length === 0 ? (
                        <p className="text-gray-700">Your cart is empty.</p>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow rounded-md"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-bold">{item.shape}</h3>
                                        <p className="text-sm text-gray-600">
                                            Price: ${item.price_per_item}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 my-2 md:my-0">
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity - 1,
                                                    item.available_quantity
                                                )
                                            }
                                            className="px-2 py-1 border rounded"
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity + 1,
                                                    item.available_quantity
                                                )
                                            }
                                            className="px-2 py-1 border rounded"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">
                                            ${(item.price_per_item * item.quantity).toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                                <span className="font-bold text-lg">
                                    Total: ${totalPrice.toFixed(2)}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={clearCart}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Clear Cart
                                    </button>
                                    <button
                                        onClick={handleCheckout}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
