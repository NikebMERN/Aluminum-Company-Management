import { useEffect, useState } from "react";
import { getAvailableItems } from "../../services/customerService";
import { useCart } from "../../context/CartContext";
import { useNotification } from "../../hooks/useNotification";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../../components/layouts/Sidebar";
import Topbar from "../../components/layouts/Topbar";

export default function Home() {
    const [items, setItems] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { addToCart } = useCart();
    const { notifyError, notifySuccess } = useNotification();

    useEffect(() => {
        (async () => {
            try {
                const data = await getAvailableItems();
                setItems(data.data);
            } catch {
                notifyError("Failed to load items");
            }
        })();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-gray-800 text-white p-4 shadow-md flex items-center justify-between">
                {/* <h1 className="text-xl md:text-2xl font-bold">
                    Available Aluminum Shapes
                </h1> */}
                <Topbar title="Available Aluminum Shapes" />
                {/* Hamburger icon for mobile */}
                {/* <button
                    className="md:hidden p-2 rounded hover:bg-gray-700"
                    onClick={() => setSidebarOpen(true)}
                >
                    <MenuIcon />
                </button> */}
            </nav>

            <div className="flex flex-1 min-h-0">
                {/* Sidebar for desktop */}
                {/* <aside className="hidden md:block w-64 bg-white shadow-lg sticky top-0 h-screen"> */}
                    <Sidebar />
                {/* </aside> */}

                {/* Mobile sidebar with slide-in animation */}
                {/* <div
                    className={`fixed inset-0 z-50 flex transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } md:hidden`}
                > */}
                    {/* Overlay */}
                    {/* <div
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={() => setSidebarOpen(false)}
                    ></div> */}

                    {/* Sidebar drawer */}
                    {/* <div className="relative w-64 bg-white shadow-lg p-4 overflow-y-auto">
                        <button
                            className="mb-4 p-2 rounded hover:bg-gray-200"
                            onClick={() => setSidebarOpen(false)}
                        >
                            Close
                        </button>
                        <Sidebar />
                    </div>
                </div> */}

                {/* Main content */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items?.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
                            >
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                    {item.shape}
                                </h2>
                                <p className="text-gray-600">
                                    Price:{" "}
                                    <span className="font-medium">${item.price_per_item}</span>
                                </p>
                                <p className="text-gray-600">
                                    Available:{" "}
                                    <span className="font-medium">{item.available_quantity}</span>
                                </p>
                                <button
                                    onClick={() => {
                                        addToCart(item);
                                        notifySuccess("Item added to cart");
                                    }}
                                    className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
