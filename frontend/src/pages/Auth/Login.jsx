import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";
import RoleSelector from "../../components/common/RoleSelector";

// 👇 add icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const { login } = useAuth();
  const { notifySuccess, notifyError } = useNotification();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 toggle state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, role);
      notifySuccess("Login successful!");
      navigate(`/${role}`);
    } catch (error) {
      notifyError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <RoleSelector onRoleSelect={setRole} />
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded mt-6 w-80 space-y-4"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Password input with visibility toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded pr-10"
            required
          />
          <span
            className="absolute right-3 top-2 cursor-pointer text-gray-600 hover:text-gray-800"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </span>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        {role === "customer" && (
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500">
              Register
            </Link>
          </p>
        )}
      </form>
    </div>
  );
}
