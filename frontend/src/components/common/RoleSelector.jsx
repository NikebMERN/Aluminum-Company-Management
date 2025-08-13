import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoleSelector({ onRoleSelect }) {
    const [selectedRole, setSelectedRole] = useState("");
    const navigate = useNavigate();

    const handleChange = (role) => {
        setSelectedRole(role);
        onRoleSelect(role);
        navigate(`/login`);
    };

    return (
        <div className="flex space-x-4 justify-center mt-4">
            {["super_admin", "sub_admin", "customer"].map((role) => (
                <button
                    key={role}
                    onClick={() => handleChange(role)}
                    className={`px-4 py-2 rounded ${selectedRole === role
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                >
                    {role.replace("_", " ").toUpperCase()}
                </button>
            ))}
        </div>
    );
}
