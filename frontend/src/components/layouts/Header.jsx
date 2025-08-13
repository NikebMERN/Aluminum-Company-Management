import { useAuth } from "../../hooks/useAuth";

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="bg-blue-600 text-white flex justify-between items-center px-4 py-3">
            <h1 className="text-xl font-bold">Aluminum Company</h1>
            <div className="flex items-center gap-4">
                <span>
                    {user?.name} (Role: {user?.role})
                </span>
                <button
                    onClick={logout}
                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}
