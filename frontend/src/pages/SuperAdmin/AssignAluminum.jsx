import { useState, useEffect } from "react";
import { assignAluminum, getAllSubAdmins } from "../../services/adminService";
import { useNotification } from "../../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layouts/Sidebar";
import Topbar from "../../components/layouts/Topbar";
// import Topbar from "../../components/layouts/Topbar";

export default function AssignAluminum() {
    const [subAdmins, setSubAdmins] = useState([]);
    const [form, setForm] = useState({
        subAdminId: "",
        shape: "",
        price_per_item: "",
        quantity: "",
        imageFile: null,
    });
    const navigate = useNavigate();

    const { notifySuccess, notifyError } = useNotification();

    useEffect(() => {
        (async () => {
            try {
                const data = await getAllSubAdmins();
                setSubAdmins(data.data);
            } catch {
                notifyError("Failed to load sub-admins");
            }
        })();
    }, []);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // console.log(parseInt(form.subAdminId), form.shape, parseInt(form.quantity), parseFloat(form.price_per_item), form.imageFile);
            await assignAluminum(parseInt(form.subAdminId), form.shape, parseInt(form.quantity), parseFloat(form.price_per_item), form.imageFile);
            navigate("/super_admin");
            notifySuccess("Aluminum assigned successfully");
            setForm({ subAdminId: "", shape: "", quantity: "", price_per_item: "" });
        } catch {
            notifyError("Failed to assign aluminum");
        }
    };

    return (
        <div>
        <Topbar title="Assign Aluminum to Sub-Admin" />

        <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        {/* <Topbar /> */}
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-4 ">
                <select
                    name="subAdminId"
                    value={form.subAdminId}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                >
                    <option value="">Select Sub Admin</option>
                    {subAdmins.map((sa) => (
                        <option key={sa.id} value={sa.id}>
                            {sa.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    name="shape"
                    placeholder="Shape name"
                    value={form.shape}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
                <input
                    type="number"
                    name="price_per_item"
                    placeholder="Price per item"
                    value={form.price_per_item}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Assign
                </button>
            </form>
            </div>
        </div>
    );
}
