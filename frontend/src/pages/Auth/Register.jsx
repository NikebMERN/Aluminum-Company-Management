import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";

export default function Register() {
    const { register } = useAuth();
    const { notifySuccess, notifyError } = useNotification();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, "customer");
            navigate("/login");
            notifySuccess("Account created! You can now login.");
        } catch (error) {
            notifyError(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow p-6 rounded mt-6 w-80 space-y-4"
            >
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
                >
                    Register
                </button>
                <p className="text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
