import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GradingIcon from "@mui/icons-material/Grading";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from '@mui/icons-material/Dashboard';
import CreateIcon from '@mui/icons-material/Create';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';

export default function Sidebar() {
    const { role } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = {
        super_admin: [
            { name: "Dashboard", icon: <DashboardIcon />, path: "/super_admin" },
            {
                name: "Create Sub Admins",
                icon: <CreateIcon />,
                path: "/super_admin/create-subadmin",
            },
            { name: "Assign Aluminum", icon: <AssignmentLateIcon />, path: "/super_admin/assign" },
        ],
        sub_admin: [
            { name: "Dashboard", icon: <DashboardIcon />, path: "/sub_admin" },
            { name: "Update Sales", icon: <UpgradeIcon />, path: "/sub_admin/update-sales" },
            { name: "Sales", icon: <GradingIcon />, path: "/sub_admin/orders" },
            { name: "Notify Sold-Out", icon: <CircleNotificationsIcon />, path: "/sub_admin/notify-soldout" },
        ],
        customer: [
            { icon: <HomeIcon />, name: "Home", path: "/customer" },
            { icon: <ShoppingCartIcon />, name: "Cart", path: "/customer/cart" },
            { icon: <GradingIcon />, name: "Order", path: "/customer/orders" },
        ],
    };

    return (
        <>
            {/* Hamburger icon for mobile */}
            <button
                className="md:hidden p-2 m-2 rounded bg-gray-800 text-white fixed top-20 z-50 hover:bg-gray-700"
                onClick={() => setSidebarOpen(true)}
            >
                <MenuIcon />
            </button>

            {/* Sidebar for desktop */}
            <aside className="hidden md:block w-64 bg-gray-800 text-white shadow-lg sticky top-0 h-screen">
                {menuItems[role]?.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center p-2 rounded hover:bg-gray-600"
                    >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.name}
                    </Link>
                ))}
            </aside>

            {/* Mobile sidebar with smooth slide animation */}
            <div
                className={`fixed inset-0 z-40 flex transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Overlay background */}
                <div
                    className="inset-0 bg-black bg-opacity-50"
                    onClick={() => setSidebarOpen(false)}
                ></div>

                {/* Sidebar drawer */}
                <div className="relative w-64 bg-white shadow-lg p-4 overflow-y-auto">
                    <button
                        className="mb-4 p-2 rounded hover:bg-gray-200"
                        onClick={() => setSidebarOpen(false)}
                    >
                        Close
                    </button>
                    {menuItems[role]?.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center p-2 rounded hover:bg-gray-200"
                            onClick={() => setSidebarOpen(false)} // close on link click
                        >
                            {item.icon && <span className="mr-2">{item.icon}</span>}
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
