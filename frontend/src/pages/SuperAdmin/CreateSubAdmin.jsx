import { useState } from "react";
import { useNotification } from "../../context/NotificationContext";
import api from "../../services/api";
import { createSubAdmin } from "../../services/adminService";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layouts/Sidebar";

export default function CreateSubAdmin() {
    const { notifySuccess, notifyError } = useNotification();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            return notifyError("All fields are required");
        }

        try {
            setLoading(true);
            const res = await createSubAdmin(
                formData.name,
                formData.email,
                formData.password
            );
            navigate("/super_admin");
            notifySuccess(res.data.message || "Sub-admin created successfully");
            setFormData({ name: "", email: "", password: "" });
        } catch (error) {
            notifyError(
                error.response?.data?.message || "Failed to create sub-admin"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex">
        <Sidebar />
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Create New Sub-Admin</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
                        placeholder="Enter full name"
                    />
                </div>

                <div>
                    <label className="block font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
                        placeholder="Enter email address"
                    />
                </div>

                <div>
                    <label className="block font-medium">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
                        placeholder="Enter password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Sub-Admin"}
                </button>
            </form>
        </div>
        </div>
    );
}
