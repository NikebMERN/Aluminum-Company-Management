import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-6xl font-bold text-red-600">404</h1>
            <p className="text-xl mt-4">
                Oops! The page you’re looking for doesn’t exist.
            </p>
            <Link
                to="/"
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Go Home
            </Link>
        </div>
    );
}
